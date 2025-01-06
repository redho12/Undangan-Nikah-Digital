import { theme } from './common/theme.js';
import { admin } from './dashboard/admin.js';
import { comment } from './comment/comment.js';

document.addEventListener('DOMContentLoaded', () => {
    window.undangan = admin.init();

    window.admin = admin;
    window.theme = theme;
    window.comment = comment;
});