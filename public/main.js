import { comment } from './comments.js';
import { modal } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
  comment.init();
  comment.loadComments();
  modal.init();
});