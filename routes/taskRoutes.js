const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
  toggleTaskCompletion,
} = require("../controllers/taskController");

// GET all tasks
router.get("/", getTasks);

// POST a new task
router.post("/", createTask);

// DELETE a task
router.delete("/:id", deleteTask);

// PUT to update a task (title, due date, priority, etc.)
router.put("/:id", updateTask);

// PATCH to toggle completion status
router.patch("/:id", toggleTaskCompletion);

module.exports = router;
