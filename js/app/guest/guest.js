import { audio } from './audio.js';
import { progress } from './progress.js';
import { util } from '../../common/util.js';
import { theme } from '../../common/theme.js';
import { storage } from '../../common/storage.js';
import { session } from '../../common/session.js';
import { offline } from '../../common/offline.js';
import { comment } from '../component/comment.js';
import { bootstrap } from '../../libs/bootstrap.js';
import { confetti, openAnimation } from '../../libs/confetti.js';

export const guest = (() => {

    /**
     * @type {ReturnType<typeof storage>|null}
     */
    let information = null;

    /**
     * @returns {void}
     */
    const countDownDate = () => {
        const until = document.getElementById('count-down')?.getAttribute('data-time')?.replace(' ', 'T');
        if (!until) {
            return;
        }

        const count = (new Date(until)).getTime();

        setInterval(() => {
            const distance = Math.abs(count - Date.now());

            document.getElementById('day').innerText = Math.floor(distance / (1000 * 60 * 60 * 24));
            document.getElementById('hour').innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById('minute').innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById('second').innerText = Math.floor((distance % (1000 * 60)) / 1000);
        }, 1000);
    };

    /**
     * @param {string} id
     * @param {number} speed
     * @returns {void}
     */
    const opacity = (id, speed = 0.01) => {
        const el = document.getElementById(id);
        let op = parseFloat(el.style.opacity);

        let clear = null;
        const callback = () => {
            if (op > 0) {
                el.style.opacity = op.toFixed(3);
                op -= speed;
                return;
            }

            clearInterval(clear);
            clear = null;
            el.remove();
        };

        clear = setInterval(callback, 10);
    };

    /**
     * @returns {void}
     */
    const showGuestName = () => {
        /**
         * Make sure "to=" is the last query string.
         * Ex. domain.my.id/?id=some-uuid-here&to=name
         */
        const raw = window.location.search.split('to=');
        let name = null;

        if (raw.length > 1 && raw[1].length > 0) {
            name = window.decodeURIComponent(raw[1]);
        }

        if (name) {
            const guest = document.getElementById('guest-name');
            const div = document.createElement('div');
            div.classList.add('m-2');
            div.innerHTML = `
                <p class="mt-0 mb-1 mx-0 p-0" style="font-size: 0.95rem;">${guest?.getAttribute('data-message')}</p>
                <h2 class="m-0 p-0">${util.escapeHtml(name)}</h2>`;

            guest?.appendChild(div);
        }

        const form = document.getElementById('form-name');
        if (form) {
            form.value = information.get('name') ?? name;
        }

        // remove loading screen
        opacity('loading', 0.025);
    };

    /**
     * @param {HTMLButtonElement} button
     * @returns {void}
     */
    const open = (button) => {
        button.disabled = true;
        document.body.scrollIntoView({ behavior: 'instant' });

        if (!theme.isAutoMode()) {
            document.getElementById('button-theme').style.display = 'none';
        }

        confetti({
            origin: { y: 1 },
            zIndex: 1057
        });

        opacity('welcome', 0.025);

        audio.init();
        theme.spyTop();

        util.timeOut(openAnimation, 1500);
    };

    /**
     * @param {HTMLImageElement} img
     * @returns {void}
     */
    const modal = (img) => {
        document.getElementById('show-modal-image').src = img.src;
        bootstrap.Modal.getOrCreateInstance('#modal-image').show();
    };

    /**
     * @returns {void}
     */
    const closeInformation = () => information.set('info', true);

    /**
     * @param {HTMLElement} svg
     * @param {number} timeout
     * @param {string} classes
     * @returns {void}
     */
    const animate = (svg, timeout, classes) => util.timeOut(() => svg.classList.add(classes), timeout);

    /**
     * @returns {void}
     */
    const normalize = () => {
        document.querySelectorAll('.font-arabic').forEach((el) => {
            el.innerHTML = String(el.innerHTML).normalize('NFC');
        });
    };

    /**
     * @returns {void}
     */
    const imageProgress = () => {
        const uniqueUrl = new Map();

        /**
         * @param {HTMLImageElement} el 
         * @returns {Promise<void>}
         */
        const getByFetch = async (el) => {
            // 6 hour TTL
            const ttl = 1000 * 60 * 60 * 6;
            const url = el.getAttribute('data-src');
            const exp = 'x-expiration-time';
            const cacheName = 'image_cache';

            if (uniqueUrl.has(url)) {
                el.src = uniqueUrl.get(url);
                progress.complete('image');
                return;
            }

            /**
             * @param {Cache} cache 
             * @returns {Promise<blob>}
             */
            const fetchPut = (cache) => {
                return fetch(url).then((res) => res.blob().then((b) => {
                    const headers = new Headers(res.headers);
                    headers.append(exp, String(Date.now() + ttl));

                    return cache.put(url, new Response(b, { headers })).then(() => b);
                }));
            };

            return caches.open(cacheName).then((cache) => {
                return cache.match(url).then((res) => {
                    if (!res) {
                        return fetchPut(cache);
                    }

                    if (Date.now() <= parseInt(res.headers.get(exp), 10)) {
                        return res.blob();
                    }

                    return cache.delete(url).then((s) => s ? fetchPut(cache) : res.blob());
                }).then((b) => {
                    el.src = URL.createObjectURL(b);
                    uniqueUrl.set(url, el.src);
                    progress.complete('image');
                })
            }).catch(() => progress.invalid('image'));
        };

        /**
         * @param {HTMLImageElement} el 
         * @returns {void}
         */
        const getByDefault = (el) => {
            el.onerror = () => progress.invalid('image');
            el.onload = () => progress.complete('image');

            if (el.complete && el.naturalWidth !== 0 && el.naturalHeight !== 0) {
                progress.complete('image');
            } else if (el.complete) {
                progress.invalid('image');
            }
        };

        document.querySelectorAll('img').forEach(async (el) => el.hasAttribute('data-src') ? await getByFetch(el) : getByDefault(el));
    };

    /**
     * @returns {object}
     */
    const init = () => {
        theme.init();
        session.init();
        offline.init();
        progress.init();
        window.AOS.init();

        normalize();
        countDownDate();
        information = storage('information');
        document.addEventListener('progressDone', showGuestName);

        if (session.isAdmin()) {
            storage('user').clear();
            storage('owns').clear();
            storage('likes').clear();
            storage('session').clear();
            storage('comment').clear();
            storage('tracker').clear();
        }

        if (information.has('presence')) {
            document.getElementById('form-presence').value = information.get('presence') ? '1' : '2';
        }

        const info = document.getElementById('information');
        if (info && information.get('info')) {
            info.remove();
        }

        // add total image.
        document.querySelectorAll('img').forEach(progress.add);

        const token = document.body.getAttribute('data-key');
        if (!token || token.length === 0) {
            imageProgress();
            document.getElementById('comment')?.remove();
            document.querySelector('a.nav-link[href="#comment"]')?.closest('li.nav-item')?.remove();
        }

        if (token.length > 0) {
            // add 2 progress for config and comment.
            progress.add();
            progress.add();

            const hasDataSrc = Array.from(document.querySelectorAll('img')).some((i) => i.hasAttribute('data-src'));
            if (!hasDataSrc) {
                imageProgress();
            }

            session.setToken(token);
            session.guest()
                .then((res) => {
                    if (res.code !== 200) {
                        progress.invalid('config');
                        return;
                    }

                    progress.complete('config');

                    if (hasDataSrc) {
                        imageProgress();
                    }

                    comment.init();
                    comment.comment()
                        .then(() => progress.complete('comment'))
                        .catch(() => progress.invalid('comment'));
                })
                .catch(() => progress.invalid('config'));
        }

        return {
            util,
            theme,
            comment,
            guest: {
                open,
                modal,
                animate,
                closeInformation,
            },
        };
    };

    return {
        init,
    };
})();