import { util } from './util.js';
import { admin } from './admin.js';
import { theme } from './theme.js';
import { comment } from './comment.js';

document.addEventListener('DOMContentLoaded', () => {
    admin.init();

    window.util = util;
    window.admin = admin;
    window.theme = theme;
    window.comment = comment;
});