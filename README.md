# BTL Java Frontend
Dự án gồm 2 repo, file readme viết chung cho cả dự án. 

Nhóm tác giả:
- Vũ Anh Tuấn
- Đinh Việt Dũng
- Nguyễn Vĩnh Trung
- Nguyễn Vĩnh Tùng
- Nguyễn Văn Hoàng

## Mục lục

1. [Giới thiệu dự án](#1-giới-thiệu-dự-án)
2. [Thiết kế Database](#2-thiết-kế-database)
3. [Back End](#3-back-end)
4. [Front End](#4-front-end)
   - [4.1 Công nghệ](#41-công-nghệ)
   - [4.2 Giao diện người dùng cuối](#42-giao-diện-người-dùng-cuối)
   - [4.3 Giao diện quản trị](#43-giao-diện-quản-trị)
5. [Hướng dẫn cài đặt và chạy dự án](#5-hướng-dẫn-cài-đặt-và-chạy-dự-án)
6. [Lưu ý](#6-lưu-ý)


---

## 1. Giới thiệu dự án

### FASHCO - Nền Tảng Thương Mại Điện Tử Thời Trang

FASHCO là website bán quần áo trực tuyến dành cho giới trẻ với kiến trúc tách biệt Frontend và Backend, tập trung vào trải nghiệm mua sắm tiện lợi và quy trình quản lý tối ưu.

### 📖 Tổng quan hệ thống

Hệ thống cung cấp quy trình khép kín từ tìm kiếm sản phẩm, đặt hàng, thanh toán online đến theo dõi vận đơn và chăm sóc khách hàng.

**Các phân hệ chính:**
- **Client**: Giao diện thân thiện, responsive cho khách hàng
- **Admin**: Dashboard quản lý tập trung toàn bộ hệ thống
- **Server & Database**: Xử lý nghiệp vụ logic và lưu trữ dữ liệu

### 🚀 Tính năng nổi bật

#### 🛒 Dành cho Khách hàng
- **Tài khoản & Bảo mật**: Đăng ký/Đăng nhập (OAuth2/Google) và quản lý hồ sơ
- **Mua sắm**: Tìm kiếm, lọc đa tiêu chí, xem biến thể (màu sắc, kích thước), quản lý giỏ hàng
- **Thanh toán**: Thanh toán trực tuyến qua VNPay và theo dõi đơn hàng real-time
- **Chat**: Hệ thống chat real-time với Admin

#### 🛠 Dành cho Quản trị viên
- **Dashboard**: Báo cáo doanh thu, đơn hàng và hiệu suất kinh doanh
- **Quản lý sản phẩm**: Danh mục, sản phẩm và biến thể (SKU, tồn kho)
- **Quản lý vận hành**: Xử lý đơn hàng, người dùng và các đợt khuyến mãi

### 🏗 Kiến trúc & Công nghệ

**Backend:**
- **Framework**: Spring Ecosystem (RESTful API)
- **Security**: JWT (JSON Web Token)
- **Communication**: WebSocket (Real-time Chat)
- **Integrations**: Cloudinary (lưu trữ), VNPay (thanh toán)

**Frontend:**
- **Framework**: React (SPA)
- **UI/UX**: Material UI/Ant Design
- **State Management**: Quản lý trạng thái và API calls

**Database:**
- **RDBMS**: MySQL
- **ORM**: JPA/Hibernate

### 🌐 Triển khai

- **Frontend**: Vercel
- **Backend & Database**: Railway (CI/CD tự động)

## 2. Thiết kế Database
Xem tại [Github](https://github.com/hoangnv25/BTL_Java_BE)

## 3. Back End
Xem tại [Github](https://github.com/hoangnv25/BTL_Java_BE)

## 4. Front End
### 4.1. Công nghệ
### 4.2. Giao diện người dùng cuối

**Xác thực người dùng:**
![Đăng nhập](./Readme_img/dangnhap.jpg)
![Đăng kí](./Readme_img/dangki.jpg)
Giao diện đăng nhập và đăng ký tài khoản với hỗ trợ đăng nhập qua Google.

**Trang chủ và danh mục:**
![Giảm giá ở trang chủ](./Readme_img/homesale.jpg)
![Trang giảm giá](./Readme_img/sale.jpg)
![Sản phẩm mới](./Readme_img/new.jpg)
![1 trong những danh mục (sơ mi)](./Readme_img/category.jpg)
Trang chủ hiển thị sản phẩm giảm giá, sản phẩm mới và danh mục sản phẩm.

**Chi tiết sản phẩm và đánh giá:**
![Chi tiết 1 sản phẩm](./Readme_img/detail.jpg)
![Đánh giá về shop](./Readme_img/review.jpg)
Trang chi tiết sản phẩm với các biến thể (màu sắc, kích thước) và phần đánh giá shop.

**Quản lý tài khoản và đơn hàng:**
![Trang thông tin của khách hàng (my inf)](./Readme_img/user.jpg)
![My order](./Readme_img/myorder.jpg)
![My cart](./Readme_img/mycart.jpg)
Trang quản lý thông tin cá nhân, xem lịch sử đơn hàng và quản lý giỏ hàng.

**Thanh toán và hỗ trợ:**
![Thanh toán/Đặt đơn/Check out](./Readme_img/checkout.jpg)
![Giao diện nhắn tin cho shop](./Readme_img/chat.jpg)
Trang thanh toán tích hợp VNPay và giao diện chat real-time với shop.

**Một vài giao diện responsive:**

<table>
<tr>
<td><img src="./Readme_img/re.jpg" alt="Responsive 1" width="200"></td>
<td><img src="./Readme_img/re1.jpg" alt="Responsive 2" width="200"></td>
<td><img src="./Readme_img/re2.jpg" alt="Responsive 3" width="200"></td>
</tr>
<tr>
<td><img src="./Readme_img/re3.jpg" alt="Responsive 4" width="200"></td>
<td><img src="./Readme_img/re4.jpg" alt="Responsive 5" width="200"></td>
<td><img src="./Readme_img/re5.jpg" alt="Responsive 6" width="200"></td>
</tr>
<tr>
<td><img src="./Readme_img/re6.jpg" alt="Responsive 7" width="200"></td>
<td><img src="./Readme_img/re7.jpg" alt="Responsive 8" width="200"></td>
<td><img src="./Readme_img/re8.jpg" alt="Responsive 9" width="200"></td>
</tr>
</table>

### 4.3. Giao diện quản trị
![z](./Readme_img/z3.jpg)
![z](./Readme_img/z2.jpg)
![z](./Readme_img/z5.jpg)
![z](./Readme_img/z6.jpg)
![z](./Readme_img/z1.jpg)
![z](./Readme_img/z4.jpg)
![z](./Readme_img/z7.jpg)

## 5. Hướng dẫn cài đặt và chạy dự án
Xem tại [Github](https://github.com/hoangnv25/BTL_Java_BE)

## 6. Lưu ý

- **Báo cáo dự án**: Xem trong [Github Backend](https://github.com/hoangnv25/BTL_Java_BE)
- **Mục đích**: Dự án được phát triển phục vụ mục đích học tập, không vì mục đích thương mại
- **Tích hợp dịch vụ**: 
  - OAuth2 Google và VNPay yêu cầu cấu hình credentials/API keys riêng. Khi clone dự án về, bạn cần tự cấu hình các thông tin này trong file cấu hình để các tính năng này hoạt động
  - Tham khảo tài liệu của Google OAuth2 và VNPay Sandbox để thiết lập
- **Hình ảnh**: Các hình ảnh sản phẩm trong dự án được tham khảo từ các website thương mại điện tử, chỉ sử dụng cho mục đích học tập và demo
