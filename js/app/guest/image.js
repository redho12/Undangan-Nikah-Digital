import { progress } from './progress.js';

export const image = (() => {

    /**
     * @type {Map<string, string>}
     */
    let uniqueUrl = null;

    /**
     * @type {NodeListOf<HTMLImageElement>}
     */
    let images = null;

    let hasSrc = true;

    // 6 hour TTL
    const ttl = 1000 * 60 * 60 * 6;

    const cacheName = 'image_cache';

    /**
     * @param {HTMLImageElement} el 
     * @returns {Promise<void>}
     */
    const getByFetch = async (el) => {
        const url = el.getAttribute('data-src');
        const exp = 'x-expiration-time';

        if (uniqueUrl.has(url)) {
            el.src = uniqueUrl.get(url);
            progress.complete('image');
            return;
        }

        /**
         * @param {Cache} c 
         * @returns {Promise<blob>}
         */
        const fetchPut = (c) => {
            return fetch(url).then((res) => res.blob().then((b) => {
                const headers = new Headers(res.headers);
                headers.append(exp, String(Date.now() + ttl));

                return c.put(url, new Response(b, { headers })).then(() => b);
            }));
        };

        await caches.open(cacheName).then((c) => {
            return c.match(url).then((res) => {
                if (!res) {
                    return fetchPut(c);
                }

                if (Date.now() <= parseInt(res.headers.get(exp))) {
                    return res.blob();
                }

                return c.delete(url).then((s) => s ? fetchPut(c) : res.blob());
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

    /**
     * @returns {boolean}
     */
    const hasDataSrc = () => hasSrc;

    /**
     * @returns {void}
     */
    const load = () => {
        (async () => {
            for (const el of images) {
                if (el.hasAttribute('data-src')) {
                    await getByFetch(el);
                } else {
                    getByDefault(el);
                }
            }
        })();
    };

    /**
     * @returns {object}
     */
    const init = () => {
        uniqueUrl = new Map();
        images = document.querySelectorAll('img');

        images.forEach(progress.add);
        hasSrc = Array.from(images).some((i) => i.hasAttribute('data-src'));

        return {
            load,
            hasDataSrc,
        };
    };

    return {
        init,
    };
})();