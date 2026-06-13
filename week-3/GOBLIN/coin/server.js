const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CoinGecko market data endpoint
const COIN_IDS = ['bitcoin', 'ethereum', 'solana', 'ripple', 'dogecoin', 'api3'];
const COINGECKO_URL =
  `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${COIN_IDS.join(',')}` +
  '&order=market_cap_desc&sparkline=false';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API: fetch coin market data server-side (avoids client-side CORS)
app.get('/api/coins', async (_req, res) => {
  try {
    const response = await fetch(COINGECKO_URL);
    if (!response.ok) {
      return res
        .status(502)
        .json({ success: false, message: `CoinGecko API error: ${response.status}` });
    }
    const data = await response.json();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Local: start server / Vercel: export app
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
module.exports = app;
