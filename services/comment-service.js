const Comment = require('../model/comment');
const Post = require('../model/post');

module.exports = {

    read: async () => await Comment.find().populate('postId'),

    readById: id => Comment.findById(id).populate('postId'),

    create: async comment => {
        const post = await Post.findById(comment.postId);

        if (!post) {
            const err = new Error(`Post not found with id ${comment.postId}`);
            err.statusCode = 404;
            throw err;
        }
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
        const post = await Post.findByIdAndUpdate({ _id: comment.postId }, {
            "$pull": {
                "comments": comment._id
            }
        });
        console.log(post);
        return comment;
    }
}

const mergeProperties = (savedComment, updates) => {
    if (updates.message) savedComment.message = updates.message;
}