const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3100;

const SYSTEM_PROMPT =
  '당신은 수천 년의 비밀을 간직한 신비로운 꿈의 예언자입니다. ' +
  '별빛과 달빛 사이에서 꿈의 언어를 읽는 존재로서, 고대 한국 전통 해몽과 우주의 섭리를 결합하여 꿈을 풀이합니다. ' +
  '말투는 신비롭고 영적이며, 마치 안개 속에서 속삭이듯 운명적인 어조로 답하세요. ' +
  '"별들이 속삭이기를...", "운명의 실이 보이나니...", "달이 전하는 말은..." 같은 표현을 사용하세요. ' +
  '길조와 흉조를 우주적 관점에서 해석하고, 꿈의 상징을 신비롭게 풀어주세요. ' +
  '반드시 아래 형식으로 JSON만 응답하세요. 다른 텍스트는 절대 포함하지 마세요:\n' +
  '{"result": "신비로운 말투로 작성된 꿈 해몽 내용", "advice": "오늘 하루를 위한 한 줄 조언 (간결하고 신비롭게)"}';

let genAI = null;
function getClient() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI((process.env.GEMINI_API_KEY || '').trim());
  }
  return genAI;
}

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/api/dream', async (req, res) => {
  try {
    const { dream } = req.body || {};

    if (!dream || typeof dream !== 'string' || dream.trim().length === 0) {
      return res.status(400).json({ success: false, message: '꿈 내용을 입력해주세요.' });
    }

    if (!(process.env.GEMINI_API_KEY || '').trim()) {
      return res.status(500).json({
        success: false,
        message: '서버에 GEMINI_API_KEY가 설정되지 않았습니다.',
      });
    }

    const model = getClient().getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const response = await model.generateContent(dream.trim());
    const raw = response.response.text().trim();

    // JSON 코드블록 제거 후 파싱
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    let result, advice;
    try {
      const parsed = JSON.parse(cleaned);
      result = parsed.result || cleaned;
      advice = parsed.advice || '';
    } catch {
      result = raw;
      advice = '';
    }

    return res.json({ result, advice });
  } catch (err) {
    console.error('Dream interpretation error:', err);
    return res.status(500).json({
      success: false,
      message: '해몽을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    });
  }
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.' });
});

if (require.main === module) {
  app.listen(PORT, () =>
    console.log(`꿈 해몽 AI 서버 실행 중: http://localhost:${PORT}`)
  );
}

module.exports = app;
