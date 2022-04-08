module.exports = class CommentNotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}