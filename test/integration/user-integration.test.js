const chai = require('chai');
const chaiHttp = require('chai-http');
const ObjectId = require('mongoose').Types.ObjectId;
const app = require('../../app.js');
const userList = require('../data/users.json');
const User = require('../../model/user');

const expect = chai.expect;
const should = chai.should();

chai.use(chaiHttp);