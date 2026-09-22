import Task from '../models/Task.js';


// GET /api/tasks
export const getTasks = async (req, res) => {
  
  try {
    const tasks = await Task.find();

    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

// get task status 
export const getTaskStatus = async (req, res) => {
  try {
    const { isComplete } = req.query;

    if (!['true', 'false'].includes(isComplete)) {
      return res.status(400).json({
        message: 'isComplete must be either true or false'
      });
    }

    const booleanStatus = isComplete === 'true';

    const tasks = await Task.find({
      isComplete: booleanStatus
    });

    return res.status(200).json({
      isComplete: booleanStatus,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to retrieve tasks',
      error: error.message
    });
  }
};



// GET /api/tasks/:id
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    return res.status(200).json(task);
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid task ID'
      });
    }

    return res.status(500).json({
      message: 'Unable to retrieve task'
    });
  }
};

// GET /api/tasks/:id/history
export const getTaskHistory = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).select('history');

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    return res.status(200).json({
      taskId: task._id,
      history: task.history
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid task ID'
      });
    }

    return res.status(500).json({
      message: 'Unable to retrieve task history'
    });
  }
};

// POST /tasks
export const createTask = async (req, res) => {
  try {
    
    const task = await Task.create(req.body);

    return res.status(201).json({
      message: 'Task created successfully',
      body: task
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
};

// PATCH /tasks/:id
export const updateTask = async (req, res) => {
  try {
    const { title, isComplete } = req.body;

    if (title !== undefined && typeof title !== 'string') {
      return res.status(400).json({
        message: 'Title must be a string'
      });
    }

    if (isComplete !== undefined && typeof isComplete !== 'boolean') {
      return res.status(400).json({
        message: 'isComplete must be a boolean'
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    // Record and apply a title change.
    if (title !== undefined && title !== task.title) {
      task.history.push({
        field: 'title',
        oldValue: task.title,
        newValue: title
      });

      task.title = title;
    }

    // Record and apply a completion-status change.
    if (
      isComplete !== undefined &&
      isComplete !== task.isComplete
    ) {
      task.history.push({
        field: 'isComplete',
        oldValue: task.isComplete,
        newValue: isComplete
      });

      task.isComplete = isComplete;
    }

    await task.save();

    return res.status(200).json({
      message: 'Task updated successfully',
      body: task
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid task ID'
      });
    }

    return res.status(400).json({
      message: error.message
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({
        message: 'Task not found'
      });
    }

    return res.status(200).json({
      message: 'Task deleted',
      body: deletedTask
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid task ID'
      });
    }

    return res.status(500).json({
      message: error.message
    });
  }
};