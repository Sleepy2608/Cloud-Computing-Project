# Cloud-Computing-Project

**Đề tài:** Triển khai HTTPS và bảo mật truy cập cho website cloud
(Implementing HTTPS and access security for cloud websites).

Website demo **SecureCloud** minh họa: HTTPS/SSL-TLS, kiến trúc Public/Private
Subnet, Load Balancer, Security Group, Security Headers và kiểm soát truy cập.

## Cấu trúc project

```text
Cloud-Computing-Project/
│
├── Code/                      # Website SecureCloud
│   ├── index.html             # Trang chủ (hiện trạng thái HTTPS)
│   ├── login.html             # Trang đăng nhập demo (admin / admin123)
│   ├── dashboard.html         # Trang được bảo vệ (cần đăng nhập)
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── security.js        # Kiểm tra HTTP/HTTPS, login, logout, checkAuth
│
├── nginx/
│   └── securecloud.conf       # Cấu hình Nginx + Security Headers
│
├── docs/
│   ├── DEMO.md                # Hướng dẫn triển khai AWS từng bước
│   ├── THUYET_TRINH.md        # Kịch bản thuyết trình + lý thuyết HTTPS
│   └── huong-dan-chay-tung-buoc.md   # Runbook CLI gõ lệnh từng bước
│
├── .gitignore
├── .gitattributes
└── README.md
```

## Chạy local

```
cd \Code"
python -m http.server 8000
```

Mở `http://demo-alb-1747899251.ap-southeast-2.elb.amazonaws.com/index.html`

> Ở local website hiện **⚠️ HTTP Connection** (chưa có HTTPS). Khi triển khai lên
> AWS và truy cập qua HTTPS sẽ hiện **🔒 Secure HTTPS Connection**.

## Tài liệu

| File | Nội dung |
|---|---|
| 🎬 [`docs/THUYET_TRINH.md`](docs/THUYET_TRINH.md) | **Kịch bản thuyết trình** — các bước demo trực tiếp, lý thuyết HTTPS, câu hỏi hội đồng thường gặp và checklist trước khi bảo vệ |
| 📄 [`docs/DEMO.md`](docs/DEMO.md) | Hướng dẫn triển khai AWS từng bước (theo Console) — kiến trúc, VPC, EC2, ALB, HTTPS |
| ⌨️ [`docs/huong-dan-chay-tung-buoc.md`](docs/huong-dan-chay-tung-buoc.md) | Runbook CLI — gõ từng lệnh trong PowerShell, ghi rõ thao tác và kết quả mong đợi |

> 💡 Nếu bạn đang chuẩn bị bảo vệ, hãy bắt đầu từ **`THUYET_TRINH.md`** —
> nó tổng hợp mọi thứ cần trình bày: demo từng bước + phần lý thuyết HTTPS.

