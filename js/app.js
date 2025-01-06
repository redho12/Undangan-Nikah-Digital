import { guest } from './guest/guest.js';
import { theme } from './common/theme.js';
import { comment } from './comment/comment.js';

document.addEventListener('DOMContentLoaded', () => {
    window.undangan = guest.init();

    window.guest = guest;
    window.theme = theme;
    window.comment = comment;
});
