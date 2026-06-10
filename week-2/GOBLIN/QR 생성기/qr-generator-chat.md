# QR 코드 생성기 제작 채팅 내용

## 1. 초기 요청

**사용자:** qr 코드 생성기 만드는데 큐알 스켄시 해당 링크가 나오거나 사진 파일이 나오도록 만들어줘

**Claude:** QR 코드 생성기를 단일 HTML 파일로 만들었습니다. (`qr-generator.html`)
- URL 모드: URL 입력 → QR 생성 → 스캔 시 해당 링크로 이동
- 이미지 모드: 이미지 업로드 → 자동 압축(80×80px) → QR 생성 → 스캔 시 이미지 표시
- 사용 라이브러리: React 18, Tailwind CSS, `qrcode@1.5.3`

---

## 2. QR 코드 생성 오류

**사용자:** qr 코드를 생성하지 못했습니다 나오는데?

**Claude:** 원인: `qrcode@1.5.3` CDN 빌드 파일이 브라우저에서 `QRCode` 전역 변수를 제대로 노출하지 않아서 오류 발생.

**수정 내용:**
- `qrcode@1.5.3` → `qrcode-generator@1.4.4` 라이브러리로 교체
- 비동기(Promise) 방식 → 동기 방식으로 변경
- 새 API: `qrcode(0, 'L')` → `qr.addData()` → `qr.make()` → `qr.createDataURL(4, 2)`

---

## 3. 이미지 파일 QR 작동 안 함

**사용자:** 인터넷 주소 링크는 qr 이 작동 하는데 이미지 파일항목은 작동을 안해

**Claude:** 원인 두 가지:
1. 압축 목표값(2466 base64자)이 너무 커서 `qrcode-generator` 한계 초과
2. `makeQrDataURL`에 에러 처리가 없어 실패해도 조용히 멈춤

**수정 내용:**

| 항목 | 이전 | 이후 |
|------|------|------|
| 캔버스 크기 | 80×80px | 40×40px |
| 압축 목표 | base64 ≤ 2466자 | 전체 URL ≤ 900자 |
| 품질 범위 | 0.3 → 0.05 (6단계) | 0.5 → 0.02 (25단계) |
| 에러 처리 | 없음 | try-catch 추가 |

---

## 4. 압축 불가 오류

**사용자:** 이미지를 충분히 압축할수 없다는데

**Claude:** 원인: JPEG 포맷은 이미지 데이터와 무관하게 헤더 오버헤드가 ~600 bytes 고정으로 붙음. 40×40 이미지라도 최소 ~800자가 나오는데 목표를 900자로 설정해서 거의 모든 이미지가 실패.

**수정 내용:** 압축 목표 900자 → 2200자로 변경

---

## 5. 이미지 기능 삭제 요청

**사용자:** 이미지파일로 큐알 만드는 기능만 삭제해줘

**Claude:** 이미지 관련 코드 전부 제거:
- `compressImageForQR` 함수 삭제
- `ImagePanel` 컴포넌트 삭제
- `Tabs` 컴포넌트 삭제
- 이미지 관련 state(`imageFile`, `imagePreview`, `compressedPreview`, `mode`) 삭제
- URL → QR 기능만 남김
- 코드 481줄 → 118줄로 축소

---

## 6. 자동 저장 창 요청

**사용자:** 큐알코드를 만들면 자동으로 만든 코드를 컴퓨터에 저장하겠냐 라고 물어보는 창이 뜨도록 해줘

**Claude:** `generate` 함수 안에서 QR 생성 직후 바로 저장 다이얼로그 자동 실행 추가.

```js
const link = document.createElement('a');
link.href = dataUrl;
link.download = `qrcode-${Date.now()}.png`;
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
```

---

## 최종 결과물

- **파일:** `qr-generator.html`
- **기능:** URL 입력 → QR 코드 생성 → 자동 저장 창 + 화면 표시 + PNG 다운로드 버튼
- **라이브러리:** React 18, Tailwind CSS, qrcode-generator@1.4.4
