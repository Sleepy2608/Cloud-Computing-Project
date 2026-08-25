# Hướng dẫn CHẠY TỪNG BƯỚC — Demo mạng đám mây AWS

Hướng dẫn này giải thích **chính xác gõ lệnh ở đâu, khi nào, và bạn sẽ thấy gì** — dành cho người chưa quen dùng dòng lệnh AWS.

> 🌏 **REGION sử dụng trong hướng dẫn này: `ap-southeast-2` (Asia Pacific — Sydney).**
> Nếu AWS Console của bạn đang hiển thị region khác (VD Singapore `ap-southeast-1`),
> hãy bấm vào tên region ở góc trên phải → chọn **Sydney**.

## Bạn cần dùng công cụ gì?

| Hệ điều hành | Công cụ gõ lệnh |
|---|---|
| Windows | **PowerShell** (gõ "PowerShell" vào Start Menu → mở) |
| macOS | **Terminal** (Applications → Utilities → Terminal) |
| Linux | Terminal có sẵn |

Tất cả các dòng bắt đầu bằng `aws ...` trong hướng dẫn trước đều gõ vào cửa sổ này — **không** gõ vào AWS Console (trang web).

> Lưu ý cho Windows: một vài ký tự `\` để xuống dòng trong lệnh Linux/Mac **không hoạt động** trong PowerShell. Cách an toàn nhất: gõ mỗi lệnh **trên một dòng duy nhất** (bỏ dấu `\` và nối các dòng lại), hoặc dùng dấu `` ` `` (backtick) thay cho `\` nếu muốn xuống dòng trong PowerShell.

---

## PHẦN 0 — CHUẨN BỊ (làm 1 lần)

### 0.1. Tạo tài khoản AWS (nếu chưa có)
Vào https://aws.amazon.com → Create an AWS Account → làm theo hướng dẫn (cần thẻ visa/mastercard để xác minh, AWS sẽ không tính phí nếu bạn ở trong Free Tier).

### 0.2. Tạo IAM User (không dùng tài khoản root để làm việc hàng ngày)
Đây là thao tác trên **web**, không phải dòng lệnh:
1. Đăng nhập AWS Console → gõ "IAM" vào ô tìm kiếm trên cùng → vào **IAM**.
2. Bên trái chọn **Users** → **Create user**.
3. Đặt tên (vd: `demo-admin`) → Next.
4. Chọn **Attach policies directly** → tìm và tick **AdministratorAccess** → Next → Create user.
5. Bấm vào user vừa tạo → tab **Security credentials** → mục **Access keys** → **Create access key**.
6. Chọn use case: **Command Line Interface (CLI)** → tick xác nhận → Next → Create access key.
7. **QUAN TRỌNG**: màn hình sẽ hiện `Access Key ID` và `Secret Access Key` — đây là **lần duy nhất** bạn thấy Secret Key. Copy cả 2 giá trị này vào một chỗ an toàn (Notepad tạm thời).

### 0.3. Cài AWS CLI

**Windows (PowerShell):**
1. Tải bộ cài tại: https://awscli.amazonaws.com/AWSCLIV2.msi
2. Chạy file `.msi` vừa tải, bấm Next liên tục để cài.
3. Mở lại PowerShell (đóng và mở lại để nhận lệnh mới), gõ:
   ```powershell
   aws --version
   ```
   Nếu thấy dòng như `aws-cli/2.x.x Python/3.x...` → cài thành công.

**macOS (Terminal):**
```bash
brew install awscli
aws --version
```
Nếu chưa có `brew`, cài trước bằng lệnh tại https://brew.sh, hoặc tải bộ cài `.pkg` tại https://awscli.amazonaws.com/AWSCLIV2.pkg

### 0.4. Cấu hình AWS CLI với Access Key vừa tạo
Gõ (cả Windows lẫn Mac đều dùng lệnh này):
```
aws configure
```
Nó sẽ hỏi lần lượt, bạn gõ rồi Enter:
```
AWS Access Key ID [None]: <dán Access Key ID vừa copy>
AWS Secret Access Key [None]: <dán Secret Access Key vừa copy>
Default region name [None]: ap-southeast-2
Default output format [None]: json
```
Kiểm tra đã kết nối đúng chưa:
```
aws sts get-caller-identity
```
Nếu ra một đoạn JSON có `"Account"` và `"Arn"` → bạn đã sẵn sàng.

### 0.5. Tạo Key Pair để SSH sau này
Vẫn trong PowerShell/Terminal:
```
aws ec2 create-key-pair --key-name keypair --query "KeyMaterial" --output text > keypair.pem
```
Lệnh này tạo ra file `keypair.pem` ngay trong thư mục hiện tại (gõ `pwd` để xem đường dẫn thư mục đó).

**Mac/Linux** — giới hạn quyền file (bắt buộc, nếu không SSH sẽ báo lỗi):
```bash
chmod 400 keypair.pem
```
**Windows** — không cần chmod, nhưng nên click phải file → Properties → Security → giới hạn chỉ tài khoản bạn có quyền đọc, hoặc dùng SSH qua WSL để tránh lỗi permission.

---

## PHẦN 1 — TẠO VPC VÀ SUBNET

Từ đây, mỗi lệnh bạn gõ vào PowerShell/Terminal sẽ trả về một ID (chuỗi bắt đầu bằng `vpc-`, `subnet-`...). Bạn **cần lưu lại các ID này** vì các bước sau sẽ dùng đến.

Cách dễ nhất: dùng biến, để CLI tự lưu giúp bạn (cách này hoạt động trên cả PowerShell lẫn Mac Terminal, chỉ khác cú pháp gán biến).

### Trên macOS/Linux (Terminal):
```bash
VPC_ID=$(aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query 'Vpc.VpcId' --output text)
echo $VPC_ID
```
Dòng `echo $VPC_ID` để bạn nhìn thấy giá trị vừa lưu, ví dụ `vpc-0a1b2c3d4e5f`.

### Trên Windows (PowerShell) — cú pháp biến khác:
```powershell
$VPC_ID = aws ec2 create-vpc --cidr-block 10.0.0.0/16 --query "Vpc.VpcId" --output text
echo $VPC_ID
```

Từ giờ, mỗi khi hướng dẫn gốc ghi `$VPC_ID`, nếu bạn dùng PowerShell thì **giữ nguyên cú pháp `$VPC_ID`** khi *dùng* biến (chỉ cách *gán* biến khác — dùng `$VAR = ...` thay vì `VAR=$(...)`).

Tiếp tục gán tên và tạo 2 subnet (Sydney có các AZ `ap-southeast-2a`, `2b`, `2c` — kiểm tra bằng `aws ec2 describe-availability-zones --region ap-southeast-2`):

**Mac/Linux:**
```bash
aws ec2 create-tags --resources $VPC_ID --tags Key=Name,Value=demo-vpc

PUB_SUBNET=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone ap-southeast-2a --query 'Subnet.SubnetId' --output text)

PRIV_SUBNET=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone ap-southeast-2b --query 'Subnet.SubnetId' --output text)

echo $PUB_SUBNET
echo $PRIV_SUBNET
```

**Windows PowerShell:**
```powershell
aws ec2 create-tags --resources $VPC_ID --tags "Key=Name,Value=demo-vpc"

$PUB_SUBNET = aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.1.0/24 --availability-zone ap-southeast-2a --query "Subnet.SubnetId" --output text

$PRIV_SUBNET = aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.2.0/24 --availability-zone ap-southeast-2b --query "Subnet.SubnetId" --output text

echo $PUB_SUBNET
echo $PRIV_SUBNET
```

**Kiểm chứng bằng mắt**: mở AWS Console → VPC → Your VPCs / Subnets → bạn sẽ thấy `demo-vpc` và 2 subnet vừa tạo xuất hiện ở đó. Đây là cách nhanh nhất để biết lệnh có chạy đúng không.

### Internet Gateway + Route Table (Public)
**Mac/Linux:**
```bash
IGW_ID=$(aws ec2 create-internet-gateway --query 'InternetGateway.InternetGatewayId' --output text)
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID

RTB_PUB=$(aws ec2 create-route-table --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id $RTB_PUB --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
aws ec2 associate-route-table --route-table-id $RTB_PUB --subnet-id $PUB_SUBNET
aws ec2 modify-subnet-attribute --subnet-id $PUB_SUBNET --map-public-ip-on-launch
```
**Windows PowerShell:** (giữ nguyên logic, chỉ đổi cách gán biến như trên)
```powershell
$IGW_ID = aws ec2 create-internet-gateway --query "InternetGateway.InternetGatewayId" --output text
aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID

$RTB_PUB = aws ec2 create-route-table --vpc-id $VPC_ID --query "RouteTable.RouteTableId" --output text
aws ec2 create-route --route-table-id $RTB_PUB --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID
aws ec2 associate-route-table --route-table-id $RTB_PUB --subnet-id $PUB_SUBNET
aws ec2 modify-subnet-attribute --subnet-id $PUB_SUBNET --map-public-ip-on-launch
```

### NAT Gateway (Private) — **lưu ý: tốn phí theo giờ + mất vài phút để "available"**
```bash
EIP_ALLOC=$(aws ec2 allocate-address --domain vpc --query 'AllocationId' --output text)
NAT_ID=$(aws ec2 create-nat-gateway --subnet-id $PUB_SUBNET --allocation-id $EIP_ALLOC --query 'NatGateway.NatGatewayId' --output text)
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_ID
```
Lệnh `wait` sẽ khiến terminal "đứng im" (không có gì hiện ra) trong 2-4 phút — đây là bình thường, nó đang đợi NAT sẵn sàng. Khi con trỏ nhập lệnh quay lại được, nghĩa là xong.
```bash
RTB_PRIV=$(aws ec2 create-route-table --vpc-id $VPC_ID --query 'RouteTable.RouteTableId' --output text)
aws ec2 create-route --route-table-id $RTB_PRIV --destination-cidr-block 0.0.0.0/0 --nat-gateway-id $NAT_ID
aws ec2 associate-route-table --route-table-id $RTB_PRIV --subnet-id $PRIV_SUBNET
```
(PowerShell: đổi `VAR=$(...)` thành `$VAR = ...` như các bước trên, phần còn lại giống hệt.)

---

## PHẦN 2 — SECURITY GROUPS

```bash
SG_ALB=$(aws ec2 create-security-group --group-name alb-sg --description "ALB SG" --vpc-id $VPC_ID --query 'GroupId' --output text)
aws ec2 authorize-security-group-ingress --group-id $SG_ALB --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-id $SG_ALB --protocol tcp --port 443 --cidr 0.0.0.0/0

SG_WEB=$(aws ec2 create-security-group --group-name web-sg --description "Web SG" --vpc-id $VPC_ID --query 'GroupId' --output text)
aws ec2 authorize-security-group-ingress --group-id $SG_WEB --protocol tcp --port 80 --source-group $SG_ALB
aws ec2 authorize-security-group-ingress --group-id $SG_WEB --protocol tcp --port 443 --source-group $SG_ALB

MY_IP=$(curl -s ifconfig.me)
echo $MY_IP
SG_BASTION=$(aws ec2 create-security-group --group-name bastion-sg --description "Bastion SG" --vpc-id $VPC_ID --query 'GroupId' --output text)
aws ec2 authorize-security-group-ingress --group-id $SG_BASTION --protocol tcp --port 22 --cidr "${MY_IP}/32"

aws ec2 authorize-security-group-ingress --group-id $SG_WEB --protocol tcp --port 22 --source-group $SG_BASTION
```
**Windows PowerShell** — `curl` mặc định trong PowerShell không giống Linux, dùng lệnh này thay thế để lấy IP cá nhân:
```powershell
$MY_IP = (Invoke-RestMethod -Uri "https://ifconfig.me/ip")
echo $MY_IP
```
rồi dùng `"$MY_IP/32"` khi gõ `--cidr`.

**Kiểm chứng**: AWS Console → EC2 → Security Groups → bạn thấy 3 nhóm `alb-sg`, `web-sg`, `bastion-sg` với đúng luật vừa tạo.

---

## PHẦN 3 — TẠO MÁY ẢO (EC2)

Trước tiên tìm AMI Amazon Linux mới nhất trong region của bạn:
```bash
aws ec2 describe-images --owners amazon \
  --filters "Name=name,Values=al2023-ami-*-x86_64" "Name=state,Values=available" \
  --query "sort_by(Images, &CreationDate)[-1].ImageId" --output text
```
Copy kết quả (dạng `ami-0xxxxxxxxxxx`) và thay vào biến `AMI_ID` bên dưới.

```bash
AMI_ID=ami-xxxxxxxxxxxxxxxxx

aws ec2 run-instances --image-id $AMI_ID --instance-type t2.micro \
  --key-name keypair --subnet-id $PUB_SUBNET --security-group-ids $SG_BASTION \
  --associate-public-ip-address --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=bastion-host}]"

aws ec2 run-instances --image-id $AMI_ID --instance-type t2.micro \
  --key-name keypair --subnet-id $PRIV_SUBNET --security-group-ids $SG_WEB \
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=web-server}]"
```
Đợi khoảng 1 phút cho máy khởi động xong, rồi lấy IP để SSH:
```bash
aws ec2 describe-instances --filters "Name=tag:Name,Values=bastion-host" \
  --query "Reservations[0].Instances[0].PublicIpAddress" --output text

aws ec2 describe-instances --filters "Name=tag:Name,Values=web-server" \
  --query "Reservations[0].Instances[0].PrivateIpAddress" --output text
```
Ghi lại 2 IP này — bạn sẽ dùng ở phần SSH bên dưới.

### SSH vào Bastion rồi vào Web Server
```bash
ssh -i keypair.pem ec2-user@<IP-Public-Bastion>
```
Nếu là lần đầu SSH, nó hỏi `Are you sure you want to continue connecting (yes/no)?` → gõ `yes` → Enter.

**Từ bên trong Bastion**, bạn cần copy key vào đó để nhảy tiếp (hoặc dùng cách `ProxyJump` gọn hơn ở dưới). Cách đơn giản: dùng `scp` từ máy cá nhân để copy key vào Bastion trước khi SSH:
```bash
scp -i keypair.pem keypair.pem ec2-user@<IP-Public-Bastion>:~/keypair.pem
ssh -i keypair.pem ec2-user@<IP-Public-Bastion>
# --- giờ bạn đang ở trong Bastion ---
chmod 400 keypair.pem
ssh -i keypair.pem ec2-user@<IP-Private-WebServer>
# --- giờ bạn đang ở trong Web Server ---
```
Cài Nginx (gõ trực tiếp trong Web Server sau khi đã SSH vào):
```bash
sudo yum update -y
sudo yum install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
echo "<h1>Xin chao tu Private Subnet</h1>" | sudo tee /usr/share/nginx/html/index.html
```
Gõ `exit` hai lần để thoát ra Web Server rồi ra Bastion, quay về máy cá nhân.

### Cách gọn hơn (khuyên dùng): SSH thẳng qua ProxyJump, không cần copy key
Trên **máy cá nhân**, tạo/sửa file `~/.ssh/config` (Mac: `nano ~/.ssh/config`; Windows: dùng Notepad mở file `C:\Users\<tên bạn>\.ssh\config`, tạo thư mục `.ssh` nếu chưa có):
```
Host bastion
  HostName <IP-Public-Bastion>
  User ec2-user
  IdentityFile ~/keypair.pem

Host webserver
  HostName <IP-Private-WebServer>
  User ec2-user
  ProxyJump bastion
  IdentityFile ~/keypair.pem
```
Lưu file, sau đó chỉ cần gõ:
```
ssh webserver
```
để vào thẳng Web Server mà không cần copy key thủ công.

---

## PHẦN 4 — LOAD BALANCER

```bash
TG_ARN=$(aws elbv2 create-target-group --name web-tg --protocol HTTP --port 80 \
  --vpc-id $VPC_ID --target-type instance --health-check-path / \
  --query 'TargetGroups[0].TargetGroupArn' --output text)
```
Lấy Instance ID của web-server để đăng ký vào target group:
```bash
WEB_INSTANCE_ID=$(aws ec2 describe-instances --filters "Name=tag:Name,Values=web-server" \
  --query "Reservations[0].Instances[0].InstanceId" --output text)

aws elbv2 register-targets --target-group-arn $TG_ARN --targets Id=$WEB_INSTANCE_ID
```
ALB cần **2 subnet công cộng ở 2 AZ khác nhau** — tạo thêm 1 subnet public nữa:
```bash
PUB_SUBNET2=$(aws ec2 create-subnet --vpc-id $VPC_ID --cidr-block 10.0.3.0/24 \
  --availability-zone ap-southeast-2b --query 'Subnet.SubnetId' --output text)
aws ec2 associate-route-table --route-table-id $RTB_PUB --subnet-id $PUB_SUBNET2
aws ec2 modify-subnet-attribute --subnet-id $PUB_SUBNET2 --map-public-ip-on-launch
```
Tạo ALB:
```bash
ALB_ARN=$(aws elbv2 create-load-balancer --name demo-alb --subnets $PUB_SUBNET $PUB_SUBNET2 \
  --security-groups $SG_ALB --scheme internet-facing --type application \
  --query 'LoadBalancers[0].LoadBalancerArn' --output text)
```
Lấy DNS name của ALB (để test tạm bằng HTTP trước khi có domain/SSL):
```bash
aws elbv2 describe-load-balancers --load-balancer-arns $ALB_ARN \
  --query 'LoadBalancers[0].DNSName' --output text
```
Copy DNS name này, dán vào trình duyệt để xem trang Nginx của bạn (lúc này còn là HTTP, ALB chưa có listener nên có thể lỗi — làm tiếp Phần 5 để hoàn tất).

---

## PHẦN 5 — HTTPS

Nếu **không có domain riêng**, bạn có thể bỏ qua chứng chỉ SSL và chỉ tạo 1 listener HTTP để demo tạm (ALB → Web Server qua cổng 80):
```bash
aws elbv2 create-listener --load-balancer-arn $ALB_ARN --protocol HTTP --port 80 \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN
```
Sau đó dán DNS name của ALB vào trình duyệt (`http://<DNS-name-ALB>`) → phải thấy trang "Xin chao tu Private Subnet".

Nếu **có domain riêng**, làm theo:
```bash
CERT_ARN=$(aws acm request-certificate --domain-name demo.tenmien.com \
  --validation-method DNS --query 'CertificateArn' --output text)
```
Vào ACM Console (web) → xem certificate vừa tạo → copy bản ghi CNAME được yêu cầu → thêm vào DNS domain của bạn (Route 53 hoặc nơi bạn mua domain) → đợi vài phút đến khi trạng thái chuyển "Issued".

```bash
aws elbv2 create-listener --load-balancer-arn $ALB_ARN --protocol HTTPS --port 443 \
  --certificates CertificateArn=$CERT_ARN \
  --default-actions Type=forward,TargetGroupArn=$TG_ARN

aws elbv2 modify-listener --listener-arn <ARN-cua-listener-80-vua-tao> \
  --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}"
```
Cuối cùng, trong Route 53 (hoặc DNS provider khác), tạo bản ghi A/Alias trỏ domain về DNS name của ALB.

---

## PHẦN 6 — DỌN DẸP KHI XONG DEMO (đừng quên, tránh mất phí)

```bash
aws elbv2 delete-load-balancer --load-balancer-arn $ALB_ARN
aws ec2 delete-nat-gateway --nat-gateway-id $NAT_ID
```
Đợi khoảng 1-2 phút cho NAT xoá xong rồi mới release IP:
```bash
aws ec2 release-address --allocation-id $EIP_ALLOC
```
Terminate 2 máy ảo:
```bash
aws ec2 terminate-instances --instance-ids $WEB_INSTANCE_ID
# lấy bastion instance id tương tự rồi terminate luôn
```
Phần VPC/Subnet/IGW/Route Table có thể xoá thủ công trong Console (VPC → chọn VPC → Actions → Delete VPC, nó sẽ tự xoá các thành phần con phụ thuộc).

---

## Mẹo gỡ lỗi nhanh
- Lệnh báo `command not found: aws` → CLI chưa cài đúng, mở lại terminal hoặc cài lại.
- Lệnh báo `Unable to locate credentials` → chạy lại `aws configure`.
- SSH báo `Permission denied (publickey)` → sai đường dẫn key hoặc chưa `chmod 400`.
- Trình duyệt không load được trang → kiểm tra Target Group Health Check (EC2 Console → Target Groups → xem trạng thái "healthy"/"unhealthy").
