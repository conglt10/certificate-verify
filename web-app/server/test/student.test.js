process.env.NODE_DEV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const sinon = require('sinon');
const network = require('../fabric/network');
const test = require('sinon-test')(sinon, { useFakeTimers: false });

const app = require('../app');

// token of admin student: ...c5Zg
// token of student: ...aQVk
// token of admin academy: ...xWW4
// token of teacher: ...a6fs

describe('GET /student', () => {
  describe('GET /student/:id', () => {
    let connect;
    let query;

    beforeEach(() => {
      connect = sinon.stub(network, 'connectToNetwork');
      query = sinon.stub(network, 'query');

      query.withArgs('QueryStudent', '20156425');
    });

    afterEach(() => {
      connect.restore();
      query.restore();
    });

    it(
      'success query student id with admin',
      test((done) => {
        connect.returns({ error: null });
        query.returns({
          Username: '20156425',
          Fullname: 'Trinh Van Tan',
          Address: '38 Hoang Mai',
          PhoneNumber: '0382794668'
        });
        request(app)
          .get('/student/20156425')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjozfSwiaWF0IjoxNTcwNDMwNTgyfQ.7su0h90mv0_87ZgH_F9lr71qf_JDBXIIfcsSXfKx-DQ'
          )
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );

    it(
      'fail connect to blockchain when query student id with admin',
      test((done) => {
        connect.returns({ error: 'ERROR' });
        request(app)
          .get('/student/20156425')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiYWRtaW4iLCJwYXNzd29yZCI6IiQyYSQxMCRocVp0SXdGY2w4U0xhVWJ4a3VQT0VlS3F2VGtuV0ZvZGpWYVlWZFhvWjBFZUliM1NqVC9kRyIsIm5hbWUiOiJhbGliYWJhIiwicm9sZSI6MX0sImlhdCI6MTU3MDQyMDQ1Mn0.E2_zvod-M9vuiHGI9KEJT0ruW9w6WT8t8X5xiPh9tLc'
          )
          .expect(500)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );

    it(
      'do not exist student id',
      test((done) => {
        connect.returns({ error: null });
        query.returns(null);
        request(app)
          .get('/student/20156425')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4'
          )
          .expect(404)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );

    it(
      'sucess query student id with user',
      test((done) => {
        connect.returns({ error: null });
        query.returns({
          Username: '20156425',
          Fullname: 'Trinh Van Tan',
          Address: '38 Hoang Mai',
          PhoneNumber: '0382794668'
        });
        request(app)
          .get('/student/20156425')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjo0fSwiaWF0IjoxNTcwNDMwNzc0fQ.yFZGWt9O605DvZsPxRLDeTqgKi3y1wusXw7hiIUaQVk'
          )
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );
  });

  describe('GET /student/all', () => {
    let connect;
    let query;
    let allStudent;

    beforeEach(() => {
      connect = sinon.stub(network, 'connectToNetwork');
      query = sinon.stub(network, 'query');

      query.withArgs('GetAllStudents');
    });

    afterEach(() => {
      connect.restore();
      query.restore();
    });

    it(
      'success query all student with admin student',
      test((done) => {
        connect.returns({ error: null });
        query.returns(
          {
            Username: '20161010',
            Fullname: 'Tan Bong Cuoi',
            Address: '144 Xuan Thuy',
            PhoneNumber: '0322794668'
          },
          {
            Username: '20156425',
            Fullname: 'Trinh Van Tan',
            Address: '38 Hoang Mai',
            PhoneNumber: '0382794668'
          }
        );
        request(app)
          .get('/student/all')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjozfSwiaWF0IjoxNTcwNDMxNjA0fQ.z_wj2Vbj6O7sw4n9Jk6QpcUUHnAnYXULScCZSe7c5Zg'
          )
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );

    it(
      'success query all student with admin academy',
      test((done) => {
        connect.returns({ error: null });
        query.returns(
          {
            Username: '20161010',
            Fullname: 'Tan Bong Cuoi',
            Address: '144 Xuan Thuy',
            PhoneNumber: '0322794668'
          },
          {
            Username: '20156425',
            Fullname: 'Trinh Van Tan',
            Address: '38 Hoang Mai',
            PhoneNumber: '0382794668'
          }
        );
        request(app)
          .get('/student/all')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4'
          )
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );

    it(
      'success query all student with teacher',
      test((done) => {
        connect.returns({ error: null });
        query.returns(
          {
            Username: '20161010',
            Fullname: 'Tan Bong Cuoi',
            Address: '144 Xuan Thuy',
            PhoneNumber: '0322794668'
          },
          {
            Username: '20156425',
            Fullname: 'Trinh Van Tan',
            Address: '38 Hoang Mai',
            PhoneNumber: '0382794668'
          }
        );
        request(app)
          .get('/student/all')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoyfSwiaWF0IjoxNTcwNDMxNDM2fQ.UHMvFI3zHDFncCr6ZodNjSZsPhji3ut2Z583iYLa6fs'
          )
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );

    it(
      'unauthorized query all students with student',
      test((done) => {
        request(app)
          .get('/student/all')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjo0fSwiaWF0IjoxNTcwNDMwNzc0fQ.yFZGWt9O605DvZsPxRLDeTqgKi3y1wusXw7hiIUaQVk'
          )
          .expect(401)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );
  });
});

describe('Routes /student/create', () => {
  describe('#GET /student/create', () => {
    it(
      'should be success login routes with admin academy',
      test((done) => {
        request(app)
          .get('/student/create')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4'
          )
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );

    it(
      'should be success login routes with admin student',
      test((done) => {
        request(app)
          .get('/student/create')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjozfSwiaWF0IjoxNTcwNDMxNjA0fQ.z_wj2Vbj6O7sw4n9Jk6QpcUUHnAnYXULScCZSe7c5Zg'
          )
          .expect(200)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );

    it(
      'permission denied with student because it is not admin',
      test((done) => {
        request(app)
          .get('/student/create')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjo0fSwiaWF0IjoxNTcwNDMwNzc0fQ.yFZGWt9O605DvZsPxRLDeTqgKi3y1wusXw7hiIUaQVk'
          )
          .expect(401)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );

    it(
      'permission denied with teacher because it is not admin',
      test((done) => {
        request(app)
          .get('/student/create')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoyfSwiaWF0IjoxNTcwNDMxNDM2fQ.UHMvFI3zHDFncCr6ZodNjSZsPhji3ut2Z583iYLa6fs'
          )
          .expect(401)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );
  });

  describe('#POST /student/create', () => {
    let connect;
    let createStudent;

    beforeEach(() => {
      connect = sinon.stub(network, 'connectToNetwork');
      createStudent = sinon.stub(network, 'createStudent');
    });

    afterEach(() => {
      connect.restore();
      createStudent.restore();
    });

    it(
      'should be invalid if req is empty',
      test((done) => {
        request(app)
          .post('/student/create')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4'
          )
          .send({
            username: '',
            fullname: '',
            address: '',
            phone: 0912547589
          })
          .expect(422)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) {
              return done(err);
            }
            done();
          });
      })
    );

    it(
      'should create student success',
      test((done) => {
        connect.returns({ error: null });
        request(app)
          .post('/student/create')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjozfSwiaWF0IjoxNTcwNDMxNjA0fQ.z_wj2Vbj6O7sw4n9Jk6QpcUUHnAnYXULScCZSe7c5Zg'
          )
          .send({
            username: 'vodanh',
            fullname: 'Vo Danh',
            address: 'Ha Noi',
            phone: 0912547589
          })
          .then((res) => {
            expect(200);
            done();
          });
      })
    );
  });
});
