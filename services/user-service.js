const User = require('../model/user');

module.exports = {

    read: async () => await User.find(),

    readById: async id => {
        const user = await User.findById(id);
        
        if (!user) {
            const err = new Error(`User not found with id ${id}`);
            err.statusCode = 404;
            throw err;
        }
        return user;
    },

    create: async user => {
        const response = await User.findOne({ $or: [{email: user.email}, {username: user.username}] });

        // email or username taken
        if (response) {
            const err = new Error('Email or username already taken.');
            err.statusCode = 400;
            throw err;
        }
        // user doesn't exist with properties matching new user
        return user.save();
    },

    update: async user => {
        // search by unique indexes
        const result = await User.findOne({$or: [{_id: user._id}, {email: user.email}]});

        if (!result) {
            // user doesn't exist, save new user
            return user.save();
        }
        // user does exist, proceed to update
        console.log(result);
        mergeProperties(result, user);
        return result.save();
    },

    deleteByEmail: async email => {
        const user = await User.findOneAndDelete({ email: email });

        if (!user) {
            const err = new Error(`User not found with id ${id}`);
            err.statusCode = 404;
            throw err;
        }
        return user;
    },
    
    deleteById: async id => {
        const user = User.findOneAndDelete({ _id: id });

        if (!user) {
            const err = new Error(`User not found with id ${id}`);
            err.statusCode = 404;
            throw err;
        }
        return user;
    }
}

const mergeProperties = (savedUser, updates) => {
    if (updates.username) savedUser.username = updates.username;
    if (updates.email) savedUser.email = updates.email;
}