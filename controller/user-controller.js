const userService = require('../services/user-service');
const User = require('../model/user');

module.exports = {
    read: async (req, res, next) => {
        try {
            const users = await userService.read();
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    },

    readById: async(req, res, next) => {
        try {
            const user = await userService.readById(req.params.id);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    },

    create: async(req, res, next) => {
        try {
            const newUser = await userService.create(new User(req.body));
            res.status(201).json(newUser);
        } catch (err) {
            next(err);
        }
    },

    update: async(req, res, next) => {
        try {
            const updatedUser = await userService.update(new User(req.body));
            res.status(200).json(updatedUser);
        } catch (err) {
            console.log("in uc update error")
            console.log(err)
            next(err);
        }
    },

    deleteByEmail: async(req, res, next) => {
        try {            
            const deletedUser = await userService.deleteByEmail(req.params.email);

            if (!deletedUser) {
                const err = new Error(`User not found with email ${req.params.email}`);
                err.statusCode = 404;
                return next(err);
            }
            res.status(200).json(deletedUser);
        } catch (err) {
            next(err);
        }
    },

    deleteById: async(req, res, next) => {
        try {            
            const deletedUser = await userService.deleteById(req.params.id);

            if (!deletedUser) {
                const err = new Error(`User not found with id ${req.params.id}`);
                err.statusCode = 404;
                return next(err);
            }
            res.status(200).json(deletedUser);
        } catch (err) {
            next(err);
        }
    }
}
