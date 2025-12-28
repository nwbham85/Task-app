// dashboard.js
// Check authentication
const token = localStorage.getItem('token');
let user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
  window.location.href = 'login.html';
}

// Display user name
document.getElementById('userName').textContent = user.username || 'User';

// API Helper
async function apiCall(endpoint, options = {}) {
  const response = await fetch(`http://localhost:3000${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers
    }
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
    return;
  }

  return response.json();
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

// ============================================
// SETTINGS MODAL
// ============================================

const settingsModal = document.getElementById('settingsModal');
const settingsBtn = document.getElementById('settingsBtn');
const closeSettingsModalBtns = document.querySelectorAll('.close-settings-modal, .cancel-settings-btn');

settingsBtn.addEventListener('click', async () => {
  // Load current user data
  const currentUser = await apiCall('/api/auth/me');
  
  document.getElementById('settingsEmail').value = currentUser.email || '';
  document.getElementById('settingsUsername').value = currentUser.username || '';
  document.getElementById('settingsFirstName').value = currentUser.profile?.firstName || '';
  document.getElementById('settingsLastName').value = currentUser.profile?.lastName || '';
  document.getElementById('settingsTimezone').value = currentUser.profile?.timezone || '';
  
  document.getElementById('settingsError').style.display = 'none';
  document.getElementById('settingsSuccess').style.display = 'none';
  
  settingsModal.style.display = 'flex';
});

closeSettingsModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
  });
});

// Update Profile
document.getElementById('settingsForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const errorDiv = document.getElementById('settingsError');
  const successDiv = document.getElementById('settingsSuccess');
  
  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';

  const profileData = {
    email: document.getElementById('settingsEmail').value,
    username: document.getElementById('settingsUsername').value,
    profile: {
      firstName: document.getElementById('settingsFirstName').value,
      lastName: document.getElementById('settingsLastName').value,
      timezone: document.getElementById('settingsTimezone').value
    }
  };

  try {
    const result = await apiCall('/api/auth/update-profile', {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    });

    if (result.error) {
      errorDiv.textContent = result.error;
      errorDiv.style.display = 'block';
    } else {
      // Update local storage
      user = result;
      localStorage.setItem('user', JSON.stringify(result));
      document.getElementById('userName').textContent = result.username;
      
      successDiv.style.display = 'block';
      
      setTimeout(() => {
        settingsModal.style.display = 'none';
      }, 1500);
    }
  } catch (error) {
    errorDiv.textContent = 'Failed to update profile';
    errorDiv.style.display = 'block';
  }
});

// ============================================
// TASKS MANAGEMENT
// ============================================

// Load Tasks
async function loadTasks() {
  const statusFilter = document.getElementById('statusFilter').value;
  const priorityFilter = document.getElementById('priorityFilter').value;

  let url = '/api/tasks?';
  if (statusFilter) url += `status=${statusFilter}&`;
  if (priorityFilter) url += `priority=${priorityFilter}&`;

  const tasks = await apiCall(url);
  displayTasks(tasks);
  updateStats(tasks);
}

// Display Tasks
function displayTasks(tasks) {
  const container = document.getElementById('tasksContainer');
  const emptyState = document.getElementById('emptyState');

  if (!tasks || tasks.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = tasks.map(task => `
  <div class="task-card" data-id="${task._id}">
    <div class="task-header">
      <h3>${task.title}</h3>
      <div class="task-actions">
        <button class="btn-icon edit-task" data-id="${task._id}">✏️</button>
        <button class="btn-icon delete-task" data-id="${task._id}">🗑️</button>
      </div>
    </div>

    ${task.description ? `<p class="task-description">${task.description}</p>` : ''}

    <div class="task-meta">
      <span class="badge badge-${task.status}">${task.status.replace('_', ' ')}</span>
      <span class="badge badge-priority-${task.priority}">${task.priority}</span>
    </div>

    ${task.dueDate ? `
      <div class="task-due-date ${new Date(task.dueDate) < new Date() && task.status !== 'done' ? 'overdue' : ''}">
        📅 ${new Date(task.dueDate).toLocaleDateString()}
      </div>
    ` : ''}

    ${task.tags && task.tags.length > 0 ? `
      <div class="task-tags">
        ${task.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    ` : ''}

    <!-- ✅ COMMENTS SECTION (always present) -->
    <div class="task-comments" data-task-id="${task._id}">
      <div class="comments-header">
        <button class="toggle-comments" type="button" data-task-id="${task._id}">
          💬 Comments <span class="comment-count" data-task-id="${task._id}">(0)</span>
        </button>
      </div>

      <div class="comments-body hidden" data-task-id="${task._id}">
        <div class="comments-list" data-task-id="${task._id}">
          <div class="comment-empty">Open to load comments.</div>
        </div>

        <form class="comment-form" data-task-id="${task._id}">
          <input
            class="comment-input"
            name="comment"
            placeholder="Write a comment…"
            maxlength="280"
            required
          />
          <button class="comment-submit" type="submit">Post</button>
        </form>
      </div>
    </div>

  </div>
`).join('');


  // Add event listeners for edit and delete
  document.querySelectorAll('.edit-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskId = e.target.dataset.id;
      editTask(taskId, tasks);
    });
  });

  document.querySelectorAll('.delete-task').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const taskId = e.target.dataset.id;
      deleteTask(taskId);
    });
  });
}

// Update Stats
function updateStats(tasks) {
  document.getElementById('totalTasks').textContent = tasks.length;
  document.getElementById('todoCount').textContent = tasks.filter(t => t.status === 'todo').length;
  document.getElementById('inProgressCount').textContent = tasks.filter(t => t.status === 'in_progress').length;
  document.getElementById('doneCount').textContent = tasks.filter(t => t.status === 'done').length;
  
  const overdue = tasks.filter(t => 
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
  ).length;
  document.getElementById('overdueCount').textContent = overdue;
}

// ============================================
// TASK MODAL
// ============================================

const modal = document.getElementById('taskModal');
const newTaskBtn = document.getElementById('newTaskBtn');
const closeModalBtns = document.querySelectorAll('.close-modal, .cancel-btn');

newTaskBtn.addEventListener('click', () => {
  document.getElementById('modalTitle').textContent = 'Create New Task';
  document.getElementById('taskForm').reset();
  document.getElementById('taskId').value = '';
  modal.style.display = 'flex';
});

closeModalBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    modal.style.display = 'none';
  });
});

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
  if (e.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
});

// Create/Update Task
document.getElementById('taskForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const taskId = document.getElementById('taskId').value;
  const taskData = {
    title: document.getElementById('taskTitle').value,
    description: document.getElementById('taskDescription').value,
    status: document.getElementById('taskStatus').value,
    priority: document.getElementById('taskPriority').value,
    dueDate: document.getElementById('taskDueDate').value || null,
    tags: document.getElementById('taskTags').value
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)
  };

  if (taskId) {
    // Update existing task
    await apiCall(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify(taskData)
    });
  } else {
    // Create new task
    await apiCall('/api/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  }

  modal.style.display = 'none';
  loadTasks();
});

// Edit Task
function editTask(taskId, tasks) {
  const task = tasks.find(t => t._id === taskId);
  if (!task) return;

  document.getElementById('modalTitle').textContent = 'Edit Task';
  document.getElementById('taskId').value = task._id;
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDescription').value = task.description || '';
  document.getElementById('taskStatus').value = task.status;
  document.getElementById('taskPriority').value = task.priority;
  document.getElementById('taskDueDate').value = task.dueDate ? task.dueDate.split('T')[0] : '';
  document.getElementById('taskTags').value = task.tags ? task.tags.join(', ') : '';

  modal.style.display = 'flex';
}

// Delete Task
async function deleteTask(taskId) {
  if (!confirm('Are you sure you want to delete this task?')) return;

  await apiCall(`/api/tasks/${taskId}`, {
    method: 'DELETE'
  });

  loadTasks();
}

// ============================================
// FILTERS
// ============================================

document.getElementById('statusFilter').addEventListener('change', loadTasks);
document.getElementById('priorityFilter').addEventListener('change', loadTasks);

// ============================================
// INITIAL LOAD
// ============================================

loadTasks();

// ===== dark mode ====

  // read saved preference on load
  // save preference when toggled
const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'darkMode') {
  document.body.classList.add('darkMode');
}


const darkMode = document.getElementById('darkMode');
darkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark');

  const isDark = document.body.classList.contains('darkMode');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ============================================
// TEAM SETTINGS MODAL (at the end of dashboard.js)
// ============================================

const teamSettingsModal = document.getElementById('teamSettingsModal');
const teamSettingsIcon = document.querySelector('.teamSettings-icon');
const closeTeamSettingsBtn = document.getElementById('closeTeamSettings');

console.log('Team settings icon:', teamSettingsIcon); // Debug
console.log('Team settings modal:', teamSettingsModal); // Debug

// Open team settings modal
if (teamSettingsIcon) {
  teamSettingsIcon.addEventListener('click', () => {
    console.log('Icon clicked!'); // Debug
    teamSettingsModal.classList.add('open');
  });
}

// Close team settings modal
if (closeTeamSettingsBtn) {
  closeTeamSettingsBtn.addEventListener('click', () => {
    teamSettingsModal.classList.remove('open');
  });
}

// Update the existing window click handler to include team settings
// Find this in your dashboard.js and update it:
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
  if (e.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
  if (e.target === teamSettingsModal) {
    teamSettingsModal.classList.remove('open');
  }
});