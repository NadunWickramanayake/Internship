const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const app = express();
const port = 3000;

// Parse the requests of content-type 'application/json'
app.use(bodyParser.json());

// Create the MySQL connection pool
const pool = mysql.createPool ({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'my_database'
});

// Start a server
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
 //-----------------------------------
 //-----------------------------------
app.post('/users', (req, res) => {
    const { name, emailaddress } = req.body;

    pool.query('INSERT INTO users (name, emailaddress) VALUES (?, ?)', [name, emailaddress], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error creating user');
        } else {
            res.status(200).send('User is created successfully');
        }
    });
});

//-----------------------------------
//-----------------------------------

// Retrieve all users
app.get('/users', (req, res) => {
    pool.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error retrieving users');
        } else {
            res.status(200).json(results);
        }
    });
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, emailaddress } = req.body;

    pool.query('UPDATE users SET name = ?, emailaddress = ? WHERE id = ?', [name, emailaddress, id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error updating user');
    } else {
        res.status(200).send('User updated successfully');
    }
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;

    pool.query('DELETE FROM users WHERE id = ?', [id], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).send('Error deleting user');
    } else {
        res.status(200).send('User deleted successfully');
    }
    });
});
