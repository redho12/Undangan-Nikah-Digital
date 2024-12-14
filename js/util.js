import { storage } from './storage.js';
import { bootstrap } from './bootstrap.js';

export const util = (() => {

    const opacity = (id, speed = 0.01) => {
        const element = document.getElementById(id);
        let op = parseInt(element.style.opacity);

        let clear = null;
        const callback = () => {
            if (op > 0) {
                element.style.opacity = op.toFixed(3);
                op -= speed;
                return;
            }

            clearInterval(clear);
            clear = null;
            element.remove();
        };

        clear = setInterval(callback, 10);
    };

    const escapeHtml = (unsafe) => {
        return String(unsafe)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    };

    const timeOut = (callback, timeout) => {
        let clear = null;
        const c = () => {
            callback();
            clearTimeout(clear);
            clear = null;
        };

        clear = setTimeout(c, timeout);
    };

    const disableButton = (button, message = 'Loading..') => {

        button.disabled = true;
        const tmp = button.innerHTML;
        button.innerHTML = `<div class="spinner-border spinner-border-sm my-0 ms-0 me-1 p-0" style="height: 0.8rem; width: 0.8rem"></div>${message}`;

        return {
            restore: () => {
                button.innerHTML = tmp;
                button.disabled = false;
            },
        };
    };

    const addLoadingCheckbox = (checkbox) => {
        checkbox.disabled = true;

        const label = document.querySelector(`label[for="${checkbox.id}"]`);
        const tmp = label.innerHTML;
        label.innerHTML = `<div class="spinner-border spinner-border-sm my-0 ms-0 me-1 p-0" style="height: 0.8rem; width: 0.8rem"></div>${tmp}`;

        return {
            restore: () => {
                label.innerHTML = tmp;
                checkbox.disabled = false;
            },
        };
    };

    const animate = (svg, timeout, classes) => timeOut(() => svg.classList.add(classes), timeout);

    const modal = (img) => {
        document.getElementById('show-modal-image').src = img.src;
        bootstrap.Modal.getOrCreateInstance('#modal-image').show();
    };

    const copy = async (button, message = null, timeout = 1500) => {
        const copy = button.getAttribute('data-copy');

        if (!copy || copy.length == 0) {
            alert('Nothing to copy');
            return;
        }

        button.disabled = true;

        try {
            await navigator.clipboard.writeText(copy);
        } catch {
            button.disabled = false;
            alert('Failed to copy');
            return;
        }

        const tmp = button.innerHTML;
        button.innerHTML = message ? message : '<i class="fa-solid fa-check"></i>';

        timeOut(() => {
            button.disabled = false;
            button.innerHTML = tmp;
        }, timeout);
    };

    const base64Encode = (str) => {
        const encoder = new TextEncoder();
        const encodedBytes = encoder.encode(str);
        return btoa(String.fromCharCode(...encodedBytes));
    };

    const base64Decode = (str) => {
        const decoder = new TextDecoder();
        const decodedBytes = Uint8Array.from(window.atob(str), (c) => c.charCodeAt(0));
        return decoder.decode(decodedBytes);
    };

    const closeInformation = () => storage('information').set('info', true);

    return {
        open,
        copy,
        modal,
        timeOut,
        opacity,
        animate,
        escapeHtml,
        base64Encode,
        base64Decode,
        disableButton,
        closeInformation,
        addLoadingCheckbox,
    };
})();