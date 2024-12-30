import { util } from './util.js';
import { guest } from './guest.js';
import { theme } from './theme.js';
import { audio } from './audio.js';
import { comment } from './comment.js';

document.addEventListener('DOMContentLoaded', () => {
    guest.init();
    window.AOS.init();

    window.util = util;
    window.guest = guest;
    window.theme = theme;
    window.audio = audio;
    window.comment = comment;
});
