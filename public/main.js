import { comment } from './comments.js';
import { modal } from './modal.js';
import { login } from './login.js';
import { register } from './register.js';

document.addEventListener('DOMContentLoaded', () => {
  comment.init();
  comment.loadComments();
  modal.init();
  login.init();
  register.init();
});