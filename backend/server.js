const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'mySuperSecretKey';

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'inventory_management_system'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('MySQL connected...');
});

app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  const checkExistingQuery = 'SELECT * FROM Admin WHERE Email = ? OR User_name = ?';
  db.query(checkExistingQuery, [email, username], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Database check error:', checkErr);
      return res.status(500).send('Server error');
    }

    if (checkResults.length > 0) {
      return res.status(409).send('Email or username already in use');
    }

    const insertQuery = 'INSERT INTO Admin (User_name, Email, Password) VALUES (?, ?, ?)';
    db.query(insertQuery, [username, email, password], (insertErr, result) => {
      if (insertErr) {
        console.error('Database insert error:', insertErr);
        return res.status(500).send('Server error');
      }
      res.send('User registered successfully');
    });
  });
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const sql = 'SELECT * FROM Admin WHERE Email = ? AND Password = ?';
  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }

    if (results.length === 0) {
      return res.status(401).send('Invalid credentials');
    }

    const userId = results[0].Admin_id;
    const userName = results[0].User_name;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userName });
  });
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// CRUD operations for Item
app.post('/item', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { itemName, itemQuantity, itemPrice } = req.body;
  const sql = 'INSERT INTO Item (Admin_id, Item_Name, Item_Quantity, Item_Price) VALUES (?, ?, ?, ?)';
  db.query(sql, [userId, itemName, itemQuantity, itemPrice], (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Item added successfully');
  });
});

app.get('/items', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const sql = 'SELECT * FROM Item WHERE Admin_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database select error:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

app.put('/item/:id', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const { itemName, itemQuantity, itemPrice } = req.body;
  const sql = 'UPDATE Item SET Item_Name = ?, Item_Quantity = ?, Item_Price = ? WHERE Item_id = ? AND Admin_id = ?';
  db.query(sql, [itemName, itemQuantity, itemPrice, id, userId], (err, result) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Item updated successfully');
  });
});

app.delete('/item/:id', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const sql = 'DELETE FROM Item WHERE Item_id = ? AND Admin_id = ?';
  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      console.error('Database delete error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Item deleted successfully');
  });
});

// CRUD operations for Transaction
app.post('/transaction', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { itemId, seller, itemQuantity, date } = req.body;

  const checkItemQuery = 'SELECT * FROM Item WHERE Item_id = ?';
  db.query(checkItemQuery, [itemId], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Database check error:', checkErr);
      return res.status(500).send('Server error');
    }

    if (checkResults.length === 0) {
      return res.status(400).send('Invalid Item_id');
    }

    const sql = 'INSERT INTO Transaction (Admin_id, Item_id, Seller, Item_Quantity, Date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [userId, itemId, seller, itemQuantity, date], (err, result) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).send('Server error');
      }
      res.json({ message: 'Transaction added successfully', transactionId: result.insertId });
    });
  });
});

app.get('/transactions', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const sql = 'SELECT * FROM Transaction WHERE Admin_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database select error:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

app.put('/transaction/:id', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const { itemId, seller, itemQuantity, date } = req.body;
  const sql = 'UPDATE Transaction SET Item_id = ?, Seller = ?, Item_Quantity = ?, Date = ? WHERE Transaction_id = ? AND Admin_id = ?';
  db.query(sql, [itemId, seller, itemQuantity, date, id, userId], (err, result) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Transaction updated successfully');
  });
});

app.delete('/transaction/:id', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const sql = 'DELETE FROM Transaction WHERE Transaction_id = ? AND Admin_id = ?';
  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      console.error('Database delete error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Transaction deleted successfully');
  });
});



// CRUD operations for Sales
app.post('/sales', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { Item_id, Qty, Date } = req.body;
  const sql = 'INSERT INTO Sales (Admin_id, Item_id, Qty, Date) VALUES (?, ?, ?, ?)';
  db.query(sql, [userId, Item_id, Qty, Date], (err, result) => {
    if (err) {
      console.error('Database insert error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Sale added successfully');
  });
});

app.get('/sales', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const sql = 'SELECT * FROM Sales WHERE Admin_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database select error:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

app.put('/sales/:id', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const { Item_id, Qty, Date } = req.body;
  const sql = 'UPDATE Sales SET Item_id = ?, Qty = ?, Date = ? WHERE Sales_id = ? AND Admin_id = ?';
  db.query(sql, [Item_id, Qty, Date, id, userId], (err, result) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Sale updated successfully');
  });
});

app.delete('/sales/:id', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const sql = 'DELETE FROM Sales WHERE Sales_id = ? AND Admin_id = ?';
  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      console.error('Database delete error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Sale deleted successfully');
  });
});

// CRUD operations for Stock
app.post('/stocks', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { Item_id, Quantity, Last_Updated, Expiration_date } = req.body;

  const checkItemQuery = 'SELECT * FROM Item WHERE Item_id = ?';
  db.query(checkItemQuery, [Item_id], (checkErr, checkResults) => {
    if (checkErr) {
      console.error('Database check error:', checkErr);
      return res.status(500).send('Server error');
    }

    if (checkResults.length === 0) {
      return res.status(400).send('Invalid Item_id');
    }

    const sql = 'INSERT INTO Stock (Admin_id, Item_id, Quantity, Last_Updated, Expiration_date) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [userId, Item_id, Quantity, Last_Updated, Expiration_date], (err, result) => {
      if (err) {
        console.error('Database insert error:', err);
        return res.status(500).send('Server error');
      }
      res.json({ message: 'Stock added successfully', Stock_id: result.insertId });
    });
  });
});

app.get('/stocks', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const sql = 'SELECT * FROM Stock WHERE Admin_id = ?';
  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Database select error:', err);
      return res.status(500).send('Server error');
    }
    res.json(results);
  });
});

app.put('/stocks/:id', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const { Item_id, Quantity, Last_Updated, Expiration_date } = req.body;
  const sql = 'UPDATE Stock SET Item_id = ?, Quantity = ?, Last_Updated = ?, Expiration_date = ? WHERE Stock_id = ? AND Admin_id = ?';
  db.query(sql, [Item_id, Quantity, Last_Updated, Expiration_date, id, userId], (err, result) => {
    if (err) {
      console.error('Database update error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Stock updated successfully');
  });
});

app.delete('/stocks/:id', authenticateToken, (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const sql = 'DELETE FROM Stock WHERE Stock_id = ? AND Admin_id = ?';
  db.query(sql, [id, userId], (err, result) => {
    if (err) {
      console.error('Database delete error:', err);
      return res.status(500).send('Server error');
    }
    res.send('Stock deleted successfully');
  });
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
