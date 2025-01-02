import { dto } from '../dto.js';
import { auth } from './auth.js';
import { util } from '../util.js';
import { theme } from '../theme.js';
import { navbar } from './navbar.js';
import { storage } from '../storage.js';
import { session } from '../session.js';
import { comment } from '../comment.js';
import { offline } from '../offline.js';
import { bootstrap } from '../bootstrap.js';
import { request, HTTP_GET, HTTP_PATCH, HTTP_PUT } from '../request.js';

export const admin = (() => {

    /**
     * @type {ReturnType<typeof storage>|null}
     */
    let user = null;

    /**
     * @returns {Promise<void>}
     */
    const getAllRequest = async () => {
        await request(HTTP_GET, '/api/user').token(session.getToken()).send().then((res) => {

            for (let [k, v] of Object.entries(res.data)) {
                user.set(k, v);
            }

            document.getElementById('dashboard-name').innerHTML = `${util.escapeHtml(res.data.name)}<i class="fa-solid fa-hands text-warning ms-2"></i>`;
            document.getElementById('dashboard-email').innerHTML = res.data.email;
            document.getElementById('dashboard-accesskey').value = res.data.access_key;
            document.getElementById('button-copy-accesskey').setAttribute('data-copy', res.data.access_key);

            document.getElementById('form-name').value = util.escapeHtml(res.data.name);
            document.getElementById('filterBadWord').checked = Boolean(res.data.is_filter);
            document.getElementById('replyComment').checked = Boolean(res.data.can_reply);
            document.getElementById('editComment').checked = Boolean(res.data.can_edit);
            document.getElementById('deleteComment').checked = Boolean(res.data.can_delete);
        });

        request(HTTP_GET, '/api/stats').token(session.getToken()).send().then((res) => {
            document.getElementById('count-comment').innerHTML = String(res.data.comments).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            document.getElementById('count-like').innerHTML = String(res.data.likes).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            document.getElementById('count-present').innerHTML = String(res.data.present).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            document.getElementById('count-absent').innerHTML = String(res.data.absent).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        });

        comment.comment();
    };

    /**
     * @param {HTMLElement} checkbox
     * @returns {Promise<void>}
     */
    const changeFilterBadWord = async (checkbox) => {
        const label = util.disableCheckbox(checkbox);

        await request(HTTP_PATCH, '/api/user').
            token(session.getToken()).
            body({
                filter: Boolean(checkbox.checked)
            }).
            send();

        label.restore();
    };

    /**
     * @param {HTMLElement} checkbox
     * @returns {Promise<void>}
     */
    const replyComment = async (checkbox) => {
        const label = util.disableCheckbox(checkbox);

        await request(HTTP_PATCH, '/api/user').
            token(session.getToken()).
            body({
                can_reply: Boolean(checkbox.checked)
            }).
            send();

        label.restore();
    };

    /**
     * @param {HTMLElement} checkbox
     * @returns {Promise<void>}
     */
    const editComment = async (checkbox) => {
        const label = util.disableCheckbox(checkbox);

        await request(HTTP_PATCH, '/api/user').
            token(session.getToken()).
            body({
                can_edit: Boolean(checkbox.checked)
            }).
            send();

        label.restore();
    };

    /**
     * @param {HTMLElement} checkbox
     * @returns {Promise<void>}
     */
    const deleteComment = async (checkbox) => {
        const label = util.disableCheckbox(checkbox);

        await request(HTTP_PATCH, '/api/user').
            token(session.getToken()).
            body({
                can_delete: Boolean(checkbox.checked)
            }).
            send();

        label.restore();
    };

    /**
     * @param {HTMLButtonElement} button
     * @returns {Promise<void>}
     */
    const regenerate = async (button) => {
        if (!confirm('Are you sure?')) {
            return;
        }

        const btn = util.disableButton(button);

        await request(HTTP_PUT, '/api/key').
            token(session.getToken()).
            send(dto.statusResponse).
            then((res) => {
                if (res.data.status) {
                    getAllRequest();
                }
            });

        btn.restore();
    };

    /**
     * @param {HTMLButtonElement} button
     * @returns {Promise<void>}
     */
    const changePassword = async (button) => {
        const old = document.getElementById('old_password');
        const newest = document.getElementById('new_password');

        if (old.value.length == 0 || newest.value.length == 0) {
            alert('Password cannot be empty');
            return;
        }

        old.disabled = true;
        newest.disabled = true;

        const btn = util.disableButton(button);

        const result = await request(HTTP_PATCH, '/api/user').
            token(session.getToken()).
            body({
                old_password: old.value,
                new_password: newest.value,
            }).
            send(dto.statusResponse).
            then((res) => res.data.status, () => false);

        btn.restore();

        old.disabled = false;
        newest.disabled = false;

        if (result) {
            old.value = null;
            newest.value = null;
            button.disabled = true;
            alert('Success change password');
        }
    };

    /**
     * @param {HTMLButtonElement} button
     * @returns {Promise<void>}
     */
    const changeName = async (button) => {
        const name = document.getElementById('form-name');

        if (name.value.length == 0) {
            alert('Name cannot be empty');
            return;
        }

        name.disabled = true;
        const btn = util.disableButton(button);

        const result = await request(HTTP_PATCH, '/api/user').
            token(session.getToken()).
            body({
                name: name.value,
            }).
            send(dto.statusResponse).
            then((res) => res.data.status, () => false);

        name.disabled = false;
        btn.restore();

        if (result) {
            getAllRequest();
            button.disabled = true;
            alert('Success change name');
        }
    };

    /**
     * @param {HTMLButtonElement} button
     * @returns {Promise<void>}
     */
    const download = async (button) => {
        const btn = util.disableButton(button);

        await request(HTTP_GET, '/api/download').token(session.getToken()).download();

        btn.restore();
    };

    /**
     * @returns {void}
     */
    const enableButtonName = () => {
        const btn = document.getElementById('button-change-name');
        if (btn.disabled) {
            btn.disabled = false;
        }
    };

    /**
     * @returns {void}
     */
    const enableButtonPassword = () => {
        const btn = document.getElementById('button-change-password');
        const old = document.getElementById('old_password');

        if (btn.disabled && old.value.length !== 0) {
            btn.disabled = false;
        }
    };

    /**
     * @returns {void}
     */
    const clearSession = () => {
        user.clear();
        session.logout();
        bootstrap.Modal.getOrCreateInstance('#mainModal').show();
    };

    /**
     * @returns {void}
     */
    const logout = () => {
        if (!confirm('Are you sure?')) {
            return;
        }

        clearSession();
    };

    /**
     * @returns {void}
     */
    const init = () => {
        theme.init();
        session.init();
        offline.init();

        if (!session.isAdmin()) {
            storage('owns').clear();
            storage('likes').clear();
            storage('config').clear();
            storage('comment').clear();
            storage('session').clear();
            storage('information').clear();
        }

        theme.spyTop();
        comment.init();

        user = storage('user');
        document.getElementById('mainModal').addEventListener('hidden.bs.modal', getAllRequest);

        try {
            const exp = session.decode()?.exp;
            if (!exp || exp < (Date.now() / 1000)) {
                throw new Error('Invalid token');
            }

            getAllRequest();
        } catch {
            clearSession();
        }
    };

    return {
        auth,
        navbar,
        init,
        logout,
        download,
        regenerate,
        editComment,
        replyComment,
        deleteComment,
        changeName,
        changePassword,
        changeFilterBadWord,
        enableButtonName,
        enableButtonPassword,
    };
})();