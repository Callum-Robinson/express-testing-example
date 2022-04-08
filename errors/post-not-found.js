module.exports = class PostNotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}