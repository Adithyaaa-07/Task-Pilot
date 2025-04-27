const Task = require("../models/Task");

// GET all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a new task
const createTask = async (req, res) => {
    const { title, dueDate, priority } = req.body;
  
    try {
      const newTask = await Task.create({ title, dueDate, priority });
      res.status(201).json(newTask);
    } catch (err) {
      res.status(500).json({ error: "Failed to create task" });
    }
  };

// DELETE a task
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE a task (title, dueDate, priority)
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          title: req.body.title,
          dueDate: req.body.dueDate,
          priority: req.body.priority,
        },
      },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// TOGGLE completed status (PATCH)
const toggleTaskCompletion = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  toggleTaskCompletion,
};
