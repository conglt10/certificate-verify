process.env.NODE_DEV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const User = require('../models/User');
const USER_ROLES = require('../configs/constant').USER_ROLES
const sinon = require('sinon');

const app = require('../app');

describe('Route /teacher', () => {

    describe('#POST /teacher/create', () => {
        var findOneUserStub;
        var saveUserStub;
        

        beforeEach(() => {
            findOneUserStub = sinon.stub(User, 'findOne');
            saveUserStub = sinon.stub(User.prototype, 'save');
        });

        afterEach(() => {
            findOneUserStub.restore();
            saveUserStub.restore();
        });

        it('should be invalid if username and name is empty', (done) => {
            request(app)
                .post('/teacher/create')
                .set('authorization','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4')
                .send({
                    username: '',
                    name: ''
                })
                .then((res) => {
                    expect(res.status).equal(422);
                    expect(res.body.errors[0].msg).equal('Invalid value');
                    done();
                });
        });

        it('should create success', (done) => {
            findOneUserStub.yields(undefined, null);

            request(app)
                .post('/teacher/create')
                .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4')
                .send({
                    username: 'thienthangaycanh',
                    name: 'thien than gay canh'
                })
                .then((res) => {
                    expect(res.body.msg).equal('Create Success');
                    done();
                });
            });

        it('should fail because the username already exists.', (done) => {
            findOneUserStub.yields(undefined, {
                username: 'thienthangaycanh',
                name: 'thien than gay canh'
            });

            request(app)
                .post('/teacher/create')
                .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4')
                .send({
                    username: 'thienthangaycanh',
                    name: 'thien than gay canh'
                })
                .then((res) => {
                    expect(res.body.msg).equal('Account is exist');
                    done();
                });
        });
    });

    describe('#GET /all', () => {
        var allUserStub;

        beforeEach(() => {
            allUserStub = sinon.stub(User, 'find');
        });

        afterEach(() => {
            allUserStub.restore();
        })

        it('should return all teachers.', (done) => {
            allUserStub.yields(undefined,
                [
                    {
                        id: 1,
                        username: 'GV01',
                        role: USER_ROLES.TEACHER
                    },
                    {
                        id: 2,
                        username: 'GV02',
                        role: USER_ROLES.TEACHER
                    },
                    {
                        id: 3,
                        username: 'GV03',
                        role: USER_ROLES.TEACHER
                    }
                ]
            );

            request(app)
                .get('/teacher/all')
                .set('authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4')
                .then((res) => {
                    //console.log(res.body)
                    expect(res.body.success).equal(true);
                    expect(res.body.teachers.length).eql(3);
                    done();
                });
        });
    });
});
