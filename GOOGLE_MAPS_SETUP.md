# Hướng Dẫn Cấu Hình Google Maps Với 2 Địa Điểm

## Cấu hình thông tin địa điểm

### Bước 1: Cập nhật file `themes/wedding/_config.yml`

```yaml
# Wedding information
groom: Mạnh
bride: Huyền
wedding_date: "2025-12-25"

# Groom's venue (Nhà Trai)
groom_venue: "Nhà Hàng Tiệc Cưới ABC"
groom_address: "123 Đường ABC, Quận XYZ, TP. HCM"
groom_time: "10:00 AM"
groom_phone: "0123 456 789"
groom_maps_query: "123+Đường+ABC+Quận+XYZ+TP.HCM"

# Bride's venue (Nhà Dâu)
bride_venue: "Nhà Hàng Tiệc Cưới XYZ"
bride_address: "456 Đường XYZ, Quận ABC, TP. HCM"
bride_time: "6:00 PM"
bride_phone: "0987 654 321"
bride_maps_query: "456+Đường+XYZ+Quận+ABC+TP.HCM"
```

### Bước 2: Lấy địa chỉ chính xác từ Google Maps

1. Truy cập https://www.google.com/maps
2. Tìm địa điểm nhà hàng của bạn
3. Click vào địa điểm để hiển thị thông tin
4. Click nút "Share" (Chia sẻ)
5. Copy địa chỉ hoặc tọa độ

**Ví dụ:**
- Địa chỉ: "Nhà Hàng Metropole, 15 Ngô Quyền, Hoàn Kiếm, Hà Nội"
- Chuyển thành query: "Nhà+Hàng+Metropole+15+Ngô+Quyền+Hoàn+Kiếm+Hà+Nội"

### Bước 3: Cập nhật maps_query

Thay dấu cách bằng dấu `+` trong địa chỉ và paste vào `groom_maps_query` và `bride_maps_query`.

---

## PHƯƠNG ÁN 1: Sử dụng Google Maps Embed API (CÓ API KEY)

### Ưu điểm:
- Hiển thị bản đồ trực tiếp trên trang web
- Tự động vẽ route giữa 2 điểm
- Tùy chỉnh được nhiều (zoom, style, etc.)

### Nhược điểm:
- Cần tạo API key (miễn phí nhưng phức tạp)
- Có giới hạn số lần load bản đồ mỗi tháng (25,000 lần miễn phí)

### Hướng dẫn lấy API key:

1. Truy cập https://console.cloud.google.com/
2. Tạo project mới hoặc chọn project có sẵn
3. Vào menu "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "API key"
5. Copy API key
6. (Tùy chọn) Click "Restrict Key" để bảo mật:
   - Application restrictions: HTTP referrers
   - Website restrictions: `manhvahuyen.com/*`
   - API restrictions: Chọn "Maps Embed API"

### Cập nhật code:

Mở file `themes/wedding/layout/index.ejs`, tìm dòng:

```html
src="https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=...
```

Thay `YOUR_GOOGLE_MAPS_API_KEY` bằng API key thực tế của bạn.

---

## PHƯƠNG ÁN 2: Sử dụng My Maps (KHÔNG CẦN API KEY) ⭐ KHUYÊN DÙNG

### Ưu điểm:
- KHÔNG cần API key
- KHÔNG giới hạn
- Có thể tùy chỉnh icon, màu sắc cho từng marker
- Có thể thêm mô tả, hình ảnh cho mỗi địa điểm

### Hướng dẫn:

1. **Tạo My Map:**
   - Truy cập https://www.google.com/maps/d/
   - Click "Create a new map"

2. **Thêm 2 địa điểm:**
   - Click vào icon "Add marker" (ghim đỏ)
   - Search và thêm địa điểm nhà trai
   - Đặt tên: "Nhà Trai - [Tên nhà hàng]"
   - Thêm mô tả, giờ, số điện thoại vào description
   - Lặp lại cho nhà dâu

3. **Tùy chỉnh (optional):**
   - Click vào marker để đổi icon
   - Chọn icon khác nhau cho nhà trai/nhà dâu
   - Đổi màu cho mỗi marker

4. **Lấy embed code:**
   - Click nút "Share"
   - Click "Embed on my site"
   - Copy toàn bộ code `<iframe>...</iframe>`

5. **Cập nhật website:**
   - Mở file `themes/wedding/layout/index.ejs`
   - Tìm section `<!-- Google Maps với 2 markers -->`
   - Thay thế toàn bộ `<iframe>` bằng code vừa copy

**Ví dụ code nhận được:**
```html
<iframe src="https://www.google.com/maps/d/embed?mid=1a2b3c4d5e..."
        width="100%"
        height="450"
        style="border:0; border-radius: 15px;">
</iframe>
```

---

## PHƯƠNG ÁN 3: Chỉ dùng Link (ĐƠN GIẢN NHẤT)

Nếu không muốn nhúng bản đồ, website đã có sẵn:
- Nút "Chỉ Đường" cho từng địa điểm
- Nút "Xem Lộ Trình Giữa 2 Địa Điểm"

Các nút này sẽ mở Google Maps trong tab mới.

Để ẩn iframe và chỉ dùng buttons, mở `themes/wedding/layout/index.ejs` và xóa hoặc comment section:
```html
<!-- Google Maps với 2 markers -->
<div class="map-container">
    <!-- Xóa hoặc comment phần này -->
</div>
```

---

## So sánh các phương án

| Phương án | API Key | Giới hạn | Độ đẹp | Độ dễ |
|-----------|---------|----------|--------|-------|
| Phương án 1 (Embed API) | ✅ Cần | 25K/tháng | ⭐⭐⭐ | ⭐⭐ |
| Phương án 2 (My Maps) | ❌ Không | Không | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Phương án 3 (Links only) | ❌ Không | Không | ⭐⭐ | ⭐⭐⭐⭐⭐ |

---

## KHUYẾN NGHỊ: Dùng Phương án 2 (My Maps)

Đây là giải pháp tốt nhất cho thiệp cưới vì:
1. Không cần API key phức tạp
2. Không giới hạn
3. Tùy chỉnh đẹp mắt
4. Có thể thêm hình ảnh nhà hàng vào mô tả
5. Khách mời có thể xem trực tiếp trên trang mà không cần mở tab mới

---

## Xử lý sự cố

### Bản đồ không hiển thị
- Kiểm tra API key có đúng không (nếu dùng phương án 1)
- Kiểm tra địa chỉ trong maps_query có đúng format không
- Mở Console (F12) để xem lỗi

### Địa điểm sai vị trí
- Dùng tọa độ thay vì địa chỉ text:
  ```yaml
  groom_maps_query: "21.0285,105.8542"  # Latitude,Longitude
  ```

### Muốn thay đổi chế độ di chuyển
Trong URL Embed API, thay `mode=driving` bằng:
- `mode=walking` (đi bộ)
- `mode=bicycling` (xe đạp)
- `mode=transit` (phương tiện công cộng)

---

## Test

Sau khi cấu hình xong:

1. Build website:
```bash
npm run build
```

2. Chạy local server:
```bash
npm run server
```

3. Truy cập http://localhost:4000
4. Scroll xuống phần "Địa Điểm Tổ Chức"
5. Kiểm tra:
   - 2 location cards hiển thị đúng thông tin
   - Nút "Chỉ Đường" hoạt động
   - Bản đồ hiển thị đúng 2 điểm
   - Nút "Xem Lộ Trình" hoạt động
