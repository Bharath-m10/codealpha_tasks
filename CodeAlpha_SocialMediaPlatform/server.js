const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store
let users = [
  { id: 1, name: "Bharath", username: "bharath_dev", bio: "Full Stack Web Developer & CS Engineer", followers: 120 }
];

let posts = [
  {
    id: 101,
    author: "Bharath",
    username: "bharath_dev",
    content: "Excited to work on the CodeAlpha full-stack projects! Building scalable modern web apps.",
    likes: 5,
    likedBy: [],
    comments: [
      { id: 1, author: "TechFriend", text: "All the best Bharat!" }
    ],
    timestamp: "2 hours ago"
  }
];

// Profile route
app.get('/api/profile', (req, res) => {
  res.json(users[0]);
});

// Post routes
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.post('/api/posts', (req, res) => {
  const { content, author, username } = req.body;
  if (!content) return res.status(400).json({ error: "Post content cannot be empty" });
  const newPost = {
    id: Date.now(),
    author: author || "Bharath",
    username: username || "bharath_dev",
    content,
    likes: 0,
    likedBy: [],
    comments: [],
    timestamp: "Just now"
  };
  posts.unshift(newPost);
  res.status(201).json(newPost);
});

// Like toggle route
app.post('/api/posts/:id/like', (req, res) => {
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Post not found" });
  post.likes += 1;
  res.json({ likes: post.likes });
});

// Comment route
app.post('/api/posts/:id/comment', (req, res) => {
  const { author, text } = req.body;
  if (!text) return res.status(400).json({ error: "Comment text cannot be empty" });
  const post = posts.find(p => p.id === parseInt(req.params.id));
  if (!post) return res.status(404).json({ error: "Post not found" });
  const newComment = { id: Date.now(), author: author || "Guest", text };
  post.comments.push(newComment);
  res.status(201).json(newComment);
});

// Follow toggle route
app.post('/api/users/:id/follow', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: "User not found" });
  user.followers += 1;
  res.json({ followers: user.followers });
});

app.listen(PORT, () => {
  console.log(`Task 2: Social Media Platform running at http://localhost:${PORT}`);
});
