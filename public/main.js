import { comment } from './comments.js';
import { modal } from './modal.js';
import { login } from './login.js';
import { register } from './register.js';
import {test} from './test.js'


document.addEventListener('DOMContentLoaded', () => {
  comment.init();
  comment.loadComments();
  modal.init();
  login.init();
  register.init();
  test.init();
});