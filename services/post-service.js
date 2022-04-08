const Post = require('../model/post');
const Comment = require('../model/comment');

module.exports = {

    read: () => Post.find({}).populate('comments'),

    readById: id => Post.findById(id).populate('comments'),

    create: post => post.save(),

    update: async post => {
        // search by unique indexes
        const result = await Post.findOne({$or: [{_id: post._id}, {title: post.title}]});

        if (!result) {
            // post doesn't exist, save new post
            return post.save();
        }
        // post does exist, proceed to update
        console.log(result);
        mergeProperties(result, post);
        return result.save();
    },

    addCommentById: async (commentId, postId) => {
        const post = await readById(postId);
        post.comments.push(commentId);
        return post.save();
    },

    deleteByTitle: title => Post.findOneAndDelete({ title }),
    
    deleteById: id => Post.findOneAndDelete({ _id: id })
}

const mergeProperties = (savedPost, updates) => {
    if (updates.title) savedPost.username = updates.username;
    if (updates.content) savedPost.content = updates.content;
    if (updates.comments) savedPost.comments.push(...updates.comments);
}