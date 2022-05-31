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

    describe('GET /user', () => {
        it('should return a list of users when called', done => {
            chai.request(app)
            .get('/user')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                expect(res).to.be.json;
                expect(res).to.not.redirect;
                expect(res.body[0]).to.include.all.keys(['username', 'email', 'createdAt', 'admin']);
                expect(res.body).to.be.a('array');
                expect(res.body).to.deep.equal(JSON.parse(JSON.stringify(testData)));
                expect(res.body.length).to.equal(testData.length);
                done();
            });
        });
    });
});