// server.js
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import session from 'express-session';

// Import Routes
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import projectRoutes from './routes/projects.js';
import statsRoutes from './routes/stats.js';
import teamRoutes from './routes/teams.js';

// Import Models (for export)
import User from './models/User.js';
import Task from './models/Task.js';
import Project from './models/Project.js';
import Team from './models/Team.js';

// ES Module equivalents for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(express.json());
app.use(express.static(__dirname));

app.use(session({
  secret: 'my-super-secret-key', // Use a random string
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.use('/teams', teamRoutes);

// ============================================
// ROUTES
// ============================================

// Serve login page as default
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stats', statsRoutes);

// ============================================
// DATABASE CONNECTION
// ============================================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/taskapp')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ============================================
// ERROR HANDLING
// ============================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ============================================
// SERVER
// ============================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Export for testing
export default app;
export { User, Task, Project, Team };