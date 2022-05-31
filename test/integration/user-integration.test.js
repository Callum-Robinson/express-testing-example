const chai = require('chai');
const chaiHttp = require('chai-http');
const ObjectId = require('mongoose').Types.ObjectId;
const app = require('../../app.js');
const userList = require('../data/users.json');
const User = require('../../model/user');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe('User integration test', function() {
    let testData = [];

    this.beforeEach(async () => {
        try {
            await User.deleteMany();
            testData = await User.insertMany(userList);
        } catch (err) {
            console.error(err);
        }
    });

    this.afterAll(async () => {
        try {
            await User.deleteMany();
        } catch (err) {
            console.error(err);
        }
    });
});