import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    axios.get("http://localhost:5000/api/tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  const addTask = () => {
    if (!newTask.trim()) return;

    axios.post("http://localhost:5000/api/tasks", {
      title: newTask,
      dueDate,
      priority,
    })
      .then(res => {
        setTasks([...tasks, res.data]);
        setNewTask("");
        setDueDate("");
        setPriority("Medium");
      })
      .catch(err => console.error(err));
  };

  const deleteTask = (id) => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
      })
      .catch(err => console.error(err));
  };

  const toggleTaskCompletion = (id) => {
    axios.patch(`http://localhost:5000/api/tasks/${id}`)
      .then(res => {
        setTasks(tasks.map(task => task._id === id ? res.data : task));
      })
      .catch(err => console.error(err));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "incomplete") return !task.completed;
    return true;
  });

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')"
      }}
    >
      <div className="max-w-2xl mx-auto bg-white bg-opacity-80 backdrop-blur-md shadow-2xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
          Task Pilot <span role="img" aria-label="plane">✈️</span>
        </h1>

        {/* Task Inputs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2"
          >
            <option value="High">🔥 High</option>
            <option value="Medium">🌤 Medium</option>
            <option value="Low">🌱 Low</option>
          </select>
          <button
            onClick={addTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-6">
          {["all", "incomplete", "completed"].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-lg border ${
                filter === type
                  ? "bg-blue-500 text-white"
                  : "bg-white text-blue-500 border-blue-500"
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Task List */}
        <ul className="space-y-4">
          {filteredTasks.map(task => (
            <li
              key={task._id}
              className="bg-gray-100 border-l-4 p-4 rounded-lg flex justify-between items-center shadow-sm"
              style={{
                borderColor:
                  task.priority === "High" ? "#f87171" :
                  task.priority === "Medium" ? "#facc15" : "#34d399"
              }}
            >
              <div
                className="flex flex-col flex-1 mr-4 cursor-pointer"
                onClick={() => toggleTaskCompletion(task._id)}
              >
                <span className={`text-lg ${task.completed ? "line-through text-gray-500" : ""}`}>
                  {task.title}
                </span>
                <span className="text-sm text-gray-500">
                  Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "N/A"} | Priority: {task.priority}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 hover:text-red-700 text-xl"
              >
                ❌
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
