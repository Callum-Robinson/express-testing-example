const HttpError = require('../errors/http-error');
const postService = require('../services/post-service');
const commentService = require('../services/comment-service');
const Post = require('../model/post');

module.exports = {
    read: async(req, res, next) => {
        const posts = await postService.read().catch(next);
        res.status(200).json(posts);
    },

    readById: async(req, res, next) => {
        const post = await postService.readById(req.params.id).catch(next);
        
        if (post) {
            res.status(200).json(post);
        }
        const err = new HttpError(new Error(`Post not found with id ${req.params.id}`), 404);
        return next(err);
    },

    create: async(req, res, next) => {
        const post = await postService.create(new Post(req.body)).catch(next);

        if (post) {
            res.status(201).json(post);
        }
    },

    update: async(req, res, next) => {
        const post = await postService.update(new Post(req.body)).catch(next);
        res.status(200).json(post);
    },

    addComment: async(req, res, next) => {
        const post = await postService.addCommentById(req.params.commentId, req.params.postId).catch(next);
        res.status(200).json(post);
    },

    deleteByTitle: async(req, res, next) => {       
        const post = await postService.deleteByTitle(req.params.title).catch(next);

        if (!post) {
            const err = new HttpError(new Error(`Post not found with title ${req.params.title}`), 404);
            err.statusCode = 404;
            return next(err);
        }
        
        res.status(200).json(post);
    },

    deleteById: async(req, res, next) => {         
        const post = await postService.deleteById(req.params.id).catch(next);

        if (!post) {
            const err = new HttpError(new Error(`Post not found with id ${req.params.id}`), 404);
            return next(err);
        }
        // remove associated comments
        await commentService.deleteGroupByPostId(post._id);
        res.status(200).json(post);
    }
}
