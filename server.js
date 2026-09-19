import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import Task from "./models/Task.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Converts incoming JSON into req.body
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "Mongoose beginner CRUD challenge"
  });
});

// ------------------------------------------------------------
// CREATE A TASK
// POST /tasks
// ------------------------------------------------------------
app.post("/tasks", async (req, res) => {
  try {
    const newTask = await Task.create(req.body);

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// ------------------------------------------------------------
// READ ALL TASKS
// GET /tasks
// ------------------------------------------------------------
app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// ------------------------------------------------------------
// UPDATE A TASK
// PATCH /tasks/:taskId
// ------------------------------------------------------------
app.patch("/tasks/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      req.body,
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

// ------------------------------------------------------------
// DELETE A TASK
// DELETE /tasks/:taskId
// ------------------------------------------------------------
app.delete("/tasks/:taskId", async (req, res) => {
  try {
    const taskId = req.params.taskId;

    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.status(200).json(deletedTask);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

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