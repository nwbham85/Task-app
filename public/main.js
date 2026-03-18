import { comment } from './comments.js';

document.querySelector('.postBtn')
  .addEventListener('click', () => comment.postComment());

// Load existing comments on page open
comment.loadComments();