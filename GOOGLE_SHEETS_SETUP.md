# Hướng Dẫn Tích Hợp Google Sheets cho Form RSVP

## Bước 1: Tạo Google Sheet

1. Truy cập https://sheets.google.com
2. Tạo một Sheet mới
3. Đặt tên cho Sheet (ví dụ: "Wedding RSVP")
4. Tạo các cột header ở hàng đầu tiên:
   - Cột A: `Họ và Tên`
   - Cột B: `Số Điện Thoại`
   - Cột C: `Tham Dự`
   - Cột D: `Lời Nhắn`
   - Cột E: `Thời Gian`

## Bước 2: Tạo Google Apps Script

1. Trong Google Sheet vừa tạo, click **Extensions** > **Apps Script**
2. Xóa code mặc định và paste code sau vào:

```javascript
function doPost(e) {
  try {
    // Lấy spreadsheet hiện tại
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

    // Parse dữ liệu từ request
    var data = JSON.parse(e.postData.contents);

    // Thêm một hàng mới với dữ liệu
    sheet.appendRow([
      data.name,
      data.phone,
      data.attendance,
      data.message,
      data.timestamp
    ]);

    // Trả về kết quả thành công
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'success',
      'message': 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Trả về lỗi nếu có
    return ContentService.createTextOutput(JSON.stringify({
      'status': 'error',
      'message': error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("Script is working!");
}
```

3. Click **Save** (biểu tượng đĩa mềm) và đặt tên project (ví dụ: "Wedding RSVP Handler")

## Bước 3: Deploy Apps Script

1. Click nút **Deploy** > **New deployment**
2. Click biểu tượng ⚙️ (gear) bên cạnh "Select type"
3. Chọn **Web app**
4. Cấu hình như sau:
   - **Description**: Wedding RSVP Form
   - **Execute as**: Me (email của bạn)
   - **Who has access**: Anyone
5. Click **Deploy**
6. Có thể sẽ yêu cầu ủy quyền:
   - Click **Authorize access**
   - Chọn tài khoản Google của bạn
   - Click **Advanced** > **Go to [Project name] (unsafe)**
   - Click **Allow**
7. Copy **Web app URL** (URL này sẽ có dạng: `https://script.google.com/macros/s/.../exec`)

## Bước 4: Cập Nhật Code Website

1. Mở file `themes/wedding/source/js/main.js`
2. Tìm dòng:
```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
```
3. Thay thế `'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'` bằng URL vừa copy (giữ nguyên dấu ngoặc đơn)

Ví dụ:
```javascript
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxxx.../exec';
```

4. Save file và deploy lại website:
```bash
npm run build
```

## Bước 5: Test

1. Truy cập website của bạn
2. Scroll xuống phần "Xác Nhận Tham Dự"
3. Điền thông tin và submit form
4. Kiểm tra Google Sheet, dữ liệu sẽ xuất hiện trong sheet

## Lưu Ý

- Dữ liệu cũng được lưu trong localStorage của trình duyệt như một backup
- Nếu có lỗi khi gửi đến Google Sheets, form vẫn sẽ hiển thị thông báo thành công do chế độ `no-cors`
- Để xem dữ liệu backup trong localStorage, mở Console trình duyệt và gõ:
  ```javascript
  JSON.parse(localStorage.getItem('wedding_rsvp'))
  ```

## Troubleshooting

### Lỗi "Script function not found: doPost"
- Đảm bảo bạn đã save code Apps Script
- Redeploy lại Apps Script

### Dữ liệu không xuất hiện trong Sheet
- Kiểm tra URL trong `main.js` có đúng không
- Kiểm tra Apps Script có được deploy với "Who has access: Anyone" không
- Mở Console trình duyệt (F12) để xem có lỗi gì không

### Test Apps Script trực tiếp
Gửi POST request test đến Apps Script URL bằng cURL:
```bash
curl -L -X POST "YOUR_APPS_SCRIPT_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"0123456789","attendance":"Có, tôi sẽ đến","message":"Test message","timestamp":"2025-01-01 10:00:00"}'
```

## Xem Dữ liệu

Tất cả RSVP sẽ được ghi vào Google Sheet theo thời gian thực. Bạn có thể:
- Xem trực tiếp trên Google Sheets
- Export ra Excel (.xlsx)
- Tạo charts/thống kê trong Google Sheets
- Chia sẻ với người khác (chỉ để xem, không để edit)
