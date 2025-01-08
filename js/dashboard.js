import { admin } from './dashboard/admin.js';

document.addEventListener('DOMContentLoaded', () => {
    window.undangan = admin.init();
});