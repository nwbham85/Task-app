const form = document.querySelector('.taskForm');
const taskContainer = document.querySelector('.taskContainer');

// ✅ Define loadTasks FIRST, outside the event listener
async function loadTasks(userId) {
  try {
    const response = await fetch(`/api/users/${userId}/tasks`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }
    
    const tasks = await response.json();
    console.log('📋 Tasks loaded:', tasks);
    
    // Clear existing tasks
    taskContainer.innerHTML = '';
    
    // Display each task
    if (tasks.length === 0) {
      taskContainer.innerHTML = '<p>No tasks yet. Add your first task!</p>';
    } else {
      tasks.forEach(task => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task-item';
        taskDiv.innerHTML = `
          <h3>${task.title}</h3>
          <p>${task.description || 'No description'}</p>
          <small>Created: ${new Date(task.createdAt).toLocaleDateString()}</small>
          <button type='button' class='deleteBtn' data-id='${task._id}'>Delete Task</button>
        `;
        taskContainer.appendChild(taskDiv);
      });
    }
    
  } catch (err) {
    console.error('❌ Error loading tasks:', err);
    taskContainer.innerHTML = '<p>Failed to load tasks</p>';
  }
}

// Handle task submission
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  
  console.log('🚀 Form submitted!');

  const title = document.getElementById('taskNameInput').value;
  const description = document.getElementById('taskDescriptionInput').value;

  console.log('📝 Form values:', { title, description });

  const userId = 'user123';

  try {
    console.log('📡 Sending request to server...');
    
    const response = await fetch(`/api/users/${userId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description }),
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    if (!response.ok) {
      const text = await response.text();
      console.log('❌ Error response:', text);
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Task saved:', data);
    
    // Clear the form after successful submission
    form.reset();
    
    // Show success message
    document.getElementById('message').textContent = '✅ Task added successfully!';
    document.getElementById('message').style.color = 'green';
    
    // Clear message after 3 seconds
    setTimeout(() => {
      document.getElementById('message').textContent = '';
    }, 3000);
    
    // Load tasks to display the new one
    await loadTasks(userId);
    
  } catch (err) {
    console.error('❌ Error saving task:', err);
    document.getElementById('message').textContent = '❌ Failed to add task';
    document.getElementById('message').style.color = 'red';
  }
});

// ✅ Load tasks when page first loads
loadTasks('user123');