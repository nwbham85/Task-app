export const comment = {
  init() {
    const postBtn = document.querySelector('.postBtn');

    if (!postBtn) return;

    postBtn.addEventListener('click', () => this.postComment());
  },

  async postComment() {
    const input = document.querySelector('input[name="comment"]');
    const text = input.value.trim();

    if (!text) return;

    const res = await fetch('/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: text, creator: 'john', tags: '#tag' })
    });

    if (!res.ok) {
      const err = await res.json();
      console.error('Failed to post:', err.error);
      return;
    }

    input.value = '';
    await this.loadComments();
  },

  async loadComments() {
    const res = await fetch('/comments');
    const data = await res.json();

    const container = document.querySelector('.comments');
    container.innerHTML = data.map(c => `
      <div class="comment-block">
        <div class="comments">
          <p class="comment">${c.comment}</p>
          <span><button class="editBtn" type="button">Edit</button></span>
        </div>
        <div class="comment-footer">
          <p class="postDate">${new Date(c.date).toLocaleDateString()}</p>
          <span class="postCreator">${c.creator ?? ''}</span>
          <span class="tags">${c.tags ?? ''}</span>
        </div>
      </div>
    `).join('');
  }
};