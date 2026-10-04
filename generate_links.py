#!/usr/bin/env python3
"""
Script tạo link mời khách từ file Excel
Cách dùng: python generate_links.py danh_sach_khach.xlsx
"""

import sys
import json
import base64
import pandas as pd
from urllib.parse import quote

# URL gốc của website
BASE_URL = "https://manhvahuyen.com"

def encode_guest(name, side, show_gift=True):
    """Mã hóa thông tin khách thành code URL-safe Base64"""
    data = json.dumps({"n": name, "s": side, "g": show_gift}, ensure_ascii=False)
    encoded = base64.b64encode(data.encode('utf-8')).decode('utf-8')
    # URL-safe Base64
    return encoded.replace('+', '-').replace('/', '_').rstrip('=')

def generate_link(code):
    """Tạo link mời từ code"""
    return f"{BASE_URL}/?g={code}"

def main():
    if len(sys.argv) < 2:
        print("Cách dùng: python generate_links.py <file_excel.xlsx>")
        print("\nFile Excel cần có các cột:")
        print("  - Cột 'Tên' hoặc 'Name': Tên khách mời")
        print("  - Cột 'Bên' hoặc 'Side': 'nha-trai' hoặc 'nha-gai'")
        print("  - Cột 'Quà' hoặc 'Gift' (tùy chọn): 'có' hoặc 'không'")
        sys.exit(1)

    excel_file = sys.argv[1]
    
    try:
        df = pd.read_excel(excel_file)
    except FileNotFoundError:
        print(f"❌ Không tìm thấy file: {excel_file}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Lỗi đọc file: {e}")
        sys.exit(1)

    # Tìm cột tên
    name_col = None
    for col in ['Tên', 'Ten', 'Name', 'name', 'Họ và Tên', 'Ho va Ten']:
        if col in df.columns:
            name_col = col
            break
    
    if name_col is None:
        print("❌ Không tìm thấy cột 'Tên' hoặc 'Name' trong file Excel")
        sys.exit(1)

    # Tìm cột bên (side)
    side_col = None
    for col in ['Bên', 'Ben', 'Side', 'side']:
        if col in df.columns:
            side_col = col
            break

    # Tìm cột quà (gift)
    gift_col = None
    for col in ['Quà', 'Qua', 'Gift', 'gift', 'Hộp quà', 'Hop qua']:
        if col in df.columns:
            gift_col = col
            break

    # Danh sách kết quả
    results = []
    
    print(f"\n📋 Đang xử lý {len(df)} khách mời...\n")
    
    for idx, row in df.iterrows():
        name = str(row[name_col]).strip()
        
        if pd.isna(row[name_col]) or name == '' or name == 'nan':
            continue
        
        # Xác định side
        if side_col and not pd.isna(row[side_col]):
            side_value = str(row[side_col]).lower().strip()
            if 'gái' in side_value or 'gai' in side_value or 'bride' in side_value:
                side = 'nha-gai'
            else:
                side = 'nha-trai'
        else:
            side = 'nha-trai'  # Mặc định
        
        # Xác định show_gift
        show_gift = True
        if gift_col and not pd.isna(row[gift_col]):
            gift_value = str(row[gift_col]).lower().strip()
            if 'không' in gift_value or 'khong' in gift_value or 'no' in gift_value or gift_value == '0':
                show_gift = False
        
        # Tạo link
        code = encode_guest(name, side, show_gift)
        link = generate_link(code)
        
        results.append({
            'Tên': name,
            'Bên': '🤵 Nhà Trai' if side == 'nha-trai' else '👰 Nhà Gái',
            'Quà': '🎁 Có' if show_gift else '❌ Không',
            'Link': link
        })

    # Tạo DataFrame kết quả
    result_df = pd.DataFrame(results)
    
    # Xuất ra file CSV (chỉ cột Link để dễ copy-paste)
    import os
    base_name = os.path.splitext(excel_file)[0]
    output_file = f"{base_name}_links.csv"
    
    # Chỉ xuất cột Link
    result_df[['Link']].to_csv(output_file, index=False, header=False, encoding='utf-8-sig')
    
    print(f"✅ Đã tạo {len(results)} link mời!")
    print(f"📁 File kết quả: {output_file}")
    print(f"\n💡 Mở file và copy tất cả link vào cột Link trong Google Sheet của bạn!")
    
    # In ra console nếu ít khách
    if len(results) <= 20:
        print("\n" + "="*60)
        for r in results:
            print(f"\n👤 {r['Tên']} ({r['Bên']}, {r['Quà']})")
            print(f"   🔗 {r['Link']}")
        print("\n" + "="*60)

if __name__ == "__main__":
    main()
