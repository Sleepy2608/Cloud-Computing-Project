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
│   └── DEMO.md                # Hướng dẫn triển khai AWS từng bước
│
├── .gitignore
├── .gitattributes
└── README.md
```

## Chạy local

```cmd
cd Code
python -m http.server 8000
```

Mở `http://localhost:8000/index.html`.

> Ở local website hiện **⚠️ HTTP Connection** (chưa có HTTPS). Khi triển khai lên
> AWS và truy cập qua HTTPS sẽ hiện **🔒 Secure HTTPS Connection**.

## Tài liệu

- 📄 Hướng dẫn triển khai AWS từng bước: [`docs/DEMO.md`](docs/DEMO.md)
- 🎬 Kịch bản thuyết trình (demo HTTP + lý thuyết HTTPS): [`docs/THUYET_TRINH.md`](docs/THUYET_TRINH.md)

