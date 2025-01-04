import { util } from './util.js';
import { theme } from './theme.js';
import { comment } from './comment.js';
import { guest } from './guest/guest.js';

document.addEventListener('DOMContentLoaded', () => {
    guest.init();
    window.AOS.init();

    window.util = util;
    window.guest = guest;
    window.theme = theme;
    window.comment = comment;
});
