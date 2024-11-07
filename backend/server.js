const express = require('express');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// PostgreSQL-anslutning
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

app.get('/', (req, res) => {
  res.send('Backend fungerar!');
});

app.listen(port, () => {
  console.log(`Servern körs på port ${port}`);
});
