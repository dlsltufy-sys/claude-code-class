const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const GREETINGS = [
  '안녕하세요! 오늘도 좋은 하루 되세요 😊',
  '반갑습니다! 행복한 시간 보내세요 🌟',
  '어서오세요! 오늘도 화이팅이에요 💪',
  '안녕하세요! 좋은 일만 가득하길 바랍니다 🍀',
  '반가워요! 오늘 하루도 건강하세요 ☀️',
];

// GET /api/hello — 현재 시간 + 랜덤 인사 반환
app.get('/api/hello', (_req, res) => {
  const now = new Date();
  const greeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];

  res.json({
    success: true,
    data: {
      message: greeting,
      time: now.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      date: now.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
      }),
      timestamp: now.toISOString(),
    },
  });
});

app.get('/{*splat}', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
module.exports = app;
