const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

// In-memory storage for demo purposes only
let users = [];

app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = { username: req.body.username, password: hashedPassword };
    users.push(user);
    res.status(201).send({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).send({ message: 'Error registering user' });
  }
});

app.post('/login', async (req, res) => {
  const user = users.find(u => u.username === req.body.username);
  if (!user) return res.status(401).send({ message: 'Invalid username or password' });

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) return res.status(401).send({ message: 'Invalid username or password' });

  const token = jwt.sign({ username: user.username }, 'secretkey', { expiresIn: '1h' });
  res.send({ token });
});

app.get('/protected', authenticateToken, (req, res) => {
  res.send({ message: 'Hello, ' + req.user.username });
});

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, 'secretkey');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ message: 'Invalid token' });
  }
}

app.get('/users', (req, res) => {
  res.json(users);
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));