const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    }
    else {
        console.log('Connected to SQLite databse.');
    }
});

// Define routes and other middlewere here

app.get('/', (req, res) => {
    res.send('hello');
});

// Example of a route to fetch data from the SQLite database
// Create your own table
db.serialize(() => {
    db.run(`CREATE TABLE company (
      id INTEGER PRIMARY KEY,
      name TEXT,
      age INTEGER
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Created company successfully.');
      }
    });
  });

  // Define the data to insert
const newData = {
    name: 'hehe',
    age: 19
};
  
  // Construct and execute the SQL query
  const sql = `INSERT INTO company (name, age) VALUES (?, ?)`;
  db.run(sql, [newData.name, newData.age], function(err) {
    if (err) {
      console.error('Error inserting data:', err.message);
      return;
    }
    console.log(`A new row has been inserted with rowid ${this.lastID}`);
  });

app.get('/data', (req, res) => {
    db.all('SELECT * FROM company', (err, rows) => {
      if (err) {
        console.error('Error executing query:', err.message);
        res.status(500).send('Internal Server Error');
      } else {
        res.json(rows);
      }
    });
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});