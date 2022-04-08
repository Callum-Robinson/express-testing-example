const HttpError = require('../errors/http-error');
const commentService = require('../services/comment-service');
const Comment = require('../model/comment');
const PostNotFoundError = require('../errors/post-not-found');
const CommentNotFoundError = require('../errors/comment-not-found');

module.exports = {
    read: async (req, res, next) => {
        const comments = await commentService.read().catch(next);
        res.status(200).json(comments);
    },

    readById: async(req, res, next) => {
        const comment = await commentService.readById(req.params.id).catch(next);

        if (!comment) {
            const err = new HttpError(`Comment not found with id ${req.params.id}`, 404);
            return next(err);
        }
        res.status(200).json(comment);
    },

    create: async(req, res, next) => {
        const comment = await commentService.create(new Comment(req.body)).catch(err => {
            if (typeof err === PostNotFoundError) return next(new HttpError(err, 404));
            return next(err);
        });
        res.status(201).json(comment);
    },

    update: async(req, res, next) => {
        const comment = await commentService.update(new Comment(req.body)).catch(next);
        res.status(200).json(comment);
    },

    deleteById: async(req, res, next) => {
        const comment = await commentService.deleteById(req.params.id).catch(err => {
            if (typeof err === CommentNotFoundError) return next(new HttpError(err, 404));
            else if (typeof err === PostNotFoundError) return next(new HttpError(err, 404));
            else return next(err);
        });
        res.status(200).json(comment);
    }
}
