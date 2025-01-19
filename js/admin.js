import { admin } from './app/admin/admin.js';

document.addEventListener('DOMContentLoaded', async () => {
    window.undangan = admin.init();
});