# BÁO CÁO MÔN ĐIỆN TOÁN ĐÁM MÂY

## ĐỀ TÀI: TRIỂN KHAI HTTPS VÀ BẢO MẬT TRUY CẬP CHO WEBSITE CLOUD
(Implementing HTTPS and Access Security for Cloud Websites)

**Giảng viên hướng dẫn:** TS Lê Quốc Tuấn
**Lớp:** 012012303904

**Sinh viên thực hiện:**
- Nguyễn Lê Huy Tâm
- Huỳnh Đình Chấn

**Ngày thực hiện:** 01/08/2026 – 26/08/2026

---

## PHÂN CÔNG NHÓM

| STT | Họ và Tên | Vai trò | Nhiệm vụ được giao | Mức độ đóng góp |
|-----|-----------|---------|---------------------|-----------------|
| 1 | Nguyễn Lê Huy Tâm | Nhóm trưởng | Soạn báo cáo; Xây dựng Website hệ thống; Chỉnh cấu hình server, bastion, host cho hệ thống, thiết lập server trên AWS và Demo | 100% |
| 2 | Huỳnh Đình Chấn | Thành viên | Soạn nội dung lý thuyết; Soạn nội dung thuyết trình và Xây dựng Website hệ thống | 100% |

---

## LỜI CẢM ƠN

Trong quá trình thực hiện bài tập lớn với đề tài "Triển khai HTTPS và bảo mật truy cập cho Website Cloud", chúng em đã nhận được sự hướng dẫn, hỗ trợ và giúp đỡ quý báu từ giảng viên.

Trước hết, chúng em xin chân thành cảm ơn TS. Lê Quốc Tuấn – giảng viên phụ trách môn học – đã tận tình giảng dạy, hướng dẫn và truyền đạt cho chúng em những kiến thức quý báu trong suốt quá trình học tập và thực hiện đề tài. Những kiến thức về điện toán đám mây, kiến trúc hệ thống và bảo mật đã giúp chúng em có nền tảng để nghiên cứu, thiết kế và triển khai hệ thống SecureCloud.

Trong quá trình thực hiện đề tài, mặc dù nhóm đã cố gắng hoàn thành báo cáo và hệ thống một cách tốt nhất, nhưng do kiến thức và kinh nghiệm thực tế còn hạn chế nên không thể tránh khỏi những thiếu sót. Chúng em rất mong nhận được những ý kiến đóng góp và nhận xét từ TS. Lê Quốc Tuấn để có thể tiếp tục hoàn thiện kiến thức và nâng cao kỹ năng trong tương lai.

Cuối cùng, chúng em xin chân thành cảm ơn TS. Lê Quốc Tuấn đã dành thời gian tận tình hướng dẫn và đánh giá bài tập lớn của nhóm. Chúng em xin chân thành cảm ơn!

<div align="right">
    <p align="right">
    <b>Sinh viên thực hiện</b><br>
    Nguyễn Lê Huy Tâm<br>
    Huỳnh Đình Chấn<br>
    </p>
</div>

<p align="center">
    TP. Hồ Chí Minh, tháng 09 năm 2026
</p>

---

## DANH MỤC BẢNG BIỂU

| Bảng | Tiêu đề | Trang |
|------|---------|-------|
| Bảng 1 | So sánh các mô hình dịch vụ | 5 |
| Bảng 2 | Tổng hợp nguy cơ, rủi ro và biện pháp xử lý | 7 |
| Bảng 3 | So sánh mã hóa đối xứng và bất đối xứng | 8 |
| Bảng 4 | Các loại chứng chỉ số thường gặp | 8 |
| Bảng 5 | Các thành phần mạng trong hệ thống | 10 |
| Bảng 6 | Thiết kế Security Group của hệ thống | 11 |
| Bảng 7 | Các bước triển khai hệ thống | 13 |
| Bảng 8 | Các security header được cấu hình trên Nginx | 14 |
| Bảng 9 | Kết quả kiểm thử | 19 |
| Bảng 10 | Đánh giá theo mục tiêu | 20 |

---

## MỤC LỤC

1. MỞ ĐẦU
2. CHƯƠNG 1. TỔNG QUAN VỀ CLOUD VÀ BẢO MẬT WEBSITE
3. CHƯƠNG 2. NGUY CƠ VÀ GIẢI PHÁP HTTPS
4. CHƯƠNG 3. KIẾN TRÚC VÀ BẢO MẬT HỆ THỐNG SECURECLOUD
5. CHƯƠNG 4. TRIỂN KHAI HỆ THỐNG
6. CHƯƠNG 5. KẾT QUẢ DEMO VÀ ĐÁNH GIÁ
7. KẾT LUẬN
8. TÀI LIỆU THAM KHẢO
9. PHỤ LỤC

---

## MỞ ĐẦU

Trong thời đại chuyển đổi số, website là phương tiện quan trọng để cung cấp thông tin và dịch vụ trực tuyến. Điện toán đám mây giúp triển khai website linh hoạt, dễ mở rộng và giảm chi phí đầu tư hạ tầng ban đầu. Tuy nhiên, việc đưa hệ thống lên Internet cũng làm phát sinh các nguy cơ như nghe lén, giả mạo, sửa đổi dữ liệu và truy cập trái phép.

Đề tài "Triển khai HTTPS và bảo mật truy cập cho Website Cloud" được thực hiện nhằm nghiên cứu các nguy cơ của website không mã hóa và áp dụng các biện pháp bảo mật trên môi trường AWS. Kết quả thực hành là hệ thống demo SecureCloud theo kiến trúc Internet – Application Load Balancer – Web Server, trong đó web server được đặt trong Private Subnet và không có địa chỉ IP công khai.

### 1. Mục tiêu của đề tài

- Tìm hiểu các nguy cơ đối với website sử dụng HTTP không mã hóa.
- Nghiên cứu HTTPS, SSL/TLS và chứng chỉ số trong việc bảo vệ dữ liệu truyền tải.
- Triển khai SecureCloud theo kiến trúc nhiều lớp trên AWS.
- Áp dụng VPC/Subnet, Security Group theo nguyên tắc quyền tối thiểu, security headers và logging.
- Kiểm thử và đánh giá mức độ đáp ứng của hệ thống.

### 2. Phạm vi và phương pháp

Đề tài tập trung vào AWS VPC, EC2, Application Load Balancer, AWS Certificate Manager, Security Group, NAT Gateway và Nginx tại region ap-southeast-2 (Sydney). Phương pháp thực hiện gồm nghiên cứu tài liệu, triển khai thực nghiệm bằng AWS Management Console và AWS CLI, sau đó kiểm thử bằng trình duyệt và các công cụ dòng lệnh.

### 3. Phạm vi và đối tượng nghiên cứu

Đề tài tập trung nghiên cứu và thực hành các vấn đề liên quan đến bảo mật website được triển khai trên môi trường điện toán đám mây. Nội dung chính bao gồm: tìm hiểu HTTP, HTTPS, SSL/TLS và chứng chỉ số; nghiên cứu các mô hình dịch vụ cloud như IaaS và PaaS; xây dựng kiến trúc mạng với VPC, Public Subnet và Private Subnet; đồng thời tìm hiểu các cơ chế kiểm soát truy cập như firewall, VPN và IAM.

Trong phạm vi thực hành, nhóm tiến hành triển khai website, cấu hình domain và HTTPS, kiểm tra khả năng truy cập qua HTTP và HTTPS, phân tích chứng chỉ và thực hiện một số cấu hình bảo mật cơ bản. Đối tượng nghiên cứu là các dịch vụ hạ tầng của AWS, cụ thể gồm VPC, EC2, Application Load Balancer, AWS Certificate Manager, Security Group và NAT Gateway, trong region ap-southeast-2 (Sydney). Phần demo trực tiếp hiện đang chạy trên giao thức HTTP do nhóm chưa sở hữu domain riêng; phần HTTPS được trình bày theo quy trình thiết kế và giải thích lý thuyết.

---

## CHƯƠNG 1. TỔNG QUAN VỀ CLOUD VÀ BẢO MẬT WEBSITE

### 1.1. Điện toán đám mây và mô hình dịch vụ

Điện toán đám mây là mô hình cung cấp tài nguyên máy chủ, lưu trữ, mạng và phần mềm qua Internet theo nhu cầu. Các đặc trưng cơ bản gồm tự phục vụ theo nhu cầu, truy cập qua mạng rộng, chia sẻ tài nguyên, co giãn nhanh và dịch vụ được đo lường.

**Bảng 1 - So sánh các mô hình dịch vụ**

| Mô hình | Nội dung cung cấp | Người dùng quản lý | Ví dụ |
|---------|-------------------|---------------------|-------|
| IaaS | Máy chủ ảo, mạng, lưu trữ | Hệ điều hành, ứng dụng, cấu hình bảo mật | AWS EC2, VPC, ELB |
| PaaS | Nền tảng chạy ứng dụng, runtime | Chỉ ứng dụng và dữ liệu | AWS Elastic Beanstalk, Heroku |
| SaaS | Ứng dụng hoàn chỉnh | Chỉ dữ liệu người dùng | Google Workspace, Office 365 |

SecureCloud lựa chọn IaaS vì cho phép trực tiếp cấu hình mạng, máy chủ và các lớp bảo mật.

### 1.2. Kiến trúc website trên cloud

Website là tập hợp các trang web được lưu trữ trên máy chủ và truy cập qua giao thức HTTP/HTTPS. Một website cơ bản gồm ba thành phần: máy khách (trình duyệt), máy chủ web (web server) và tên miền (domain). Khi người dùng nhập địa chỉ, trình duyệt gửi yêu cầu HTTP tới máy chủ, máy chủ xử lý và trả về nội dung (HTML, CSS, JavaScript, hình ảnh).

Khi triển khai trên cloud, kiến trúc website thường được tách thành nhiều lớp để tăng tính sẵn sàng và bảo mật: lớp biên (load balancer / CDN), lớp ứng dụng (web server / application server) và lớp dữ liệu (database). Việc phân tách này cho phép áp dụng các biện pháp bảo mật phù hợp cho từng lớp.

### 1.3. Bảo mật thông tin và mô hình CIA

Mô hình CIA gồm Confidentiality (bảo mật), Integrity (toàn vẹn) và Availability (sẵn sàng). HTTPS bảo vệ dữ liệu truyền tải; kiểm soát truy cập hạn chế người dùng trái phép; kiến trúc nhiều lớp góp phần tăng tính sẵn sàng và giảm bề mặt tấn công.

### 1.4. Năm lớp bảo mật SecureCloud

- VPC và Subnet cô lập, tách vùng Public và Private.
- Security Group theo nguyên tắc quyền tối thiểu.
- HTTPS/SSL-TLS bảo vệ kênh truyền và xác thực website.
- Security headers của Nginx chống một số nguy cơ ở tầng trình duyệt.
- Logging hỗ trợ giám sát và truy vết.

---

## CHƯƠNG 2. NGUY CƠ VÀ GIẢI PHÁP HTTPS

### 2.1. Nguy cơ của HTTP

HTTP hoạt động theo mô hình request–response và mặc định sử dụng cổng 80. HTTP không mã hóa nội dung trao đổi, vì vậy thông tin như tên đăng nhập, mật khẩu, cookie và nội dung trang có thể bị đọc nếu bị chặn bắt trên đường truyền.

### 2.2. Các rủi ro chính

**Bảng 2 - Tổng hợp nguy cơ, rủi ro và biện pháp xử lý**

| Nguy cơ | Mô tả ngắn | Mục tiêu CIA bị ảnh hưởng | Biện pháp trong đề tài |
|---------|------------|---------------------------|------------------------|
| Nghe lén / MITM | Đọc trộm dữ liệu trên đường truyền | Bảo mật | HTTPS/SSL-TLS, HSTS |
| Giả mạo website | Trang giả mạo đánh cắp thông tin | Bảo mật, Toàn vẹn | Chứng chỉ số do CA cấp |
| Sửa đổi dữ liệu | Thay đổi nội dung phản hồi | Toàn vẹn | Mã hóa + kiểm tra toàn vẹn của TLS |
| XSS / Clickjacking | Chèn mã độc, lừa bấm nút ẩn | Toàn vẹn | Security headers, CSP |
| Truy cập trái phép | Vào trang nội bộ không xác thực | Bảo mật | Kiểm soát truy cập, session |
| Đánh cắp phiên | Dùng cookie để mạo danh | Bảo mật | HTTPS + cookie bảo mật |
| Cấu hình sai | Mở cổng / quyền quá rộng | Cả ba | Security Group tối thiểu, IAM |
| Không có log | Không phát hiện bất thường | Cả ba | Nginx access log, CloudWatch |

### 2.3. HTTPS và TLS

HTTPS là HTTP hoạt động bên trong kênh TLS, mặc định ở cổng 443. HTTPS cung cấp ba thuộc tính chính: bảo mật dữ liệu thông qua mã hóa, xác thực danh tính máy chủ bằng chứng chỉ và bảo đảm toàn vẹn dữ liệu trên đường truyền.

Quá trình TLS Handshake có thể tóm tắt thành bốn bước: client và server thông nhất phiên bản/thuật toán; server gửi chứng chỉ; client xác thực chứng chỉ và hai bên thiết lập khóa phiên; sau đó dữ liệu được truyền dưới dạng mã hóa.

### 2.4. Mã hóa đối xứng và bất đối xứng

HTTPS kết hợp cả hai loại mã hóa để tận dụng ưu điểm của từng loại. Mã hóa bất đối xứng (public/private key) an toàn cho việc trao đổi khóa nhưng chậm, nên chỉ dùng ở giai đoạn bắt tay. Mã hóa đối xứng dùng một khóa chung, tốc độ nhanh hơn nhiều, nên được dùng cho toàn bộ dữ liệu sau khi đã trao đổi khóa thành công.

**Bảng 3 - So sánh mã hóa đối xứng và bất đối xứng**

| Tiêu chí | Mã hóa đối xứng | Mã hóa bất đối xứng |
|----------|-----------------|---------------------|
| Số khóa | 1 khóa dùng chung | 1 cặp khóa công khai / riêng tư |
| Tốc độ | Nhanh | Chậm hơn |
| Mục đích trong TLS | Mã hóa dữ liệu phiên | Trao đổi khóa, xác thực chứng chỉ |
| Ví dụ thuật toán | AES | RSA, ECDSA |

### 2.5. Chứng chỉ số và AWS Certificate Manager

Chứng chỉ X.509 chứa khóa công khai, tên miền, thời hạn và thông tin CA. Trình duyệt chỉ tin cậy khi chuỗi chứng chỉ dẫn tới CA đáng tin cậy. AWS Certificate Manager hỗ trợ yêu cầu và quản lý chứng chỉ, xác thực DNS và gắn chứng chỉ với Application Load Balancer.

**Bảng 4 - Các loại chứng chỉ số thường gặp**

| Loại chứng chỉ | Mức xác minh | Thời gian cấp | Ứng dụng điển hình |
|----------------|--------------|---------------|-------------------|
| DV (Domain Validation) | Chỉ xác minh quyền sở hữu tên miền | Nhanh (vài phút) | Website cá nhân, demo |
| OV (Organization Validation) | Xác minh tổ chức | Vài ngày | Website doanh nghiệp |
| EV (Extended Validation) | Xác minh mở rộng | Vài ngày - vài tuần | Ngân hàng, thương mại điện tử |

### 2.6. SSL termination, redirect và HSTS

Thiết kế của SecureCloud đặt SSL/TLS termination tại ALB. Đề tài lựa chọn phương án termination tại ALB. Sơ đồ nguyên lý như sau:

```
Trình duyệt --HTTPS:443--> ALB --(giải mã SSL)--HTTP nội bộ--> Nginx (Private Subnet)
```

Nhờ đó, web server chỉ cần lắng nghe cổng 80 với HTTP nội bộ, không cần xử lý chứng chỉ và không bao giờ nhận kết nối trực tiếp từ Internet.

Để tránh việc người dùng vô tình truy cập bằng HTTP, hệ thống cấu hình listener HTTP cổng 80 trên ALB thực hiện chuyển hướng vĩnh viễn (HTTP 301) sang HTTPS cổng 443. Bên cạnh đó, header Strict-Transport-Security (HSTS) được thêm vào phản hồi để yêu cầu trình duyệt luôn dùng HTTPS cho tên miền này trong khoảng thời gian khai báo, kể cả khi người dùng gõ http://.

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

Sự kết hợp giữa redirect 301 và HSTS tạo thành hai lớp bảo vệ: lớp thứ nhất chuyển hướng ở lần truy cập đầu tiên, lớp thứ hai ngăn trình duyệt gửi yêu cầu HTTP ở các lần sau.

---

## CHƯƠNG 3. KIẾN TRÚC VÀ BẢO MẬT HỆ THỐNG SECURECLOUD

### 3.1. Mô hình trách nhiệm chia sẻ

Trong cloud, nhà cung cấp chịu trách nhiệm bảo mật hạ tầng vật lý và nền tảng cốt lõi; khách hàng chịu trách nhiệm về cấu hình mạng, hệ điều hành, ứng dụng, dữ liệu và quyền truy cập. Với IaaS, trách nhiệm của khách hàng lớn hơn nhưng khả năng kiểm soát cũng cao hơn.

### 3.2. Kiến trúc tổng thể

SecureCloud sử dụng kiến trúc ba lớp: Internet → Application Load Balancer → EC2 Web Server. ALB nằm trong Public Subnet và là điểm truy cập từ Internet. Web server chạy Nginx nằm trong Private Subnet, không có Public IP. Quản trị viên SSH qua Bastion Host rồi mới truy cập web server.

Sơ đồ logic: Internet → HTTP/HTTPS → ALB (Public Subnet) → HTTP nội bộ → Nginx/EC2 (Private Subnet). Kênh quản trị: Admin → SSH → Bastion → SSH → Web Server.

### 3.3. Thiết kế mạng

**Bảng 5 - Các thành phần mạng trong hệ thống**

| Thành phần | Giá trị/Vai trò |
|------------|-----------------|
| VPC | 10.0.0.0/16 |
| Public Subnet | 10.0.1.0/24 – ALB và Bastion |
| Private Subnet | 10.0.2.0/24 – Web Server |
| Public Subnet 2 | 10.0.3.0/24 – Availability Zone thứ hai cho ALB |
| Internet Gateway | Kết nối Public Subnet với Internet |
| NAT Gateway | Cho Private Subnet chủ động đi Internet khi cần |

Việc tách Public và Private Subnet giúp thành phần không cần tiếp xúc Internet không bị phơi trực tiếp. NAT Gateway cho phép web server chủ động tải gói phần mềm nhưng Internet không thể chủ động tạo kết nối vào máy chủ.

### 3.4. Security Group và nguyên tắc quyền tối thiểu

**Bảng 6 - Thiết kế Security Group của hệ thống**

| Security Group | Port | Nguồn |
|----------------|------|-------|
| ALB SG | 80, 443 | Internet |
| Web SG | 80 | ALB SG |
| Web SG | 22 | Bastion SG |
| Bastion SG | 22 | IP quản trị viên |

Web server không mở cổng trực tiếp cho 0.0.0.0/0. SSH chỉ được phép qua Bastion, thể hiện nguyên tắc Least Privilege.

### 3.5. Bastion Host và Application Load Balancer

#### 3.5.1. Bastion Host

Bastion Host (còn gọi là jump host) là máy chủ đặt trong Public Subnet, đóng vai trò trạm trung chuyển cho các kết nối quản trị. Quản trị viên SSH vào Bastion, sau đó từ Bastion SSH tiếp vào web server trong Private Subnet. Kỹ thuật ProxyJump của SSH cho phép thực hiện chuỗi kết nối này trong một lệnh duy nhất.

```bash
# ~/.ssh/config tren may ca nhan
Host bastion
    HostName <bastion-public-ip>
    User ec2-user
    IdentityFile ~/keypair.pem

Host webserver
    HostName 10.0.2.202
    User ec2-user
    ProxyJump bastion
    IdentityFile ~/keypair.pem

# Sau do chi can go: ssh webserver
```

#### 3.5.2. Application Load Balancer (ALB)

ALB hoạt động ở tầng 7 (tầng ứng dụng) của mô hình OSI, có khả năng định tuyến dựa trên nội dung như đường dẫn, host header. Trong hệ thống, ALB đảm nhận vai trò điểm truy cập công khai duy nhất, thực hiện SSL termination, chuyển tiếp HTTP nội bộ tới web server và thực hiện redirect 301 từ HTTP sang HTTPS.

### 3.6. Kiểm soát truy cập ở tầng ứng dụng

Ở tầng ứng dụng, SecureCloud sử dụng cơ chế kiểm tra trạng thái đăng nhập phía client để bảo vệ trang dashboard. Khi người dùng chưa đăng nhập mà cố truy cập dashboard.html, hệ thống sẽ tự động chuyển hướng về trang đăng nhập. Đây là minh họa cho kiểm soát truy cập ở tầng ứng dụng, tuy chưa phải là xác thực phía server thực sự.

---

## CHƯƠNG 4. TRIỂN KHAI HỆ THỐNG

### 4.1. Quy trình triển khai

**Bảng 7 - Các bước triển khai hệ thống**

| Bước | Nội dung |
|------|----------|
| 1 | Chuẩn bị và kiểm tra website tại môi trường local |
| 2 | Tạo VPC, Public/Private Subnet, IGW và NAT Gateway |
| 3 | Tạo Security Group cho ALB, Web Server và Bastion |
| 4 | Tạo EC2 Web Server trong Private Subnet, không có Public IP |
| 5 | Cài Nginx và triển khai SecureCloud |
| 6 | Tạo Bastion Host để quản trị |
| 7 | Tạo Target Group và Application Load Balancer |
| 8 | Thiết kế tên miền và yêu cầu chứng chỉ ACM |
| 9 | Thiết kế HTTPS listener và redirect 301 |
| 10 | Kiểm thử, giám sát và dọn dẹp tài nguyên |

### 4.2. Kiến trúc hệ thống và website

#### 4.2.1. Kiến trúc hệ thống

```
Cloud-Computing-Project/
│
├── Code/                              # Website SecureCloud
│   ├── index.html                     # Trang chủ (hiện trạng thái HTTPS)
│   ├── login.html                     # Trang đăng nhập demo (admin / admin123)
│   ├── dashboard.html                 # Trang được bảo vệ (cần đăng nhập)
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── security.js                # Kiểm tra HTTP/HTTPS, login, logout, checkAuth
│
├── nginx/
│   └── securecloud.conf               # Cấu hình Nginx + Security Headers
│
├── docs/
│   ├── DEMO.md                        # Hướng dẫn triển khai AWS từng bước
│   └── huong-dan-chay-tung-buoc.md    # Runbook CLI gõ lệnh từng bước
│
├── .gitignore
├── .gitattributes
└── README.md
```

#### 4.2.2. Website SecureCloud

Website gồm index.html hiển thị trạng thái kết nối, login.html cho đăng nhập demo, dashboard.html là trang được bảo vệ, css/style.css định dạng giao diện và js/security.js xử lý kiểm tra trạng thái, đăng nhập, đăng xuất và phiên làm việc.

### 4.3. Triển khai hạ tầng và web server

VPC sử dụng dải 10.0.0.0/16. EC2 Amazon Linux 2023 được đặt trong Private Subnet. Quy trình quản trị sử dụng Bastion Host. Việc không thể SSH trực tiếp vào web server từ Internet là kết quả mong muốn của thiết kế, không phải lỗi cấu hình.

### 4.4. Security headers

**Bảng 8 - Các security header được cấu hình trên Nginx**

| Header | Tác dụng |
|--------|----------|
| X-Content-Type-Options: nosniff | Hạn chế MIME sniffing |
| X-Frame-Options: DENY | Chống clickjacking |
| Referrer-Policy | Giới hạn thông tin referrer |
| Strict-Transport-Security | Buộc trình duyệt ưu tiên HTTPS khi triển khai |

Nginx được kiểm tra cú pháp trước khi áp dụng cấu hình và access log được sử dụng để theo dõi truy cập.

### 4.5. ALB và thiết kế HTTPS

Target Group sử dụng HTTP cổng 80 và health check đường dẫn "/". ALB internet-facing được đặt tại hai Public Subnet thuộc hai Availability Zone. Khi có domain riêng, quy trình tiếp theo là xác thực DNS với ACM, chờ chứng chỉ Issued, tạo listener HTTPS 443 và cấu hình listener HTTP 80 redirect 301 sang HTTPS.

---

## CHƯƠNG 5. KẾT QUẢ DEMO VÀ ĐÁNH GIÁ

### 5.1. Ảnh demo hệ thống

#### 5.1.1. UI/UX của hệ thống

**Hình 1 - Trang index**

Website được phục vụ bởi Nginx trên EC2 nằm trong Private Subnet, người dùng truy cập qua Load Balancer.

**Hình 2 - Trang login**

**Hình 3 - Trang dashboard**

#### 5.1.2. Bảo mật trang đăng nhập

```
Not secure demo-alb-1747899251.ap-southeast-2.elb.amazonaws.com/login.html
```

**Hình 4 - Not secure URL**

"Not secure" trên thanh địa chỉ là vì chúng ta đang truy cập bằng HTTP — dữ liệu chưa được mã hóa. Đây chính là lý do ta cần HTTPS.

Để đảm bảo tính bảo mật (Security) thì ta thử đổi chữ login thành dashboard để đăng nhập vào thì sẽ bị đá ra lại.

```
demo-alb-1747899251.ap-southeast-2.elb.amazonaws.com/dashboard.html
```

**Hình 5 - Đổi URL từ login thành dashboard**

```
demo-alb-1747899251.ap-southeast-2.elb.amazonaws.com/login.html
```

**Hình 6 - Đổi URL từ login thành dashboard không thành công**

#### 5.1.3. AWS Console

**Hình 7 - Web server đang hoạt động trên AWS Console**

**Hình 8 – Kết quả Demo 3**

Dù không có IP công khai, website vẫn hoạt động vì mọi request đi qua ALB. Truy cập trực tiếp từ Internet sẽ thất bại.

**Hình 9 - Kết quả Demo 4 (Security Group)**

Web Server không mở bất kỳ cổng nào cho Internet. SSH trực tiếp bị chặn; chỉ SSH qua Bastion vào được.

#### 5.1.4. Kiểm tra Security Headers và Log

Chạy trên máy bằng Command Prompt

```
C:\Users\VIVOBOOK>curl -I http://demo-alb-1747899251.ap-southeast-2.elb.amazonaws.com/
HTTP/1.1 200 OK
Date: Thu, 10 Sep 2026 20:11:54 GMT
Content-Type: text/html
Content-Length: 1855
Connection: keep-alive
Server: nginx/1.30.4
Last-Modified: Tue, 25 Aug 2026 05:22:46 GMT
ETag: "6a8d26a6-73f"
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=31536000; includeSubDomains
Accept-Ranges: bytes
```

**Hình 10 – Kết quả Demo 5 (Security Headers)**

Nhìn vào 4 header:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Referrer-Policy: strict-origin-when-cross-origin
- Strict-Transport-Security: max-age=31536000; includeSubDomains

Như vậy Nginx thêm các header này để chống clickjacking, MIME sniffing và ép trình duyệt dùng HTTPS.

**Hình 11 - Kết quả Demo 6 (Log)**

Sau khi chạy được lệnh `sudo tail -f /var/log/nginx/access.log` và truy cập website thì sẽ thấy request mới hiện ra. Ở đây mọi truy cập đều được ghi log để giám sát và phát hiện bất thường.

### 5.2. Kết quả kiểm thử

**Bảng 9 - Kết quả kiểm thử**

| Nội dung kiểm thử | Kết quả |
|-------------------|---------|
| Website truy cập qua ALB | Đạt |
| Dashboard chặn truy cập khi chưa đăng nhập | Đạt |
| Đăng nhập/đăng xuất demo | Đạt |
| Web server không có Public IP | Đạt |

### 5.3. Đánh giá theo mục tiêu

**Bảng 10 - Đánh giá theo mục tiêu**

| Mục tiêu | Kết quả |
|----------|---------|
| Tìm hiểu nguy cơ HTTP | Đạt |
| Nghiên cứu HTTPS/SSL/TLS | Đạt |
| Triển khai kiến trúc nhiều lớp | Đạt |
| Áp dụng Security Group tối thiểu | Đạt |
| Security headers và logging | Đạt |
| Kiểm thử HTTPS end-to-end | Chưa đạt (thiếu domain) |

### 5.4. Ưu điểm

- Kiến trúc nhiều lớp tách biệt vùng Public và Private.
- Web server không có Public IP và không mở cổng trực tiếp ra Internet.
- SSH