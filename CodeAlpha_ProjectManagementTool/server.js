const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data
let projects = [
  { id: 1, name: "CodeAlpha Web Development Sprint" }
];

let tasks = [
  { id: 1, projectId: 1, title: "Design DB Schema", assignedTo: "Bharath", status: "DONE", comments: ["Finished SQLite schema."] },
  { id: 2, projectId: 1, title: "Build REST APIs", assignedTo: "Bharath", status: "IN_PROGRESS", comments: ["Working on auth routes."] },
  { id: 3, projectId: 1, title: "Push to GitHub & LinkedIn", assignedTo: "Bharath", status: "TODO", comments: [] }
];

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, assignedTo, status } = req.body;
  if (!title) return res.status(400).json({ error: "Title is required" });
  const newTask = {
    id: Date.now(),
    projectId: 1,
    title,
    assignedTo: assignedTo || "Unassigned",
    status: status || "TODO",
    comments: []
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update task status (Kanban column shift)
app.patch('/api/tasks/:id/status', (req, res) => {
  const { status } = req.body;
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.status = status;
  res.json(task);
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
  tasks = tasks.filter(t => t.id !== parseInt(req.params.id));
  res.json({ message: "Task removed" });
});

// Add comment to task
app.post('/api/tasks/:id/comment', (req, res) => {
  const { comment } = req.body;
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.comments.push(comment);
  res.json(task);
});

app.listen(PORT, () => {
  console.log(`Task 3: Project Management Tool running at http://localhost:${PORT}`);
});
