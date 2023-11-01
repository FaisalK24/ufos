const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Connect to the SQLite database
let db = new sqlite3.Database('./ufo_sightings.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the UFO sightings database.');
});

// Create the sightings table if it does not exist
db.run(`CREATE TABLE IF NOT EXISTS sightings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location TEXT NOT NULL,
    date_of_occurrence TEXT NOT NULL,
    details TEXT NOT NULL
)`);

// Implement the API endpoints
app.get('/api/sightings', (req, res) => {
  db.all('SELECT * FROM sightings', [], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.get('/api/sightings/location/:location', (req, res) => {
  const location = req.params.location;
  db.all('SELECT * FROM sightings WHERE location = ?', [location], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

app.get('/api/sightings/date/:date', (req, res) => {
  const date = req.params.date;
  db.all('SELECT * FROM sightings WHERE date_of_occurrence = ?', [date], (err, rows) => {
    if (err) {
      throw err;
    }
    res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
