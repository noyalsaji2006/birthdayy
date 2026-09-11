import http from 'http';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT, 10) || 9000;
const ROOT_DIR = __dirname;
const DELETED_FILE_PATH = path.join(ROOT_DIR, 'deleted_wishes.json');
const GIFTS_FILE_PATH = path.join(ROOT_DIR, 'gift_options.json');

const SUPABASE_URL = 'https://glngacqixzgjnivlkptk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsbmdhY3FpeHpnam5pdmxrcHRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkwNTU3MDQsImV4cCI6MjEwNDYzMTcwNH0.mEsjNv2A1ROKw_6Ry8hHBe0IFr426MQWIjUYp8WnhP8';

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'text/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal && !net.address.startsWith('169.254')) {
        addresses.push({ name, address: net.address });
      }
    }
  }
  return addresses;
}

// Persistent Deleted Wish IDs Helpers
function getDeletedIds() {
  try {
    if (fs.existsSync(DELETED_FILE_PATH)) {
      const content = fs.readFileSync(DELETED_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content || '[]');
      return new Set(Array.isArray(parsed) ? parsed.map(Number) : []);
    }
  } catch (e) {
    console.error('Error reading deleted_wishes.json:', e);
  }
  return new Set();
}

function addDeletedIds(idsToAdd) {
  const current = getDeletedIds();
  idsToAdd.forEach(id => {
    if (id !== undefined && id !== null) current.add(Number(id));
  });
  try {
    fs.writeFileSync(DELETED_FILE_PATH, JSON.stringify(Array.from(current), null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing deleted_wishes.json:', e);
  }
}

function getDefaultGifts() {
  return [
    { id: 'teddy', label: 'Teddy', emoji: '🧸' },
    { id: 'ferrero', label: 'Ferrero Rocher', emoji: '🍫' },
    { id: 'bubble_tea', label: 'Bubble Tea', emoji: '🧋' },
    { id: 'ice_cream', label: 'Ice Cream', emoji: '🍨' },
    { id: 'perfume', label: 'Luxury Perfume', emoji: '🌸' },
    { id: 'watch', label: 'Elegant Watch', emoji: '⌚' },
    { id: 'handbag', label: 'Designer Handbag', emoji: '👜' }
  ];
}

function getGiftOptions() {
  try {
    if (fs.existsSync(GIFTS_FILE_PATH)) {
      const content = fs.readFileSync(GIFTS_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(content || '[]');
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading gift_options.json:', e);
  }
  const defaults = getDefaultGifts();
  saveGiftOptions(defaults);
  return defaults;
}

function saveGiftOptions(gifts) {
  try {
    fs.writeFileSync(GIFTS_FILE_PATH, JSON.stringify(gifts, null, 2), 'utf-8');
    // Also sync to birthday-main if directory exists
    const backupPath = path.join(ROOT_DIR, 'birthday-main', 'gift_options.json');
    if (fs.existsSync(path.dirname(backupPath))) {
      fs.writeFileSync(backupPath, JSON.stringify(gifts, null, 2), 'utf-8');
    }
  } catch (e) {
    console.error('Error writing gift_options.json:', e);
  }
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let reqPath = decodeURIComponent(parsedUrl.pathname);

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, apikey, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ==========================================
  // API FOR DYNAMIC GIFT OPTIONS
  // ==========================================
  if (reqPath === '/api/gifts') {
    try {
      // 1. GET: List all gift options
      if (req.method === 'GET') {
        const gifts = getGiftOptions();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(gifts));
        return;
      }

      // 2. POST: Add new gift option
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const newGift = JSON.parse(body || '{}');
            if (!newGift.label || !newGift.label.trim()) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Gift label is required' }));
              return;
            }

            const currentGifts = getGiftOptions();
            const emoji = (newGift.emoji || '🎁').trim();
            const label = newGift.label.trim();
            const id = newGift.id || label.toLowerCase().replace(/[^a-z0-9]+/g, '_') + '_' + Date.now().toString().slice(-4);

            // Avoid duplicate label
            const existingIndex = currentGifts.findIndex(g => g.label.toLowerCase() === label.toLowerCase());
            if (existingIndex >= 0) {
              currentGifts[existingIndex] = { id: currentGifts[existingIndex].id, label, emoji };
            } else {
              currentGifts.push({ id, label, emoji });
            }

            saveGiftOptions(currentGifts);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, gift: { id, label, emoji }, gifts: currentGifts }));
          } catch (postErr) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: postErr.message }));
          }
        });
        return;
      }

      // 3. DELETE: Delete a gift option
      if (req.method === 'DELETE') {
        const id = parsedUrl.searchParams.get('id');
        const label = parsedUrl.searchParams.get('label');

        if (!id && !label) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing id or label parameter' }));
          return;
        }

        let currentGifts = getGiftOptions();
        const initialCount = currentGifts.length;

        if (id) {
          currentGifts = currentGifts.filter(g => g.id !== id);
        } else if (label) {
          currentGifts = currentGifts.filter(g => g.label.toLowerCase() !== label.toLowerCase());
        }

        saveGiftOptions(currentGifts);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, deletedCount: initialCount - currentGifts.length, gifts: currentGifts }));
        return;
      }

      // 4. PUT: Replace/reset all gift options
      if (req.method === 'PUT') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
          try {
            const data = JSON.parse(body || '{}');
            if (data.reset) {
              const defaults = getDefaultGifts();
              saveGiftOptions(defaults);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, gifts: defaults }));
              return;
            }

            if (Array.isArray(data.gifts)) {
              saveGiftOptions(data.gifts);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success: true, gifts: data.gifts }));
              return;
            }

            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid payload' }));
          } catch (putErr) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: putErr.message }));
          }
        });
        return;
      }
    } catch (giftApiErr) {
      console.error('Gift API Error:', giftApiErr);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: giftApiErr.message }));
      return;
    }
  }

  // ==========================================
  // API PROXY FOR SUPABASE WISHES & DELETIONS
  // ==========================================
  if (reqPath === '/api/wishes') {
    try {
      // 1. GET: List all wishes (filtering out deleted ones)
      if (req.method === 'GET') {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/birthday_wishes?select=*&order=created_at.desc`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
          }
        });
        const data = await response.json();
        const deletedSet = getDeletedIds();

        const filtered = Array.isArray(data) ? data.filter(item => !deletedSet.has(Number(item.id))) : [];
        res.writeHead(response.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(filtered));
        return;
      }

      // 2. DELETE: Delete single or multiple wishes permanently
      if (req.method === 'DELETE') {
        const id = parsedUrl.searchParams.get('id');
        const ids = parsedUrl.searchParams.get('ids');

        const idsToDelete = [];
        if (id) {
          idsToDelete.push(Number(id));
        } else if (ids) {
          ids.split(',').forEach(i => idsToDelete.push(Number(i.trim())));
        }

        if (idsToDelete.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing id or ids parameter' }));
          return;
        }

        // Persist to blacklist
        addDeletedIds(idsToDelete);

        // Also attempt deletion on Supabase cloud
        try {
          const filter = idsToDelete.length === 1 ? `id=eq.${idsToDelete[0]}` : `id=in.(${idsToDelete.join(',')})`;
          await fetch(`${SUPABASE_URL}/rest/v1/birthday_wishes?${filter}`, {
            method: 'DELETE',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          });
        } catch (supErr) {
          console.warn('Supabase cloud delete attempt note:', supErr.message);
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, deleted: idsToDelete }));
        return;
      }

      // 3. POST: Insert new wish
      if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const parsedBody = JSON.parse(body || '{}');
            const response = await fetch(`${SUPABASE_URL}/rest/v1/birthday_wishes`, {
              method: 'POST',
              headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
              },
              body: JSON.stringify(parsedBody)
            });
            const data = await response.json();
            res.writeHead(response.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data));
          } catch (postErr) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: postErr.message }));
          }
        });
        return;
      }
    } catch (apiErr) {
      console.error('API Proxy Error:', apiErr);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: apiErr.message }));
      return;
    }
  }

  // ==========================================
  // STATIC FILE SERVING
  // ==========================================
  if (reqPath === '/' || reqPath === '') {
    reqPath = '/index.html';
  }

  const safePath = path.normalize(reqPath).replace(/^(\.\.[/\\])+/, '');
  let filePath = path.join(ROOT_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('404 Not Found');
      return;
    }

    if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('500 Internal Server Error');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': Buffer.byteLength(data),
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIpAddresses();
  console.log(`\n🎉 Birthday Website running on Network!`);
  console.log(`➡️  Local: http://localhost:${PORT}`);
  ips.forEach(ip => {
    console.log(`➡️  Network (${ip.name}): http://${ip.address}:${PORT}`);
  });
  console.log(`\n📱 Open the Network URL on your phone/tablet connected to the same Wi-Fi.\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const nextPort = PORT + 1;
    console.log(`Port ${PORT} in use, trying port ${nextPort}...`);
    server.listen(nextPort, '0.0.0.0');
  } else {
    console.error('Server error:', err);
  }
});
