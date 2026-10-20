window.addEventListener('DOMContentLoaded', () => {
  loadTasks();
});

async function loadTasks() {
  const res = await fetch('/api/tasks');
  const tasks = await res.json();

  const todoCards = document.getElementById('cards-todo');
  const progCards = document.getElementById('cards-inprogress');
  const doneCards = document.getElementById('cards-done');

  todoCards.innerHTML = '';
  progCards.innerHTML = '';
  doneCards.innerHTML = '';

  let todoCount = 0, progCount = 0, doneCount = 0;

  tasks.forEach(t => {
    const cardHtml = `
      <div class="task-card">
        <div class="task-title">${t.title}</div>
        <div class="task-assignee">👤 ${t.assignedTo}</div>
        <div class="task-footer">
          <select class="status-select" onchange="updateStatus(${t.id}, this.value)">
            <option value="TODO" ${t.status === 'TODO' ? 'selected' : ''}>To Do</option>
            <option value="IN_PROGRESS" ${t.status === 'IN_PROGRESS' ? 'selected' : ''}>In Progress</option>
            <option value="DONE" ${t.status === 'DONE' ? 'selected' : ''}>Done</option>
          </select>
          <button class="del-btn" onclick="deleteTask(${t.id})">Delete</button>
        </div>
      </div>
    `;

    if (t.status === 'TODO') {
      todoCards.innerHTML += cardHtml;
      todoCount++;
    } else if (t.status === 'IN_PROGRESS') {
      progCards.innerHTML += cardHtml;
      progCount++;
    } else if (t.status === 'DONE') {
      doneCards.innerHTML += cardHtml;
      doneCount++;
    }
  });

  document.getElementById('count-todo').innerText = todoCount;
  document.getElementById('count-inprogress').innerText = progCount;
  document.getElementById('count-done').innerText = doneCount;
}

async function updateStatus(id, newStatus) {
  await fetch(`/api/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: newStatus })
  });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

function openCreateModal() {
  document.getElementById('taskModal').style.display = 'flex';
}

function closeCreateModal() {
  document.getElementById('taskModal').style.display = 'none';
}

async function createTask() {
  const title = document.getElementById('taskTitle').value.trim();
  const assignedTo = document.getElementById('taskAssignee').value.trim();
  const status = document.getElementById('taskStatus').value;

  if (!title) return alert('Task title is required!');

  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, assignedTo, status })
  });

  document.getElementById('taskTitle').value = '';
  document.getElementById('taskAssignee').value = '';
  closeCreateModal();
  loadTasks();
}
