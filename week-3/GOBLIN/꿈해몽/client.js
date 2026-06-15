(function () {
  'use strict';

  function createStars() {
    const container = document.getElementById('stars');
    if (!container) return;
    let html = '';
    for (let i = 0; i < 120; i++) {
      const size = Math.random() * 2.5 + 0.5;
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 6;
      const dur = Math.random() * 4 + 2;
      html += `<span class="star" style="width:${size}px;height:${size}px;top:${top}%;left:${left}%;animation-duration:${dur}s;animation-delay:${delay}s;"></span>`;
    }
    // 유성 3개
    for (let i = 0; i < 3; i++) {
      const top = Math.random() * 40;
      const left = Math.random() * 60;
      const delay = Math.random() * 8;
      html += `<span class="shooting-star" style="top:${top}%;left:${left}%;animation-delay:${delay}s;animation-duration:${2 + Math.random() * 2}s;"></span>`;
    }
    container.innerHTML = html;
  }

  const input      = document.getElementById('dream-input');
  const btn        = document.getElementById('interpret-btn');
  const loading    = document.getElementById('loading');
  const resultBox  = document.getElementById('result-box');
  const resultText = document.getElementById('result-text');
  const adviceBox  = document.getElementById('advice-box');
  const adviceText = document.getElementById('advice-text');
  const errorMsg   = document.getElementById('error-msg');

  function showError(msg) {
    errorMsg.textContent = msg;
    errorMsg.classList.remove('hidden');
  }

  function clearError() {
    errorMsg.textContent = '';
    errorMsg.classList.add('hidden');
  }

  function setLoading(on) {
    btn.disabled = on;
    if (on) {
      loading.classList.remove('hidden');
      resultBox.classList.add('hidden');
      adviceBox.classList.add('hidden');
    } else {
      loading.classList.add('hidden');
    }
  }

  async function interpretDream() {
    const dream = (input.value || '').trim();
    clearError();

    if (!dream) {
      showError('∙ 꿈의 내용을 새겨주소서 ∙');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/dream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dream }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showError(data.message || '∙ 운명의 실이 끊겼습니다. 다시 시도하소서 ∙');
        return;
      }

      resultText.textContent = data.result || '해몽 결과를 받지 못했습니다.';
      resultBox.classList.remove('hidden');

      if (data.advice) {
        adviceText.textContent = data.advice;
        adviceBox.classList.remove('hidden');
      }
    } catch {
      showError('∙ 별빛이 닿지 않습니다. 잠시 후 다시 시도하소서 ∙');
    } finally {
      setLoading(false);
    }
  }

  btn.addEventListener('click', interpretDream);
  input.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') interpretDream();
  });

  createStars();
})();
