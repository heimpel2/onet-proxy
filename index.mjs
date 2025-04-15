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
  const { keyword, start = 0, end = 5 } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Missing keyword' });
  }

  const apiKey = 'IWqQN-rvOo8-UbGqk-5wpOM'; // hardcoded O*NET username
  const url = `https://services.onetcenter.org/ws/online/search?keyword=${encodeURIComponent(keyword)}&start=${start}&end=${end}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${apiKey}:`).toString('base64')
      }
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('O*NET API did not return JSON:', text);
      return res.status(502).json({
        error: 'Invalid response from O*NET API',
        contentType,
        bodySnippet: text.slice(0, 500)
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Fetch error:', error.message);
    res.status(500).json({ error: 'Proxy error', details: error.message });
  }
});

// Start server
app.listen(port, () => {
  console.log(`O*NET proxy running on port ${port}`);
});
