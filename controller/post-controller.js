const postService = require('../services/post-service');
const Post = require('../model/post');

module.exports = {
    read: async(req, res, next) => {
        try {
            const posts = await postService.read();
            res.status(200).json(posts);
        } catch (err) {
            next(err);
        }
    },

    readById: async(req, res, next) => {
        try {
            const post = await postService.readById(req.params.id);
            
            if (!post) {
                const err = new Error(`Post not found with id ${req.params.id}`);
                err.statusCode = 404;
                return next(err);
            }

            res.status(200).json(post);
        } catch (err) {
            next(err);
        }
    },

    create: async(req, res, next) => {
        try {
            const post = await postService.create(new Post(req.body));
            res.status(201).json(post);
        } catch (err) {
            next(err);
        }
    },

    update: async(req, res, next) => {
        try {
            const post = await postService.update(new Post(req.body));
            res.status(200).json(post);
        } catch (err) {
            next(err);
        }
    },

    addComment: async(req, res, next) => {
        try {
            const post = await postService.addCommentById(req.params.commentId, req.params.postId);
            res.status(200).json(post);
        } catch (err) {
            next(err);
        }
    },

    deleteByTitle: async(req, res, next) => {
        try {            
            const post = await postService.deleteByTitle(req.params.title);

            if (!post) {
                const err = new Error(`Post not found with title ${req.params.title}`);
                err.statusCode = 404;
                throw err;
            }
            
            res.status(200).json(post);
        } catch (err) {
            next(err);
        }
    },

    deleteById: async(req, res, next) => {
        try {            
            const post = await postService.deleteById(req.params.id);

            if (!post) {
                const err = new Error(`Post not found with id ${req.params.id}`);
                err.statusCode = 404;
                return next(err);
            }

            res.status(200).json(post);
        } catch (err) {
            next(err);
        }
    }
}
