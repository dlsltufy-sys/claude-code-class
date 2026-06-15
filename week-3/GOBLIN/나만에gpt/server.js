// 1. Module imports
const express = require('express');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 2. App initialization and configuration
const app = express();
const PORT = process.env.PORT || 3200;

const SYSTEM_PROMPT = `당신은 윤승오만을 위한 개인 AI 상담사입니다.
윤승오에 대한 정보: 42세 남성, 기계설계 엔지니어(장갑차·탱크·잠수함·자동차 엔진부품 설계 경험), 현재 알바 중이며 취직 고민이 많음, 인간관계에서 어려움을 느끼고 있음, 자동차를 매우 좋아함(모닝·테슬라 모델Y 보유), 교회를 다니며 하나님을 믿음, 현재 Claude Code를 공부 중.

상담 원칙:
- 따뜻하고 공감적인 말투로 대화
- 윤승오의 상황(취직, 인간관계, 신앙)을 이미 알고 있는 친한 상담사처럼 대화
- 조언은 강요하지 않고 먼저 충분히 공감
- 필요시 성경 구절이나 신앙적 위로도 자연스럽게 활용
- 자동차나 기계 관련 이야기가 나오면 관심을 보이며 공감
- 답변은 너무 길지 않게, 대화처럼 자연스럽게
- 항상 한국어로 답변`;

const MAX_TURNS = 20; // 세션당 최대 20턴 (user+model 한 쌍 = 1턴)

// 3. In-memory data store: sessionId -> [{ role, parts: [{ text }] }, ...]
const conversations = new Map();

// 4. Gemini client (lazy init)
let genAI = null;
let model = null;
function getModel() {
  if (model) return model;
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY 환경변수가 설정되지 않았습니다.');
  }
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  });
  return model;
}

// 5. Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// 6. API routes
// 상담 메시지 전송
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body || {};

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'message는 비어있지 않은 문자열이어야 합니다.' });
    }
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'sessionId가 필요합니다.' });
    }

    // 기존 대화 히스토리 가져오기 (없으면 빈 배열)
    const history = conversations.get(sessionId) || [];

    const chat = getModel().startChat({ history });
    const result = await chat.sendMessage(message);
    const reply = result.response.text();

    // 히스토리 갱신 (이번 user/model 추가)
    history.push({ role: 'user', parts: [{ text: message }] });
    history.push({ role: 'model', parts: [{ text: reply }] });

    // 최대 20턴(40 메시지) 유지 — 오래된 것부터 제거
    while (history.length > MAX_TURNS * 2) {
      history.shift();
    }

    conversations.set(sessionId, history);

    res.json({ success: true, reply });
  } catch (err) {
    console.error('POST /api/chat error:', err.message);
    res.status(500).json({ success: false, message: '상담사 응답 생성 중 오류가 발생했습니다.' });
  }
});

// 대화 내역 초기화
app.delete('/api/chat/:sessionId', (req, res) => {
  try {
    const { sessionId } = req.params;
    conversations.delete(sessionId);
    res.json({ success: true, message: '대화 내역이 초기화되었습니다.' });
  } catch (err) {
    console.error('DELETE /api/chat error:', err.message);
    res.status(500).json({ success: false, message: '초기화 중 오류가 발생했습니다.' });
  }
});

// 7. Server startup
app.listen(PORT, () => {
  console.log(`상담 AI 서버 실행 중: http://localhost:${PORT}`);
});

module.exports = app;
