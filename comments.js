// public/js/comments.js  (ESM / ES2024)

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function qs(selector, root = document) {
  return root.querySelector(selector);
}

function qsa(selector, root = document) {
  return [...root.querySelectorAll(selector)];
}

async function fetchComments(taskId) {
  return window.apiCall(`/api/tasks/${taskId}/comments`);
}

async function postComment(taskId, text) {
  return window.apiCall(`/api/tasks/${taskId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text })
  });
}

async function deleteComment(commentId) {
  return window.apiCall(`/api/comments/${commentId}`, {
    method: 'DELETE'
  });
}

function setCount(taskId, count) {
  const countEl = qs(`.comment-count[data-task-id="${taskId}"]`);
  if (countEl) countEl.textContent = `(${count})`;
}

function setLoading(taskId, isLoading) {
  const listEl = qs(`.comments-list[data-task-id="${taskId}"]`);
  if (!listEl) return;

  if (isLoading) {
    listEl.innerHTML = `<div class="comment-empty">Loading comments…</div>`;
  }
}

function renderComments(taskId, comments) {
  const listEl = qs(`.comments-list[data-task-id="${taskId}"]`);
  if (!listEl) return;

  setCount(taskId, comments.length);

  if (comments.length === 0) {
    listEl.innerHTML = `<div class="comment-empty">No comments yet.</div>`;
    return;
  }

  const username = window.currentUser?.username;

  listEl.innerHTML = comments.map(c => {
    const canDelete = username && (c.user?.username === username || c.user === window.currentUser?._id);
    return `
      <div class="comment-item" data-comment-id="${c._id}">
        <div class="comment-top">
          <span class="comment-author">${escapeHtml(c.user?.username || 'User')}</span>
          <span class="comment-date">${new Date(c.createdAt).toLocaleString()}</span>
        </div>
        <div class="comment-text">${escapeHtml(c.text)}</div>
        ${canDelete ? `<button class="comment-delete" data-comment-id="${c._id}" type="button">Delete</button>` : ''}
      </div>
    `;
  }).join('');
}

async function loadAndRenderComments(taskId) {
  setLoading(taskId, true);
  const result = await fetchComments(taskId);
  // Expect: { comments: [...] }
  renderComments(taskId, result.comments || []);
}

function toggleComments(taskId) {
  const body = qs(`.comments-body[data-task-id="${taskId}"]`);
  if (!body) return;

  const isHidden = body.classList.contains('hidden');
  body.classList.toggle('hidden');

  if (isHidden) {
    // just opened -> load comments
    loadAndRenderComments(taskId).catch(() => {
      const listEl = qs(`.comments-list[data-task-id="${taskId}"]`);
      if (listEl) listEl.innerHTML = `<div class="comment-empty">Failed to load comments.</div>`;
    });
  }
}

async function handleSubmit(form) {
  const taskId = form.dataset.taskId;
  const input = qs('.comment-input', form);
  const text = input.value.trim();
  if (!text) return;

  input.disabled = true;

  const res = await postComment(taskId, text);

  input.value = '';
  input.disabled = false;
  input.focus();

  // Expect: { comment, commentsCount }
  // Reload list (simple + consistent)
  await loadAndRenderComments(taskId);

  // If backend returned count, update it too
  if (typeof res.commentsCount === 'number') setCount(taskId, res.commentsCount);
}

async function handleDelete(taskId, commentId) {
  await deleteComment(commentId);
  await loadAndRenderComments(taskId);
}

function initComments() {
  const container = document.getElementById('tasksContainer');
  if (!container) return;

  // Click delegation for toggle + delete
  container.addEventListener('click', (e) => {
    const toggleBtn = e.target.closest('.toggle-comments');
    if (toggleBtn) {
      const taskId = toggleBtn.dataset.taskId;
      toggleComments(taskId);
      return;
    }

    const delBtn = e.target.closest('.comment-delete');
    if (delBtn) {
      const commentId = delBtn.dataset.commentId;
      const card = e.target.closest('.task-card');
      const taskId = card?.dataset.id;
      if (!taskId) return;

      handleDelete(taskId, commentId).catch(() => {
        alert('Failed to delete comment');
      });
      return;
    }
  });

  // Submit delegation for comment form
  container.addEventListener('submit', (e) => {
    const form = e.target.closest('.comment-form');
    if (!form) return;

    e.preventDefault();

    handleSubmit(form).catch(() => {
      alert('Failed to post comment');
      const input = qs('.comment-input', form);
      if (input) input.disabled = false;
    });
  });
}

document.addEventListener('DOMContentLoaded', initComments);
