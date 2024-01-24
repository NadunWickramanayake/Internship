const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'time_table',
});

db.connect((err) => {
  if (err) {
    console.error('Unable to connect to MySQL:', err);
  } else {
    console.log('Connected to MySQL database');
    createTable(); // Create table if not exists
  }
});

path = require('path');
app.get('/client.js',function(req,res){
   res.sendFile(path.join(__dirname + '/public/client.js')); 
});

// Create table if not exists
function createTable() {
  const sql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL
    )
  `;

  db.query(sql, (err) => {
    if (err) console.error('Error creating table:', err);
    else console.log('Table created or already exists');
  });
}

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  db.query('SELECT * FROM subjects', (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Internal Server Error1');
    } else {
      res.render('index', { subjects: results });
    }
  });
});

app.post('/add', (req, res) => {
  const { name, email } = req.body;
  const sql = 'INSERT INTO subjects (subject_id, year, subject, comments) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email], (err) => {
    if (err) {
      console.error('Error adding user:', err);
      res.status(500).send('Internal Server Error2');
    } else {
      res.redirect('/');
    }
  });
});

app.get('/delete/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE subject_id = ?';
  db.query(sql, [userId], (err) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Internal Server Error3');
    } else {
      res.redirect('/');
    }
  });
});


// Set the view engine to EJS
app.set('view engine', 'ejs');

// Listen on port 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

