const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.static('public'));

// --- Connect to MongoDB ---
mongoose.connect('mongodb://127.0.0.1:27017/tasksdb')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Define a Task Schema ---
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  userId: { type: String, required: true }, // Link tasks to users
  createdAt: { type: Date, default: Date.now }
});

// --- Define a User Schema ---
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In production, hash this!
  createdAt: { type: Date, default: Date.now }
});

// --- Create Models ---
const Task = mongoose.model('Task', taskSchema);
const User = mongoose.model('User', userSchema);

// --- SIGNUP ROUTE ---
app.post('/api/users/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('📝 Signup attempt:', { username, email });

    // Validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Create new user
    // NOTE: In production, you should hash the password using bcrypt!
    const newUser = new User({ username, email, password });
    const savedUser = await newUser.save();

    console.log('✅ User created:', savedUser.username);

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email
      }
    });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Failed to create user', details: err.message });
  }
});

// --- CREATE TASK ROUTE ---
app.post('/api/users/:userId/tasks', async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description } = req.body;

    console.log('Received task request:', { userId, body: req.body });
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newTask = new Task({ 
      title, 
      description,
      userId // Link task to user
    });

    const savedTask = await newTask.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: savedTask,
    });
  } catch (err) {
    console.error('Error details:', err); 
    res.status(500).json({ error: 'Failed to create task', details: err.message });
  }
});

// --- GET ALL TASKS ---
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// --- GET TASKS FOR SPECIFIC USER ---
app.get('/api/users/:userId/tasks', async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await Task.find({ userId });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user tasks' });
  }
});

// --- HOME ROUTE ---
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// --- SIGNUP PAGE ROUTE ---
app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

// --- Start Server ---
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));