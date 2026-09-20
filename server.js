import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import taskRoute from './routes/taskRoute.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Converts incoming JSON into req.body
app.use(express.json());
app.use('/tasks', taskRoute);



// Connect to MongoDB and start the server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(`Startup error: ${error.message}`);
  }
}

startServer();