const commentService = require('../services/comment-service');
const Comment = require('../model/comment');

module.exports = {
    read: async (req, res, next) => {
        try {
            const comments = await commentService.read();
            res.status(200).json(comments);
        } catch (err) {
            next(err);
        }
    },

    readById: async(req, res, next) => {
        try {
            const comment = await commentService.readById(req.params.id);

            if (!comment) {
                const err = new Error(`Comment not found with id ${req.params.id}`);
                err.statusCode = 404;
                return next(err);
            }

            res.status(200).json(comment);
        } catch (err) {
            next(err);
        }
    },

    create: async(req, res, next) => {
        try {
            const comment = await commentService.create(new Comment(req.body));
            res.status(201).json(comment);
        } catch (err) {
            next(err);
        }
    },

    update: async(req, res, next) => {
        try {
            const comment = await commentService.update(new Comment(req.body));
            res.status(200).json(comment);
        } catch (err) {
            next(err);
        }
    },

    deleteById: async(req, res, next) => {
        try {            
            const comment = await commentService.deleteById(req.params.id);

            if (!comment) {
                const err = new Error(`Comment not found with id ${req.params.id}`);
                err.statusCode = 404;
                return next(err);
            }

            res.status(200).json(comment);
        } catch (err) {
            next(err);
        }
    }
}
