# 채팅 기록 — 짤 생성기 제작 과정

---

## 대화 1 — 짤 생성기 초기 제작

---

**User**

```
최신 유행 짤 생성기 만드는데 Canvas로 다운로드 가능하게 만들어줘
```

---

**Assistant**

파일이 생성됐습니다. `/Users/seongoyoon/Desktop/claude code/2일차/숙제/짤 생성기/meme_generator.html`

**구현된 내용**

**8가지 짤 템플릿**

| # | 템플릿 | 설명 |
|---|---|---|
| 1 | 나는 OO인데 OO해도 돼? | 컬러 배경 + 굵은 텍스트 |
| 2 | OO 드가자~ | 대각선 노란 배너 + 만화체 |
| 3 | 이게 맞나? | 이모지 3칸 박스 비교 |
| 4 | OO할 때 vs OO할 때 | 좌우 분할 VS 레이아웃 |
| 5 | 참을 수 없는 OO | Drake 승인/거부 2행 |
| 6 | 당신은 OO형 | MBTI 파스텔 카드 |
| 7 | OO 월급 탈출 | 영수증 스타일 (이름:금액 자동 합산) |
| 8 | 자유 텍스트 짤 | 상/하단 임팩트체 텍스트 |

**Canvas 기능**
- 템플릿 변경 / 텍스트 입력마다 실시간 미리보기 재렌더링
- `canvas.toBlob()` → PNG 파일 다운로드
- 한글 자동 줄바꿈, Noto Sans KR 폰트 로드 후 렌더링
- 배경색·텍스트 색·폰트 크기 커스터마이징

---

## 대화 2 — 텍스트 애니메이션 추가

---

**User**

```
자바스크립트 이용해서 움직이도록 만들 수 있어?
```

---

**Assistant**

Canvas + JavaScript로 충분히 가능합니다. `requestAnimationFrame`으로 프레임마다 다시 그리면 텍스트 흔들기, 이모지 튀어오르기, 배경 색상 전환 같은 애니메이션을 넣을 수 있고, `canvas.captureStream()` + MediaRecorder를 쓰면 WebM 영상으로 다운로드도 됩니다.

어떤 방향을 원하시나요?

*→ 사용자가 "텍스트 애니메이션" 선택*

---

**User**

```
텍스트 애니메이션 (선택)
```

---

**Assistant**

구조를 확인했습니다. `requestAnimationFrame` 기반 애니메이션 루프를 추가하겠습니다. 9가지 애니메이션 (흔들기, 바운스, 웨이브, 타이핑, 글리치, 무지개 등)을 구현합니다.

완료됐습니다. 추가된 9가지 애니메이션:

| 애니메이션 | 구현 방식 |
|---|---|
| 📳 흔들기 | `ctx.translate` — sin/cos 노이즈로 떨림 |
| ⬆️ 바운스 | `ctx.translate` — `Math.abs(sin)` 으로 통통 |
| 🌀 흔들흔들 | `ctx.rotate` — 중심 기준 좌우 진자 운동 |
| 🔍 줌인아웃 | `ctx.scale` — sin파로 숨쉬듯 확대/축소 |
| 🌊 웨이브 | `drawWrapped` 안에서 글자마다 y-offset sin 적용 |
| ⌨️ 타이핑 | `drawWrapped` 안에서 글자 수를 시간에 따라 제한 + `▌` 커서 |
| ⚡ 글리치 | `getImageData/putImageData` 로 랜덤 스캔라인 시프트 + 색상 오버레이 |
| 🌈 무지개 | `hsl(hue, 90%, 55%)` hue를 시간에 따라 순환 |

**구조:** `requestAnimationFrame` 루프가 `animType !== 'none'` 일 때만 실행되며, inputs/style은 ref로 읽어 루프가 불필요하게 재시작되지 않습니다. 다운로드는 현재 프레임을 PNG로 캡처합니다.

---

## 대화 3 — 채팅 기록 .md 파일 생성 요청

---

**User**

```
짤 생성기도 만드는과정 채팅기록 만들어줘
```

---

**Assistant**

현재 파일(chat_log_meme.md) 생성 중.
