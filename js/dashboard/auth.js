import { dto } from '../dto.js';
import { util } from '../util.js';
import { session } from '../session.js';
import { bootstrap } from '../bootstrap.js';

export const auth = (() => {

    /**
     * @param {HTMLButtonElement} button
     * @returns {Promise<void>}
     */
    const login = async (button) => {
        const btn = util.disableButton(button);

        const formEmail = document.getElementById('loginEmail');
        const formPassword = document.getElementById('loginPassword');

        formEmail.disabled = true;
        formPassword.disabled = true;

        const res = await session.login(dto.postSessionRequest(formEmail.value, formPassword.value));
        if (res) {
            formEmail.value = null;
            formPassword.value = null;
            bootstrap.Modal.getOrCreateInstance('#mainModal').hide();
        }

        btn.restore();
        formEmail.disabled = false;
        formPassword.disabled = false;
    };

    return {
        login,
    };
})();