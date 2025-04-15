import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// API Route
app.get('/search', async (req, res) => {
  const { keyword, start = 0, end = 5, api_key } = req.query;

  if (!keyword || !api_key) {
    return res.status(400).json({ error: 'Missing keyword or api_key' });
  }

  const url = `https://services.onetcenter.org/ws/online/search?keyword=${encodeURIComponent(keyword)}&start=${start}&end=${end}&api_key=${api_key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`O*NET proxy running on port ${port}`);
});
