const chai = require('chai');
const chaiHttp = require('chai-http');
const ObjectId = require('mongoose').Types.ObjectId;
const app = require('../../app.js');
const postList = require('../data/posts.json');
const commentList = require('../data/comments.json');
const Post = require('../../model/post');
const Comment = require('../../model/comment');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);

describe('Post integration test', function() {
    let testData = [];
    let commentData = [];

    // do not use done as a parameter, only for callbacks, not async functions
    this.beforeEach(async () => {
        try {
            testData = await Post.insertMany(postList);
            commentData = await Comment.insertMany(commentList);
        } catch (err) {
            console.error(err);
        }
        
    });

    this.afterEach(async () => {
        try {
            await Comment.deleteMany();
            await Post.deleteMany();
        } catch (err) {
        }
    });

    describe('GET /post', () => {
        it('should return a list of posts when called', done => {
            chai.request(app)
                .get('/post')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                    expect(res).to.be.json;
                    expect(res).to.not.redirect;
                    expect(res.body[0]).to.include.all.keys(['title', 'content', '_id', 'comments']);
                    expect(res.body).to.be.a('array');
                    expect(res.body).to.deep.equal(JSON.parse(JSON.stringify(testData)));
                    expect(res.body.length).to.equal(testData.length);
                    done();
                });
        });
    });

    describe('GET /post/:id', () => {
        it('should return a post when called with a valid id', done => {
            const post = testData[0];
            const id = post._id;
            chai.request(app)
                .get(`/post/${id}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                    expect(res).to.be.json;
                    expect(res).to.not.redirect;
                    expect(res.body).to.include.all.keys(['title', 'content', '_id', 'comments']);
                    expect(res.body.title).to.equal(post.title);
                    done();
                });
        });

        it('should not return a post when called with an invalid id', done => {
            const id = ObjectId();
            chai.request(app)
                .get(`/post/${id}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
                    expect(res).to.be.json;
                    expect(res).to.not.redirect;
                    done();
                });
        });
    });

    describe('POST /post', () => {
        it('should return a new document if valid', done => {
            const post = new Post({ 
                _id: ObjectId(), 
                title: "Test post 2", 
                content: "Content of test post 2",
                __v: 0
            });

            chai.request(app)
                .post('/post')
                .type('json')
                .send(JSON.stringify(post))
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.deep.equal(JSON.parse(JSON.stringify(post)));
                    done();
                });
        });

        it('should return 400 - bad request if invalid', done => {
            const post = new Post({ 
                content: "Content of test post 2",
            });

            chai.request(app)
                .post('/post')
                .type('json')
                .send(JSON.stringify(post))
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    done();
                });
        });
    });

    describe('PUT /post', () => {
        it('should return a new document if a document with the unique title does not already exist', done => {
            const post = new Post({ 
                _id: ObjectId(), 
                title: "Test post 2", 
                content: "Content of test post 2",
                __v: 0
            });

            chai.request(app)
                .put('/post')
                .type('json')
                .send(JSON.stringify(post))
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.deep.equal(JSON.parse(JSON.stringify(post)));
                    done();
                });
        });

        it('should update a document if it exists', done => {
            const updates = {
                _id: testData[0]._id,
                content: 'Updated content'
            };

            chai.request(app)
                .put('/post')
                .type('json')
                .send(JSON.stringify(updates))
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body._id).to.equal(updates._id.toString());
                    expect(res.body.content).to.equal(updates.content);
                    done();
                });
        });
    });

    describe('DELETE /:id', () => {
        it('should delete a document by its id if it exists and return the document', done => {
            const id = testData[0]._id;

            chai.request(app)
                .delete(`/post/${id}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.deep.equal(JSON.parse(JSON.stringify(testData[0])));
                    done();
                });
        });

        it('should return a 404 and not delete a document if the specified id does not exist', done => {
            const id = ObjectId();

            chai.request(app)
                .delete(`/post/${id}`)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    expect(res).to.be.json;
                    done();
                });
        });
    });
});