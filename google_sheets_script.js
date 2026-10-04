/**
 * =================================
 * GOOGLE SHEETS SCRIPT - TẠO LINK MỜI CƯỚI
 * =================================
 * 
 * CÁCH DÙNG:
 * 1. Bôi đen các ô chứa TÊN khách mời (ví dụ: B5:B21)
 * 2. Vào menu "🎊 Tạo Link Mời" > "Tạo Link Từ Vùng Chọn"
 * 3. Chọn: Nhà Trai / Nhà Gái
 * 4. Chọn: Có Quà / Không Quà
 * 5. Link sẽ tự động điền vào cột bên cạnh (cột C nếu chọn cột B)
 */

const BASE_URL = "https://manhvahuyen.com";

function onOpen() {
    SpreadsheetApp.getUi()
        .createMenu('🎊 Tạo Link Mời')
        .addItem('📍 Tạo Link Từ Vùng Chọn', 'generateLinksFromSelection')
        .addSeparator()
        .addItem('❓ Hướng dẫn', 'showHelp')
        .addToUi();
}

// Mã hóa Base64 URL-safe
function encodeGuest(name, side, showGift) {
    const data = JSON.stringify({ n: name, s: side, g: showGift });
    const encoded = Utilities.base64Encode(data, Utilities.Charset.UTF_8);
    return encoded.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function generateLink(code) {
    return BASE_URL + "/?g=" + code;
}

// HÀM CHÍNH: Tạo link từ vùng chọn
function generateLinksFromSelection() {
    const ui = SpreadsheetApp.getUi();
    const sheet = SpreadsheetApp.getActiveSheet();
    const selection = sheet.getActiveRange();

    if (!selection) {
        ui.alert('❌ Lỗi', 'Vui lòng bôi đen các ô chứa TÊN khách mời trước!', ui.ButtonSet.OK);
        return;
    }

    const numRows = selection.getNumRows();
    const numCols = selection.getNumColumns();

    if (numCols > 1) {
        ui.alert('❌ Lỗi', 'Chỉ chọn 1 cột chứa tên khách mời thôi nhé!', ui.ButtonSet.OK);
        return;
    }

    // Bước 1: Hỏi Nhà Trai hay Nhà Gái
    const sideResponse = ui.alert(
        '🏠 Chọn Bên',
        'Khách mời thuộc bên nào?\n\nNhấn CÓ = 🤵 Nhà Trai\nNhấn KHÔNG = 👰 Nhà Gái',
        ui.ButtonSet.YES_NO_CANCEL
    );

    if (sideResponse === ui.Button.CANCEL) {
        ui.alert('Đã hủy!');
        return;
    }

    const side = (sideResponse === ui.Button.YES) ? 'nha-trai' : 'nha-gai';
    const sideLabel = (side === 'nha-trai') ? '🤵 Nhà Trai' : '👰 Nhà Gái';

    // Bước 2: Hỏi Có Quà hay Không
    const giftResponse = ui.alert(
        '🎁 Hiển Thị Hộp Quà?',
        'Khách này có hiển thị Hộp Mừng Cưới không?\n\nNhấn CÓ = 🎁 Có Quà\nNhấn KHÔNG = ❌ Không Quà',
        ui.ButtonSet.YES_NO_CANCEL
    );

    if (giftResponse === ui.Button.CANCEL) {
        ui.alert('Đã hủy!');
        return;
    }

    const showGift = (giftResponse === ui.Button.YES);
    const giftLabel = showGift ? '🎁 Có Quà' : '❌ Không Quà';

    // Bước 3: Tạo link và ghi vào cột bên cạnh
    const startRow = selection.getRow();
    const startCol = selection.getColumn();
    const outputCol = startCol + 1; // Cột bên cạnh

    let count = 0;

    for (let i = 0; i < numRows; i++) {
        const name = selection.getCell(i + 1, 1).getValue();

        if (!name || name.toString().trim() === '') continue;

        const code = encodeGuest(name.toString().trim(), side, showGift);
        const link = generateLink(code);

        // Ghi link vào cột bên cạnh
        sheet.getRange(startRow + i, outputCol).setValue(link);
        count++;
    }

    ui.alert(
        '✅ Hoàn Thành!',
        `Đã tạo ${count} link mời!\n\n` +
        `Bên: ${sideLabel}\n` +
        `Quà: ${giftLabel}\n\n` +
        `Link đã được điền vào cột ${String.fromCharCode(64 + outputCol)}`,
        ui.ButtonSet.OK
    );
}

function showHelp() {
    const html = HtmlService.createHtmlOutput(`
    <h2>📋 Hướng Dẫn</h2>
    <ol>
      <li><b>Bôi đen</b> các ô chứa TÊN khách mời (vd: B5:B21)</li>
      <li>Vào menu <b>🎊 Tạo Link Mời</b></li>
      <li>Chọn <b>Tạo Link Từ Vùng Chọn</b></li>
      <li>Chọn: <b>Nhà Trai</b> hoặc <b>Nhà Gái</b></li>
      <li>Chọn: <b>Có Quà</b> hoặc <b>Không Quà</b></li>
      <li>Link sẽ tự điền vào cột bên cạnh! 🎉</li>
    </ol>
    <hr>
    <p>💡 <b>Mẹo:</b> Có thể chọn nhiều nhóm khách riêng (Nhà Trai, Nhà Gái) và tạo link từng nhóm.</p>
  `).setWidth(350).setHeight(280);

    SpreadsheetApp.getUi().showModalDialog(html, '🎊 Tạo Link Mời Cưới');
}
