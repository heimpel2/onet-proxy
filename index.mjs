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
    const contentType = response.headers.get("content-type") || "";

    // If it's not JSON, log the raw text and return a helpful error
    if (!contentType.includes("application/json")) {
      const text = await response.text();
      console.error("O*NET API did not return JSON:", text);
      return res.status(502).json({
        error: "Invalid response from O*NET API",
        contentType,
        bodySnippet: text.slice(0, 500) // Send first 500 chars
      });
    }

    // Parse JSON and return it
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Fetch error:", error.message);
    res.status(500).json({ error: "Proxy error", details: error.message });
  }
}); // ← this line was missing!
