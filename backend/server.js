require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool.connect()
  .then(() => console.log('Ansluten till PostgreSQL'))
  .catch(err => console.error('PostgreSQL-anslutningsfel', err));

// Registreringsrutt
app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Kontrollera om användaren redan finns
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash:a lösenordet
    const hashedPassword = await bcrypt.hash(password, 10);

    // Spara användaren i databasen
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );

    // Skapa spelarens "land"-data
    await pool.query(
        'INSERT INTO lands (user_id, crops, buildings, progress) VALUES ($1, $2, $3, $4)',
        [newUser.rows[0].id, '{}', '{}', 0] // Initiera med tomma värden
      );

    // Skapa och skicka tillbaka en JWT-token
    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: newUser.rows[0] });
  } catch (err) {
    console.error('Error in /register:', err); // Logga felet
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Hitta användaren i databasen
      const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      if (user.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Jämför lösenordet
      const isMatch = await bcrypt.compare(password, user.rows[0].password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Skapa och skicka tillbaka en JWT-token
      const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token, user: user.rows[0] });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/land', async (req, res) => {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      // Hämta spelarens data från databasen
      const playerData = await pool.query('SELECT * FROM lands WHERE user_id = $1', [userId]);
  
      if (playerData.rows.length === 0) {
        return res.status(404).json({ message: 'Player data not found' });
      }
  
      res.status(200).json(playerData.rows[0]);
    } catch (err) {
      console.error('Error fetching player data:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.put('/land', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const { crops, buildings, progress } = req.body;

    // Uppdatera spelarens data i databasen
    await pool.query(
      'UPDATE lands SET crops = $1, buildings = $2, progress = $3 WHERE user_id = $4',
      [crops, buildings, progress, userId]
    );

    res.status(200).json({ message: 'Player data updated successfully' });
  } catch (err) {
    console.error('Error updating player data:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
