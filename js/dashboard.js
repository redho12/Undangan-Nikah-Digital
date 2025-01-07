import { admin } from './dashboard/admin.js';
import { comment } from './comment/comment.js';

document.addEventListener('DOMContentLoaded', () => {
    window.undangan = admin.init();
    window.comment = comment;
});