export const progress = (() => {

    /**
     * @type {HTMLElement|null}
     */
    let info = null;

    /**
     * @type {HTMLElement|null}
     */
    let bar = null;

    let total = 0;
    let loaded = 0;
    let valid = true;
    let push = true;

    /**
     * @returns {void}
     */
    const add = () => {
        if (push) {
            total += 1;
        }
    };

    /**
     * @returns {string}
     */
    const showInformation = () => {
        return `(${loaded}/${total}) [${parseInt((loaded / total) * 100).toFixed(0)}%]`;
    };

    /**
     * @param {string} type
     * @returns {void}
     */
    const complete = (type) => {
        if (!valid) {
            return;
        }

        loaded += 1;
        info.innerText = `Loading ${type} complete ${showInformation()}`;
        bar.style.width = Math.min((loaded / total) * 100, 100).toString() + '%';

        if (loaded === total) {
            document.dispatchEvent(new Event('progressDone'));
        }
    };

    /**
     * @param {string} type
     * @returns {void}
     */
    const invalid = (type) => {
        valid = false;
        bar.style.backgroundColor = 'red';
        info.innerText = `Error loading ${type} ${showInformation()}`;
    };

    /**
     * @returns {Promise<void>}
     */
    const run = async () => {
        document.querySelectorAll('img').forEach((asset) => {
            asset.onerror = () => {
                invalid('image');
            };
            asset.onload = () => {
                complete('image');
            };

            if (asset.complete && asset.naturalWidth !== 0 && asset.naturalHeight !== 0) {
                complete('image');
            } else if (asset.complete) {
                invalid('image');
            }
        });
    };

    /**
     * @returns {void}
     */
    const init = () => {
        info = document.getElementById('progress-info');
        bar = document.getElementById('progress-bar');
        info.style.display = 'block';

        document.querySelectorAll('img').forEach(add);
        push = false;
        run();
    };

    return {
        init,
        add,
        invalid,
        complete,
    };
})();