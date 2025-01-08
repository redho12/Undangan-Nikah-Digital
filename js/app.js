import { guest } from './guest/guest.js';

document.addEventListener('DOMContentLoaded', () => {
    window.undangan = guest.init();
});
