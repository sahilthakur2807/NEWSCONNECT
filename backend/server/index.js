const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const db = require('./db');
require('dotenv').config({ path: '../../.env' }); // Adjusted path to .env

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173', 'chrome-extension://*'], // Allow extension
  credentials: true
}));

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Routes
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await db.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.json({
      id: user.rows[0].id,
      username: user.rows[0].username,
      email: user.rows[0].email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.query('SELECT id, username, email FROM users WHERE id = $1', [req.user.id]);
    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Helper to extract clean titles from URLs
function cleanTitle(urlStr, userTitle) {
  if (userTitle && userTitle.trim().length > 0 && userTitle !== 'New Discussion') {
    return userTitle.trim();
  }
  try {
    const url = new URL(urlStr);
    const pathname = url.pathname;
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 0) {
      const lastPart = parts[parts.length - 1];
      const cleanPart = lastPart.replace(/\.[^/.]+$/, "");
      const words = cleanPart.replace(/[-_]+/g, ' ');
      if (words.trim().length > 3) {
        return words.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }
    const domain = url.hostname.replace('www.', '');
    return `${domain.charAt(0).toUpperCase() + domain.slice(1)} Article`;
  } catch (e) {
    return 'News Discussion';
  }
}

// Room & Message Endpoints
app.post('/api/rooms', async (req, res) => {
  try {
    const { url, title } = req.body;
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    let room = await db.query('SELECT * FROM rooms WHERE url = $1', [url]);
    
    if (room.rows.length === 0) {
      const parsedTitle = cleanTitle(url, title);
      room = await db.query(
        'INSERT INTO rooms (url, title) VALUES ($1, $2) RETURNING *',
        [url, parsedTitle]
      );
    }
    
    res.json(room.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Trending Rooms (Highest message count)
app.get('/api/rooms/trending', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, COUNT(m.id)::int as message_count,
             COALESCE(MAX(m.created_at), r.created_at) as last_active
      FROM rooms r
      LEFT JOIN messages m ON r.id = m.room_id
      GROUP BY r.id
      ORDER BY message_count DESC, last_active DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Recently Active Rooms
app.get('/api/rooms/recent', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT r.*, COUNT(m.id)::int as message_count,
             COALESCE(MAX(m.created_at), r.created_at) as last_active
      FROM rooms r
      LEFT JOIN messages m ON r.id = m.room_id
      GROUP BY r.id
      ORDER BY last_active DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Room by ID
app.get('/api/rooms/:roomId', async (req, res) => {
  try {
    const room = await db.query('SELECT * FROM rooms WHERE id = $1', [req.params.roomId]);
    if (room.rows.length === 0) {
      return res.status(404).json({ error: 'Room not found' });
    }
    res.json(room.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/rooms/:roomId/messages', async (req, res) => {
  try {
    const messages = await db.query(
      'SELECT m.*, u.username FROM messages m JOIN users u ON m.user_id = u.id WHERE m.room_id = $1 ORDER BY m.created_at ASC',
      [req.params.roomId]
    );
    res.json(messages.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/rooms/:roomId/messages', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body;
    const newMessage = await db.query(
      'INSERT INTO messages (room_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [req.params.roomId, req.user.id, content]
    );
    // Fetch user username to return a consistent object
    const user = await db.query('SELECT username FROM users WHERE id = $1', [req.user.id]);
    const responseMsg = {
      ...newMessage.rows[0],
      username: user.rows[0].username
    };
    res.json(responseMsg);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
