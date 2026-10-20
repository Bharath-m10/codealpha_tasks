let profileUser = null;

window.addEventListener('DOMContentLoaded', () => {
  loadProfile();
  loadPosts();
});

async function loadProfile() {
  const res = await fetch('/api/profile');
  profileUser = await res.json();
  document.getElementById('profileName').innerText = profileUser.name;
  document.getElementById('profileHandle').innerText = `@${profileUser.username}`;
  document.getElementById('profileBio').innerText = profileUser.bio;
  document.getElementById('followersCount').innerText = profileUser.followers;
  document.getElementById('profileInitials').innerText = profileUser.name.charAt(0);
}

async function followUser() {
  const res = await fetch(`/api/users/${profileUser.id}/follow`, { method: 'POST' });
  const data = await res.json();
  document.getElementById('followersCount').innerText = data.followers;
}

async function loadPosts() {
  const res = await fetch('/api/posts');
  const posts = await res.json();
  const feed = document.getElementById('postsFeed');
  feed.innerHTML = posts.map(p => `
    <div class="post-card">
      <div class="post-header">
        <span class="post-author">${p.author} <small style="font-weight:normal; color:#64748b;">@${p.username}</small></span>
        <span>${p.timestamp}</span>
      </div>
      <div class="post-body">${p.content}</div>
      <div class="post-actions">
        <button class="action-btn" onclick="likePost(${p.id})">❤️ Like (${p.likes})</button>
        <button class="action-btn">💬 Comments (${p.comments.length})</button>
      </div>
      <div class="comments-section">
        <div id="comments-${p.id}">
          ${p.comments.map(c => `
            <div class="comment"><strong>${c.author}:</strong> ${c.text}</div>
          `).join('')}
        </div>
        <div class="comment-input-box">
          <input type="text" id="input-${p.id}" placeholder="Write a comment...">
          <button onclick="addComment(${p.id})">Send</button>
        </div>
      </div>
    </div>
  `).join('');
}

async function submitPost() {
  const input = document.getElementById('postInput');
  const content = input.value.trim();
  if (!content) return alert('Please enter some text!');
  await fetch('/api/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      author: profileUser.name,
      username: profileUser.username,
      content
    })
  });
  input.value = '';
  loadPosts();
}

async function likePost(id) {
  await fetch(`/api/posts/${id}/like`, { method: 'POST' });
  loadPosts();
}

async function addComment(id) {
  const input = document.getElementById(`input-${id}`);
  const text = input.value.trim();
  if (!text) return alert('Comment cannot be empty!');
  await fetch(`/api/posts/${id}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      author: profileUser.name,
      text
    })
  });
  input.value = '';
  loadPosts();
}
