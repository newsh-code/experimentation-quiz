const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Serve static files from the React app
  server.use(express.static(path.join(__dirname, 'dist')));

  // Handle API routes
  server.post('/api/generate-pdf', async (req, res) => {
    try {
      const result = await handle(req, res);
      return result;
    } catch (error) {
      console.error('Error handling PDF generation:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Handle all other requests with Next.js
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
}); 