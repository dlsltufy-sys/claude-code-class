# 자장면 레시피 작업 기록

## 1단계: 에이전트 호출

`quick-recipe-creator` 에이전트를 호출하여 자장면 레시피 생성 요청.

**에이전트 작업 결과:**
- `recipes/jajangmyeon.md` 생성 완료
- 썸네일 생성 실패 — `GEMINI_API_KEY` 환경변수 없음

```
⚠️  GEMINI_API_KEY 환경변수가 없습니다.
레시피 .md는 이미 만들어졌습니다.
```

---

## 2단계: 썸네일 재시도 (Gemini API)

```bash
GEMINI_PROMPT="A delicious bowl of jajangmyeon Korean black bean noodles topped with diced pork and julienned cucumber, dark glossy sauce, top-down food photography, warm natural lighting, rustic wooden table, appetizing and vibrant, square 1:1 composition" \
GEMINI_OUTPUT="recipes/thumbnails/jajangmyeon.png" \
python3 - <<'PY'
...
PY
```

**결과:** 실패

```
⚠️  GEMINI_API_KEY 환경변수가 없습니다.
```

---

## 3단계: 무료 대체 — Pollinations.ai

API 키 없이 사용 가능한 Pollinations.ai로 전환.

```python
import urllib.request, urllib.parse, os

prompt = "A delicious bowl of jajangmyeon Korean black bean noodles topped with diced pork and julienned cucumber, dark glossy sauce, top-down food photography, warm natural lighting, rustic wooden table, appetizing and vibrant, square 1:1 composition"
encoded = urllib.parse.quote(prompt)
url = f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true"

out = "recipes/thumbnails/jajangmyeon.png"
os.makedirs(os.path.dirname(out), exist_ok=True)

print("이미지 생성 중... (30초~1분 소요)")
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req, timeout=120) as r:
    with open(out, "wb") as f:
        f.write(r.read())

size = os.path.getsize(out)
print(f"✅ 썸네일 저장 완료: {out} ({size:,} bytes)")
```

**결과:** 성공

```
이미지 생성 중...
✅ 썸네일 저장 완료: recipes/thumbnails/jajangmyeon.png (70,736 bytes)
```

---

## 4단계: 썸네일 수정 요청

> "면발 굵기 얇게 바꾸고 오이 빼서 다시해줘"

프롬프트 수정:
- `thin noodles` 추가
- `julienned cucumber` 제거 → `no cucumber` 명시

```python
prompt = "A delicious bowl of jajangmyeon Korean black bean noodles with thin noodles topped with diced pork, dark glossy black bean sauce, no cucumber, top-down food photography, warm natural lighting, rustic wooden table, appetizing and vibrant, square 1:1 composition"
```

**결과:** 성공

```
이미지 생성 중...
✅ 완료: recipes/thumbnails/jajangmyeon.png (71,417 bytes)
```

---

## 최종 산출물

| 파일 | 경로 |
|------|------|
| 레시피 마크다운 | `recipes/jajangmyeon.md` |
| 썸네일 이미지 | `recipes/thumbnails/jajangmyeon.png` |
