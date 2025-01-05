import { util } from './common/util.js';
import { theme } from './common/theme.js';
import { admin } from './dashboard/admin.js';
import { comment } from './comment/comment.js';

document.addEventListener('DOMContentLoaded', () => {
    admin.init();

    window.util = util;
    window.admin = admin;
    window.theme = theme;
    window.comment = comment;
});