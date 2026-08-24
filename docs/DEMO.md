# SecureCloud — Hướng dẫn triển khai trên AWS (Demo HTTPS & Bảo mật truy cập)

Tài liệu này hướng dẫn từng bước triển khai website SecureCloud lên AWS
để trình diễy đề tài **"Triển khai HTTPS và bảo mật truy cập cho Website Cloud"**.

> **Yêu cầu trước:** website đã hoạt động local (xem `README.md`), có tài khoản AWS
> và một **domain thật** (để cấp SSL certificate). Nếu chưa có domain, làm đến
> bước ALB + HTTP trước, thêm HTTPS sau.

---

## 0. Kiến trúc mục tiêu

```text
                        🌐 INTERNET
                             │
                HTTP :80 ────┴──── HTTPS :443
                             │  (301 redirect)
                             ▼
                   ┌─────────────────────┐
                   │ Application Load    │  Public Subnet
                   │ Balancer (ALB)      │  10.0.1.0/24
                   └──────────┬──────────┘
                              │ HTTP :80 (nội bộ)
                              ▼
                   ┌─────────────────────┐
                   │ EC2 Web Server      │  Private Subnet
                   │ Nginx + SecureCloud │  10.0.2.0/24
                   │ (không có Public IP)│
                   └─────────────────────┘

Kênh quản trị:
   Administrator ──SSH:22──► Bastion Host ──SSH:22──► EC2 Private
                            (Public Subnet)
```

**5 lớp bảo mật trình bày:**
1. VPC / Subnet cô lập (Public vs Private)
2. Security Group (quyền tối thiểu)
3. HTTPS / SSL-TLS (ALB + ACM)
4. Nginx Security Headers
5. Logging / Monitoring

---

## 1. Chuẩn bị nội dung website

Website đã có sẵn trong thư mục `Code/`:

```text
Code/
├── index.html      ← Trang chủ (hiện trạng thái HTTPS)
├── login.html      ← Trang đăng nhập demo
├── dashboard.html  ← Trang được bảo vệ (cần đăng nhập)
├── css/style.css
└── js/security.js  ← Kiểm tra HTTP/HTTPS, login, logout, checkAuth
```

Kiểm tra local trước khi deploy:

```bash
cd Code
python -m http.server 8000
# mở http://localhost:8000/index.html
```

> Ở local hiện **⚠️ HTTP Connection** là bình thường (chưa có HTTPS).

---

## 2. Giai đoạn 1 — Tạo mạng (VPC & Subnet)

Trong AWS Console → **VPC**:

### 2.1 VPC
- Name: `securecloud-vpc`
- IPv4 CIDR: `10.0.0.0/16`
- Tenancy: Default

### 2.2 Internet Gateway
- Tạo `securecloud-igw`, gắn vào VPC.

### 2.3 Public Subnet (cho ALB / Bastion)
- Name: `securecloud-public`
- CIDR: `10.0.1.0/24`
- **Enable auto-assign public IPv4**

### 2.4 Private Subnet (cho Web Server)
- Name: `securecloud-private`
- CIDR: `10.0.2.0/24`
- **Không** gán public IPv4

### 2.5 Route Tables
- **Public route table:** `0.0.0.0/0 → Internet Gateway`
- **Private route table:** mặc định (không ra Internet), hoặc nếu cần cập nhật package thì thêm NAT Gateway:

```text
Private EC2 → NAT Gateway → Internet Gateway → Internet
```

> ⚠️ NAT Gateway **phát sinh chi phí** (~$32/tháng). Nếu muốn tiết kiệm,
> tạo EC2 có cài đủ package trước, hoặc tạo NAT tạm thời rồi xóa.

---

## 3. Giai đoạn 2 — Tạo Security Groups

Trong **EC2 → Security Groups**, tạo 3 nhóm:

### 3.1 `securecloud-alb-sg` (cho ALB)
| Type | Port | Source |
|---|---|---|
| HTTP | 80 | `0.0.0.0/0` |
| HTTPS | 443 | `0.0.0.0/0` |

### 3.2 `securecloud-web-sg` (cho Web Server — Private)
| Type | Port | Source |
|---|---|---|
| HTTP | 80 | `securecloud-alb-sg` (chỉ ALB) |
| SSH | 22 | `securecloud-bastion-sg` (chỉ Bastion) |

> ❌ **KHÔNG** mở SSH hay HTTP từ `0.0.0.0/0` vào Web Server.

### 3.3 `securecloud-bastion-sg` (cho Bastion Host)
| Type | Port | Source |
|---|---|---|
| SSH | 22 | IP của bạn (VD `203.0.113.5/32`) |

---

## 4. Giai đoạn 3 — Tạo EC2 Web Server (Private Subnet)

1. **EC2 → Launch Instance**
2. AMI: **Amazon Linux 2023** (`al2023-ami-*-x86_64`) — khớp với plan CLI
3. Instance type: `t2.micro` / `t3.micro` (free tier)
4. VPC: `securecloud-vpc`, Subnet: `securecloud-private`
5. **Public IPv4: None** ← điểm demo quan trọng
6. Security Group: `securecloud-web-sg`
7. Key pair: dùng key `keypair` đã tạo ở bước chuẩn bị (file `keypair.pem`, **đừng commit lên git**)
8. Launch → ghi lại **Private IP** (VD `10.0.2.10`)

---

## 5. Giai đoạn 4 — Cài Nginx & Deploy website

SSH vào Web Server (qua Bastion, xem mục 6) — Amazon Linux dùng user `ec2-user`:

```bash
sudo yum update -y
sudo yum install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

Copy nội dung `Code/` lên server bằng `scp` từ máy cá nhân (hoặc qua Bastion):

```bash
scp -i keypair.pem -r Code/* ec2-user@10.0.2.10:/usr/share/nginx/html/
```

Kết quả trong `/usr/share/nginx/html`:

```text
/usr/share/nginx/html/
├── index.html
├── login.html
├── dashboard.html
├── css/style.css
└── js/security.js
```

Tạo config Nginx từ file `nginx/securecloud.conf` của project
(Amazon Linux đọc config trong `/etc/nginx/conf.d/`):

```bash
sudo cp securecloud.conf /etc/nginx/conf.d/securecloud.conf
sudo nginx -t    # kỳ vọng: "syntax is ok / test is successful"
sudo systemctl restart nginx
```

> Nếu `nginx -t` báo lỗi trùng `server` block, hãy xóa/comment khối `server { }`
> mặc định trong `/etc/nginx/nginx.conf` (chỉ giữ lại các dòng `include`).

`nginx/securecloud.conf` đã có sẵn security headers:
- `Strict-Transport-Security`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `Referrer-Policy`

---

## 6. Giai đoạn 5 — (Tùy chọn) Bastion Host

Nếu Web Server chưa cài Nginx/deploy, tạo thêm 1 EC2 `t3.micro`:

- Subnet: `securecloud-public`, SG: `securecloud-bastion-sg`
- Có Public IP, cùng key pair `keypair`

Kết nối móc xích (Amazon Linux dùng user `ec2-user`):

```bash
# từ máy cá nhân → Bastion → Web Server
ssh -i keypair.pem ec2-user@<bastion-public-ip>
ssh -i keypair.pem ec2-user@10.0.2.10
```

> SSH trực tiếp `ec2-user@<web-public-ip>` sẽ **timeout** — chính là minh chứng
> cho Security Group + Private Subnet.

---

## 7. Giai đoạn 6 — Tạo Target Group & ALB

**EC2 → Load Balancers → Create Application Load Balancer:**

1. Name: `securecloud-alb`
2. Scheme: **Internet-facing**, IP: IPv4
3. VPC: `securecloud-vpc`
4. Mappings: chọn **Public Subnet** (cả 2 AZ nếu có)
5. SG: `securecloud-alb-sg`
6. **Listener:** HTTP:80 (chưa cần HTTPS vội)

**Target Group:**
- Type: **Instances**, Protocol: HTTP, Port: **80**
- Health check: `HTTP` path `/`, interval 30s
- Register: chọn EC2 Private → *Include as pending below* → Create

Chờ vài phút, kiểm tra:

```text
Targets:  10.0.2.10  →  Healthy
```

Lấy **DNS name** của ALB (VD `securecloud-alb-xxxx.elb.amazonaws.com`).
Mở thử HTTP → website hiện **⚠️ HTTP Connection** (chưa có HTTPS).

---

## 8. Giai đoạn 7 — Domain & SSL Certificate (ACM)

1. **Route 53** (hoặc nhà cung cấp domain): trỏ bản ghi:

```text
Type:  A (Alias)
Name:  demo.yourdomain.com
Value: securecloud-alb (chọn Alias → chọn ALB)
```

2. **AWS Certificate Manager → Request certificate:**
   - Domain: `demo.yourdomain.com`
   - Validation: DNS (tạo bản ghi CNAME do ACM cấp)
   - Chờ trạng thái: **Issued**

> ❌ Không thể cấp certificate cho domain giả — phải có domain thật.

---

## 9. Giai đoạn 8 — HTTPS Listener & Redirect

**ALB → Listeners:**

### 9.1 HTTPS :443
- **Add listener** → Protocol: HTTPS, Port: 443
- Default action: Forward → target group `securecloud`
- Certificate: chọn certificate **Issued** ở trên

### 9.2 HTTP :80 → Redirect
- Sửa listener HTTP:80
- Default action → **Redirect**
  - Protocol: HTTPS
  - Port: 443
  - Status code: **301**
  - Host/Path: giữ nguyên

> Sau bước này: mở `http://demo.yourdomain.com` → tự chuyển 301 → `https://...`

---

## 10. Giai đoạn 9 — Kiểm tra Demo

### Demo 1 — HTTP → HTTPS Redirect
```
Mở http://demo.yourdomain.com
→ tự chuyển https://demo.yourdomain.com
→ website hiện "🔒 Secure HTTPS Connection"
→ bấm ổ khóa: certificate hợp lệ
```

### Demo 2 — Private Subnet
```
EC2 console:  Public IPv4 = None,  Private IP = 10.0.2.x
Thử: curl http://10.0.2.x   →   không kết nối được
```

### Demo 3 — Security Group
```
SSH trực tiếp tới Web Server  →  timeout (bị chặn)
SSH qua Bastion               →  thành công
```

### Demo 4 — Security Headers
```bash
curl -I https://demo.yourdomain.com
# Kiểm tra: Strict-Transport-Security, X-Content-Type-Options,
#           X-Frame-Options, Referrer-Policy
```

### Demo 5 — Logging
```bash
sudo tail -f /var/log/nginx/access.log   # trên Web Server
# truy cập website → thấy request mới
```
Hoặc: ALB access logs / VPC Flow Logs / CloudWatch.

### Demo 6 — Kiểm soát truy cập (chức năng web)
```
Truy cập https://.../dashboard.html khi chưa đăng nhập  →  bị chuyển về login.html
Đăng nhập admin / admin123                              →  vào được Dashboard
Bấm Logout                                              →  quay về Login
```

---

## 11. Thứ tự thực hiện tóm tắt

```text
1.  Website local hoạt động
2.  VPC + Public/Private Subnet + IGW
3.  Security Groups (ALB / Web / Bastion)
4.  EC2 Private (không Public IP)
5.  Cài Nginx + deploy website + security headers
6.  (Tùy chọn) Bastion Host
7.  Target Group + ALB (HTTP)
8.  Domain + ACM Certificate (Issued)
9.  HTTPS listener + redirect 301
10. Chạy các Demo
11. Theo dõi chi phí, dọn dẹp tài nguyên sau demo
```

---

## 12. Lưu ý chi phí & dọn dẹp

Tài nguyên có thể phát sinh chi phí:
- EC2 (2 máy nếu có Bastion)
- Application Load Balancer (~$16–20/tháng)
- NAT Gateway (~$32/tháng) — chỉ tạo khi thực sự cần
- Public IPv4, domain, CloudWatch logs

**Sau khi demo xong, xóa:** ALB → Target Group → EC2 → Bastion → NAT (nếu có)
→ Security Groups → VPC (tự xóa subnet/IGW/route table theo).

---

## 13. Checklist trước ngày demo

- [ ] `http://domain` tự chuyển sang `https://domain` (301)
- [ ] Trình duyệt hiện ổ khóa, certificate `Issued`
- [ ] Website hiện **🔒 Secure HTTPS Connection**
- [ ] EC2 Private: `Public IPv4 = None`
- [ ] Truy cập trực tiếp Private IP thất bại
- [ ] SSH trực tiếp bị chặn, SSH qua Bastion thành công
- [ ] `curl -I` thấy đủ 4 security headers
- [ ] Nginx access log ghi nhận request
- [ ] Dashboard chặn truy cập khi chưa đăng nhập
- [ ] Login → Dashboard → Logout hoạt động
