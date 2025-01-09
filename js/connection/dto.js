export const dto = (() => {

    /**
     * @template T
     * @param {number} code
     * @param {T} data
     * @param {string[]|null} error
     * @returns {{code: number, data: T, error: string[]|null}}
     */
    const baseResponse = (code, data, error) => {
        return {
            code,
            data,
            error,
        };
    };

    /**
     * @param {number} love
     * @returns {{love: number}}
     */
    const likeCommentResponse = (love = 0) => {
        return {
            love,
        };
    };

    /**
     * @param {{uuid: string, own: string, name: string, presence: boolean, comment: string, created_at: string}} postComment
     * @returns {{uuid: string, own: string, name: string, presence: boolean, comment: string, is_admin: boolean, created_at: string, comments: postCommentResponse[], like: {love: number}}}
     */
    const postCommentResponse = ({ uuid, own, name, presence, comment, created_at }) => {
        let is_admin = false;
        let comments = [];
        let like = likeCommentResponse();

        return {
            uuid,
            own,
            name,
            presence,
            comment,
            is_admin,
            created_at,
            comments,
            like,
        };
    };

    /**
     * @param {{status: boolean}} status
     * @returns {{status: boolean}}
     */
    const statusResponse = ({ status }) => {
        return {
            status,
        };
    };

    /**
     * @param {{token: string}} token
     * @returns {{token: string}}
     */
    const tokenResponse = ({ token }) => {
        return {
            token,
        };
    };

    /**
     * @param {{uuid: string}} uuid
     * @returns {{uuid: string}}
     */
    const uuidResponse = ({ uuid }) => {
        return {
            uuid,
        };
    };

    /**
     * @param {{name: string, presence: boolean, comment: string, is_admin: boolean, created_at: string}} commentData
     * @returns {{name: string, presence: boolean, comment: string, is_admin: boolean, created_at: string}}
     */
    const commentResponse = ({ name, presence, comment, is_admin, created_at }) => {
        return {
            name,
            presence,
            comment,
            is_admin,
            created_at,
        };
    };

    /**
     * @param {string} uuid
     * @param {boolean} show
     * @returns {{uuid: string, show: boolean}}
     */
    const commentShowMore = (uuid, show = false) => {
        return {
            uuid,
            show,
        };
    };

    /**
     * @param {string} id
     * @param {string} name
     * @param {boolean} presence
     * @param {string} comment
     * @returns {{id: string, name: string, presence: boolean, comment: string}}
     */
    const postCommentRequest = (id, name, presence, comment) => {
        return {
            id,
            name,
            presence,
            comment,
        };
    };

    /**
     * @param {string} email
     * @param {string} password
     * @returns {{email: string, password: string}}
     */
    const postSessionRequest = (email, password) => {
        return {
            email: email,
            password: password,
        };
    };

    /**
     * @param {boolean} presence
     * @param {string} comment
     * @returns {{presence: boolean, comment: string}}
     */
    const updateCommentRequest = (presence, comment) => {
        return {
            presence: presence,
            comment: comment
        };
    };

    return {
        uuidResponse,
        baseResponse,
        tokenResponse,
        statusResponse,
        commentResponse,
        likeCommentResponse,
        postCommentResponse,
        commentShowMore,
        postCommentRequest,
        postSessionRequest,
        updateCommentRequest,
    };
})();