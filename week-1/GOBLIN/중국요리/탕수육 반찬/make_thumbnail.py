from PIL import Image, ImageDraw, ImageFont
import math

W, H = 800, 500
img = Image.new("RGB", (W, H), "#1a1a1a")
draw = ImageDraw.Draw(img)

# 배경 그라데이션 효과 (어두운 갈색 톤)
for y in range(H):
    ratio = y / H
    r = int(30 + ratio * 20)
    g = int(15 + ratio * 10)
    b = int(5)
    for x in range(W):
        img.putpixel((x, y), (r, g, b))

draw = ImageDraw.Draw(img)

# 접시 (흰 원)
cx, cy = 520, 260
plate_r = 180
draw.ellipse([cx - plate_r, cy - plate_r, cx + plate_r, cy + plate_r], fill="#f5f0e8", outline="#e0d8cc", width=3)

# 가지 조각들 (어두운 보라색 타원)
eggplant_color = "#4a1f5c"
sauce_color = "#2c0f0f"
pieces = [
    (480, 230, 100, 38, -20),
    (540, 270, 95, 36, 15),
    (490, 300, 90, 35, -10),
    (560, 230, 85, 32, 30),
    (510, 255, 88, 34, 5),
    (555, 295, 80, 30, -25),
]
for (px, py, rw, rh, angle) in pieces:
    tmp = Image.new("RGBA", (rw * 2 + 10, rh * 2 + 10), (0, 0, 0, 0))
    td = ImageDraw.Draw(tmp)
    td.ellipse([5, 5, rw * 2 + 5, rh * 2 + 5], fill=eggplant_color)
    rotated = tmp.rotate(angle, expand=True)
    img.paste(rotated, (px - rotated.width // 2, py - rotated.height // 2), rotated)

# 소스 광택 효과
for (px, py, rw, rh, angle) in pieces:
    highlight = Image.new("RGBA", (rw, rh // 2), (0, 0, 0, 0))
    hd = ImageDraw.Draw(highlight)
    hd.ellipse([0, 0, rw - 1, rh // 2 - 1], fill=(180, 120, 160, 80))
    img.paste(highlight, (px - rw // 2, py - rh // 3), highlight)

# 대파 (초록색 줄기)
for i, (sx, sy, ex, ey) in enumerate([
    (460, 215, 510, 225),
    (530, 260, 575, 255),
    (495, 295, 540, 305),
    (555, 215, 590, 228),
]):
    draw.line([(sx, sy), (ex, ey)], fill="#5a8a3a", width=3)
    draw.line([(sx + 2, sy - 2), (ex + 2, ey - 2)], fill="#7ab05a", width=2)

# 통깨 (작은 원들)
import random
random.seed(42)
for _ in range(30):
    gx = random.randint(cx - 150, cx + 150)
    gy = random.randint(cy - 150, cy + 150)
    dist = math.sqrt((gx - cx) ** 2 + (gy - cy) ** 2)
    if dist < 165:
        draw.ellipse([gx - 2, gy - 2, gx + 2, gy + 2], fill="#d4c070")

# 폰트 로드
font_path = "/System/Library/Fonts/AppleSDGothicNeo.ttc"
try:
    font_title = ImageFont.truetype(font_path, 52, index=0)
    font_sub   = ImageFont.truetype(font_path, 26, index=0)
    font_small = ImageFont.truetype(font_path, 20, index=0)
except:
    font_title = ImageFont.load_default()
    font_sub   = font_title
    font_small = font_title

# 왼쪽 텍스트 영역
draw.text((60, 130), "가지", font=font_title, fill="#e8d4a0")
draw.text((60, 195), "간장조림", font=font_title, fill="#f5e6c0")

# 구분선
draw.rectangle([60, 265, 300, 268], fill="#8b5e2a")

draw.text((60, 285), "중국 가정식 스타일", font=font_sub, fill="#c4a06a")
draw.text((60, 320), "탕수육 베스트 반찬", font=font_small, fill="#a08050")

# 재료 태그들
tags = [("가지", "#6b3080"), ("간장", "#8b3a1a"), ("굴소스", "#4a6b2a")]
tx = 60
for label, color in tags:
    tw = len(label) * 16 + 20
    draw.rounded_rectangle([tx, 370, tx + tw, 400], radius=12, fill=color)
    draw.text((tx + 10, 375), label, font=font_small, fill="white")
    tx += tw + 10

# 하단 바
draw.rectangle([0, 460, W, H], fill="#2a1505")
draw.text((W // 2 - 80, 470), "Recipe Book", font=font_small, fill="#8a6030")

out = "/Users/seongoyoon/Desktop/claude code/1일차/1일차 혼자/탕수육 반찬/thumbnail.png"
img.save(out, "PNG")
print(f"저장 완료: {out}")
