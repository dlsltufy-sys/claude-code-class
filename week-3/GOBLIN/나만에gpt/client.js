// 페이지 로드 시 세션 생성
const sessionId = String(Date.now());

const chatEl = document.getElementById('chat');
const inputEl = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const resetBtn = document.getElementById('resetBtn');

const GREETING = '안녕하세요, 승오님 😊 오늘 어떠세요? 편하게 이야기 나눠요.';

// --- 메시지 렌더링 ---
function appendMessage(role, text) {
  const wrap = document.createElement('div');
  wrap.className = role === 'user' ? 'flex justify-end' : 'flex justify-start';

  const bubble = document.createElement('div');
  bubble.className = role === 'user'
    ? 'max-w-[75%] px-4 py-3 rounded-2xl rounded-br-md bg-[#4a90d9] text-white whitespace-pre-wrap leading-relaxed shadow-sm'
    : 'max-w-[75%] px-4 py-3 rounded-2xl rounded-bl-md bg-[#f1e6d3] text-[#4e3b2c] whitespace-pre-wrap leading-relaxed shadow-sm';
  bubble.textContent = text;

  wrap.appendChild(bubble);
  chatEl.appendChild(wrap);
  scrollToBottom();
  return wrap;
}

// --- 로딩 표시 ---
function appendLoading() {
  const wrap = document.createElement('div');
  wrap.className = 'flex justify-start';
  wrap.id = 'loading-indicator';

  const bubble = document.createElement('div');
  bubble.className = 'px-4 py-3 rounded-2xl rounded-bl-md bg-[#f1e6d3] text-[#7a6651] shadow-sm flex items-center gap-2';
  bubble.innerHTML = '<span class="text-sm">상담사가 답변 중</span><span class="typing"><span></span><span></span><span></span></span>';

  wrap.appendChild(bubble);
  chatEl.appendChild(wrap);
  scrollToBottom();
}

function removeLoading() {
  const el = document.getElementById('loading-indicator');
  if (el) el.remove();
}

function scrollToBottom() {
  chatEl.scrollTop = chatEl.scrollHeight;
}

// --- 메시지 전송 ---
async function sendMessage() {
  const message = inputEl.value.trim();
  if (!message) return;

  inputEl.value = '';
  autoResize();
  appendMessage('user', message);

  sendBtn.disabled = true;
  appendLoading();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId }),
    });
    const data = await res.json();
    removeLoading();

    if (data.success) {
      appendMessage('ai', data.reply);
    } else {
      appendMessage('ai', '죄송해요, 답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.');
    }
  } catch (err) {
    removeLoading();
    appendMessage('ai', '서버 연결에 문제가 생겼어요. 잠시 후 다시 시도해 주세요.');
  } finally {
    sendBtn.disabled = false;
    inputEl.focus();
  }
}

// --- 대화 초기화 ---
async function resetConversation() {
  try {
    await fetch(`/api/chat/${sessionId}`, { method: 'DELETE' });
  } catch (err) {
    // 서버 초기화 실패해도 화면은 초기화
  }
  chatEl.innerHTML = '';
  appendMessage('ai', GREETING);
}

// --- 입력창 자동 높이 ---
function autoResize() {
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 128) + 'px';
}

// --- 이벤트 바인딩 ---
sendBtn.addEventListener('click', sendMessage);
resetBtn.addEventListener('click', resetConversation);

inputEl.addEventListener('input', autoResize);

inputEl.addEventListener('keydown', (e) => {
  // Enter 전송, Shift+Enter 줄바꿈
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

// --- 첫 인사말 ---
appendMessage('ai', GREETING);
inputEl.focus();
