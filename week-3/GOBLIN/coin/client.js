const COIN_IDS = ['bitcoin', 'ethereum', 'solana', 'ripple', 'dogecoin', 'api3'];

function formatPrice(price) {
  if (price >= 1000) return '$' + price.toLocaleString('en-US', { maximumFractionDigits: 0 });
  if (price >= 1) return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return '$' + price.toFixed(6);
}

function renderSkeletons() {
  const container = document.getElementById('coins');
  container.innerHTML = COIN_IDS.map(() => `
    <div class="card">
      <div class="skeleton" style="width:48px;height:48px;border-radius:50%;flex-shrink:0"></div>
      <div class="info">
        <div class="skeleton" style="width:80px;margin-bottom:6px"></div>
        <div class="skeleton" style="width:50px;height:14px;margin-bottom:8px"></div>
        <div class="skeleton" style="width:100px;height:22px;margin-bottom:4px"></div>
        <div class="skeleton" style="width:70px;height:14px"></div>
      </div>
    </div>
  `).join('');
}

async function fetchPrices() {
  const btn = document.getElementById('refreshBtn');
  btn.disabled = true;
  btn.textContent = '로딩 중...';

  try {
    const res = await fetch('/api/coins');
    if (!res.ok) throw new Error('API 오류');
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'API 오류');
    renderCards(json.data);
    document.getElementById('updated').textContent = '마지막 업데이트: ' + new Date().toLocaleTimeString('ko-KR');
  } catch (e) {
    document.getElementById('coins').innerHTML = `<p style="text-align:center;color:#f6465d;grid-column:1/-1">데이터를 불러오지 못했습니다.<br>${e.message}</p>`;
  } finally {
    btn.disabled = false;
    btn.textContent = '새로고침';
  }
}

function renderCards(coins) {
  const container = document.getElementById('coins');
  container.innerHTML = coins.map(coin => {
    const change = coin.price_change_percentage_24h;
    const isUp = change >= 0;
    return `
      <div class="card">
        <img src="${coin.image}" alt="${coin.name}" />
        <div class="info">
          <div class="coin-name">${coin.name}</div>
          <div class="coin-symbol">${coin.symbol}</div>
          <div class="price">${formatPrice(coin.current_price)}</div>
          <div class="change ${isUp ? 'up' : 'down'}">
            ${isUp ? '▲' : '▼'} ${Math.abs(change).toFixed(2)}% (24h)
          </div>
        </div>
      </div>
    `;
  }).join('');
}

document.getElementById('refreshBtn').addEventListener('click', fetchPrices);

renderSkeletons();
fetchPrices();
setInterval(fetchPrices, 30000);
