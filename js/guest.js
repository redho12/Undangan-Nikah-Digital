import { guest } from './app/guest/guest.js';

document.addEventListener('DOMContentLoaded', async () => {
    window.undangan = guest.init();
});
