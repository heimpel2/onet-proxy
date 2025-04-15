import express from 'express';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;
const API_KEY = 'IWqQN-rvOo8-UbGqk-5wpOM';

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// API Route
app.get('/search', async (req, res) => {
  const { keyword, start = 0, end = 5 } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Missing keyword' });
  }

  const url = `https://api-v2.onetcenter.org/search?keyword=${encodeURIComponent(keyword)}&start=${start}&end=${end}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-API-Key': API_KEY,
        'Accept': 'application/json'
      }
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      return res.status(502).json({
        error: 'Invalid response from O*NET API',
        contentType,
        bodySnippet: text.slice(0, 500)
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`✅ O*NET proxy running on port ${port}`);
});
