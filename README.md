# Website Thiệp Cưới - manhvahuyen.com

Website thiệp cưới đẹp mắt được xây dựng bằng Hexo, với khả năng tạo thiệp mời cá nhân hóa cho từng khách mời.

## ✨ Tính năng

### Trang chủ (Thiệp cưới)
- Hiển thị thiệp mời chung khi truy cập `manhvahuyen.com`
- Hiển thị thiệp cá nhân hóa với tên khách khi truy cập `manhvahuyen.com/?q=Tên+Khách+Mời`
- Giao diện đẹp với animation, gradient, và decorations
- Responsive design - đẹp trên mọi thiết bị

### Trang Admin (`/admin/`)
- Đăng nhập bảo mật với mật khẩu (mã hóa SHA-256)
- Thêm khách mời và tự động tạo link cá nhân hóa
- Quản lý danh sách khách mời
- Copy link nhanh chóng
- Lưu trữ dữ liệu trong localStorage (không cần database)

## 🚀 Cài đặt & Sử dụng

### 1. Cài đặt dependencies
```bash
npm install
```
hi
### 2. Chạy server local
```bash
npm run server
# hoặc
npx hexo server
```

Truy cập: `http://localhost:4000`

### 3. Build website
```bash
npm run build
# hoặc
npx hexo generate
```

Files static sẽ được tạo trong thư mục `public/`

## 🔐 Đăng nhập Admin

**Mật khẩu mặc định:** `admin123`

### Thay đổi mật khẩu

1. Mở file [themes/wedding/source/js/main.js](themes/wedding/source/js/main.js)
2. Tìm dòng:
```javascript
const correctHash = '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9';
```
3. Tạo hash mới cho mật khẩu của bạn:
   - Mở console trong browser (F12)
   - Chạy lệnh:
   ```javascript
   async function hashPassword(password) {
       const encoder = new TextEncoder();
       const data = encoder.encode(password);
       const hashBuffer = await crypto.subtle.digest('SHA-256', data);
       const hashArray = Array.from(new Uint8Array(hashBuffer));
       return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
   }
   hashPassword('mật_khẩu_mới_của_bạn').then(console.log);
   ```
4. Copy hash vừa tạo và thay thế vào `correctHash`
5. Build lại website

## 📝 Tùy chỉnh thông tin đám cưới

Chỉnh sửa file [themes/wedding/_config.yml](themes/wedding/_config.yml):

```yaml
# Wedding information
groom: Mạnh
bride: Huyền
wedding_date: "2025-12-25"
wedding_time: "10:00 AM"
venue: "Nhà Hàng Tiệc Cưới ABC"
address: "123 Đường ABC, Quận XYZ, TP. HCM"
```

## 🎨 Tùy chỉnh giao diện

### Màu sắc
Chỉnh sửa CSS variables trong [themes/wedding/source/css/style.css](themes/wedding/source/css/style.css):

```css
:root {
    --primary-color: #d4a574;      /* Màu vàng gold */
    --secondary-color: #f4e4d7;    /* Màu nền nhạt */
    --accent-color: #c97a7e;       /* Màu hồng nhạt */
    --text-dark: #2c2c2c;          /* Màu chữ đậm */
    --text-light: #666;            /* Màu chữ nhạt */
}
```

### Fonts
Google Fonts được sử dụng:
- **Playfair Display** - Tiêu đề chính
- **Great Vibes** - Tên cặp đôi (cursive)
- **Montserrat** - Văn bản chính

## 📂 Cấu trúc dự án

```
manhvahuyen.com/
├── source/
│   ├── index.md          # Trang chủ
│   └── admin/
│       └── index.md      # Trang admin
├── themes/
│   └── wedding/
│       ├── layout/
│       │   ├── layout.ejs    # Layout chung
│       │   ├── index.ejs     # Layout trang chủ
│       │   └── admin.ejs     # Layout trang admin
│       ├── source/
│       │   ├── css/
│       │   │   └── style.css # Tất cả CSS
│       │   └── js/
│       │       └── main.js   # Tất cả JavaScript
│       └── _config.yml       # Cấu hình theme
├── _config.yml               # Cấu hình Hexo chính
└── package.json
```

## 💡 Cách sử dụng

### Tạo link cho khách mời

1. Truy cập `/admin/`
2. Đăng nhập bằng mật khẩu
3. Nhập tên khách mời (ví dụ: "Nguyễn Văn A")
4. Click "Thêm Khách Mời"
5. Link sẽ tự động được tạo: `/?q=Nguyễn+Văn+A`
6. Click "Copy" để copy link
7. Gửi link cho khách mời

### Khi khách mời mở link

Website sẽ hiển thị:
```
Kính mời
Nguyễn Văn A

[Nội dung thiệp cưới...]
```

## 🌐 Deploy

### Deploy lên GitHub Pages

1. Install hexo-deployer-git:
```bash
npm install hexo-deployer-git --save
```

2. Cập nhật `_config.yml`:
```yaml
deploy:
  type: git
  repo: https://github.com/username/manhvahuyen.com.git
  branch: gh-pages
```

3. Deploy:
```bash
npx hexo deploy
```

### Deploy lên Netlify/Vercel

1. Build website:
```bash
npm run build
```

2. Upload thư mục `public/` lên Netlify hoặc Vercel

## 📱 Responsive

Website tự động responsive và hiển thị đẹp trên:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎉 Features

- ✅ Không cần backend/database
- ✅ Mã hóa mật khẩu SHA-256 trên browser
- ✅ Lưu trữ localStorage
- ✅ Copy to clipboard
- ✅ URL encoding cho tiếng Việt có dấu
- ✅ Animations & transitions đẹp mắt
- ✅ Google Fonts
- ✅ Font Awesome icons
- ✅ Hoàn toàn static - deploy dễ dàng

## 📄 License

MIT License - Tự do sử dụng cho mục đích cá nhân và thương mại. 
