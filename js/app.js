import { util } from './common/util.js';
import { guest } from './guest/guest.js';
import { theme } from './common/theme.js';
import { comment } from './comment/comment.js';

document.addEventListener('DOMContentLoaded', () => {
    guest.init();

    window.util = util;
    window.guest = guest;
    window.theme = theme;
    window.comment = comment;
});
