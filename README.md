<div align="center">

<h1>RAIA Extension <BR> LƯU Ý : MỤC ĐÍCH NGHIÊN CỨU LOGIC, CẤM TÀ ĐẠO</h1>

<img src="icons/icon.png" width="120">

<p>
Browser Extension for <b>Rikkei Education</b>
</p>

<p>
Developed by <a href="https://www.facebook.com/ntbphuoc"><b>Phước NTB</b></a> Support ft.  <a href="https://www.facebook.com/NhuDangKocho/">NhuDangKocho - 27 NETTEAM</a>
</p>

<p>
<a href="https://github.com/kachion27/RAIA-extension-source">GitHub Repository</a>
</p>

</div>

<hr>

<div class="readme-container">

<h2>🚀 Introduction</h2>

<p>
<strong>RAIA Extension</strong> là tiện ích trình duyệt được phát triển cho hệ thống học tập của 
<b>Rikkei Education</b>. Extension giúp sinh viên và giảng viên đăng nhập, đồng bộ dữ liệu 
và tương tác với hệ thống RAIA trực tiếp trên trình duyệt.
</p>

<div class="box">

<h3>RAIA Browser Extension</h3>

<p>
Extension nội bộ dành cho hệ sinh thái đào tạo của Rikkei Education, hỗ trợ xác thực người dùng 
và tích hợp API hệ thống RAIA.
</p>

</div>

<h2>✨ Features</h2>

<div class="feature">
<b>Authentication System</b><br>
Đăng nhập và xác thực người dùng với hệ thống RAIA
</div>

<div class="feature">
<b>Environment Sync</b><br>
Đồng bộ môi trường học tập với server
</div>

<div class="feature">
<b>Popup Interface</b><br>
Giao diện popup giúp truy cập nhanh các chức năng
</div>

<div class="feature">
<b>Internal API Integration</b><br>
Kết nối trực tiếp với API nội bộ của Rikkei Education
</div>

<h2>📂 Project Structure</h2>

<div class="code">

RAIA-extension-source  
│  
├── manifest.json  
├── config.js  
│  
├── auth/  
│   ├── auth.html  
│   ├── auth.css  
│   └── auth.js  
│  
├── popup/  
│   ├── popup.html  
│   ├── popup.css  
│   └── popup.js  
│  
├── background/  
│   └── background.js  
│  
├── scripts/  
│   └── sync-env.js  
│  
├── lib/  
│   ├── api.js  
│   └── api-config.js  
│  
├── icons/  
│   └── icon.png  
│  
└── _metadata/  

</div>

<h2>⚙️ Installation</h2>

<h3>1️⃣ Clone repository</h3>

<div class="code">

git clone https://github.com/kachion27/RAIA-extension-source.git

</div>

<h3>2️⃣ Load Extension vào Chrome / Cốc Cốc</h3>

<div class="code">

chrome://extensions

</div>

<p>

1. Bật <b>Developer Mode</b>  
2. Chọn <b>Load unpacked</b>  
3. Chọn thư mục project  

</p>

<h2>🧰 Technologies</h2>

<ul>
<li>JavaScript</li>
<li>HTML / CSS</li>
<li>Chrome Extension API</li>
<li>REST API</li>
</ul>

<h2>📦 Extension Info</h2>

<table>
<tr>
<td><b>Name</b></td>
<td>RAIA Extension</td>
</tr>

<tr>
<td><b>Version</b></td>
<td>1.0.0</td>
</tr>

<tr>
<td><b>Platform</b></td>
<td>Chromium / Gecko</td>
</tr>

<tr>
<td><b>Language</b></td>
<td>Vietnamese</td>
</tr>

<tr>
<td><b>Organization</b></td>
<td>Rikkei Education</td>
</tr>

</table>

<h2>👨‍💻 Developer</h2>

<p>

<b>Phước NTB</b><br>
Developer at <b>Rikkei Education</b>

</p>

<hr>

<div align="center">

Made with ❤️ for Rikkei Education
<br>
<a href="https://raia.edu.vn/privacy">
Chính sách bảo mật của extension
</a>
<section class="privacy-section">
  <h2 class="privacy-lang">Tiếng Việt</h2>
  <p class="privacy-intro">Raia Extension được phát triển cho mục đích giám sát giáo dục trong hệ thống học tập của Rikkei Education.</p>
  <h3>Thông Tin Chúng Tôi Thu Thập</h3>
  <p>Tiện ích thu thập các thông tin sau từ tab trình duyệt đang hoạt động:</p>
  <ul>
    <li>URL của tab đang mở</li>
    <li>Tên miền của trang web được truy cập</li>
    <li>Tiêu đề trang</li>
  </ul>
  <h3>Mục Đích Thu Thập Dữ Liệu</h3>
  <p>Dữ liệu thu thập được sử dụng để giám sát tuân thủ chính sách học tập trong các phiên có giám sát như lớp học trực tuyến hoặc thi cử.</p>
  <h3>Truyền Tải Dữ Liệu</h3>
  <p>Thông tin thu thập có thể được truyền tải an toàn đến máy chủ giám sát do Rikkei Education vận hành để phân tích và phát hiện vi phạm.</p>
  <h3>Sử Dụng Dữ Liệu</h3>
  <p>Tiện ích không thu thập thông tin cá nhân như mật khẩu, nội dung nhập form hay tin nhắn riêng tư.</p>
  <h3>Chia Sẻ Dữ Liệu</h3>
  <p>Dữ liệu thu thập chỉ được sử dụng trong hệ thống giám sát Rikkei Education và không chia sẻ với bên thứ ba.</p>
  <h3>Quyền Kiểm Soát Của Người Dùng</h3>
  <p>Tiện ích chỉ hoạt động trong các phiên giám sát giáo dục được phép.</p>
  <h3>Liên Hệ</h3>
  <p>Nếu bạn có thắc mắc về chính sách này, vui lòng liên hệ Rikkei Education.</p>
</section>

</div>

</div>
