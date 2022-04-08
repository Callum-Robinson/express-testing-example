const Comment = require('../model/comment');
const Post = require('../model/post');
const PostNotFoundError = require('../errors/post-not-found');
const CommentNotFoundError = require('../errors/comment-not-found');

module.exports = {

    read: async () => Comment.find().populate('postId'),

    readById: async id => Comment.findById(id).populate('postId'),

    create: async comment => {
        const post = await Post.findById(comment.postId);
        if (!post) throw new PostNotFoundError(`Post not found with id ${comment.postId}`);

        const newComment = await comment.save();
        post.comments.push(newComment._id);
        await post.save();
        return newComment;
    },

    update: async comment => {
        // search by unique indexes
        const result = await Comment.findOne({_id: comment._id});

        if (!result) {
            // comment doesn't exist, save new comment
            return comment.save();
        }
        // comment does exist, proceed to update
        console.log(result);
        mergeProperties(result, comment);
        return result.save();
    },
    
    deleteById: async id => {
        const comment = await Comment.findOneAndDelete({ _id: id });
        if (!comment) throw new CommentNotFoundError(`Comment not found with id ${id}`);

        const post = await Post.findByIdAndUpdate({ _id: comment.postId }, {
            "$pull": {
                "comments": comment._id
            }
        });
        if (!post) throw new PostNotFoundError(`Post not found`);

        return comment;
    }
}

const mergeProperties = (savedComment, updates) => {
    if (updates.message) savedComment.message = updates.message;
}