process.env.NODE_DEV = 'test';

const expect = require('chai').expect;
const request = require('supertest');
const sinon = require('sinon');
const network = require('../fabric/network');
const User = require('../models/User');
const test = require('sinon-test')(sinon, { useFakeTimers: false });

const app = require('../app');

describe('Routes /subject/create', () => {
  describe('#GET /subject/create', () => {
    it(
      'should be success login routes',
      test((done) => {
        request(app)
          .get('/subject/create')
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
      'permission denied with student because it is not admin academy',
      test((done) => {
        request(app)
          .get('/subject/create')
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
      'permission denied with teacher because it is not admin academy',
      test((done) => {
        request(app)
          .get('/subject/create')
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

    it(
      'permission denied with admin student because it is not admin academy',
      test((done) => {
        request(app)
          .get('/subject/create')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjozfSwiaWF0IjoxNTcwNDMxNjA0fQ.z_wj2Vbj6O7sw4n9Jk6QpcUUHnAnYXULScCZSe7c5Zg'
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

  describe('#POST /subject/create', () => {
    let connect;
    let query;
    let createSubject;

    beforeEach(() => {
      connect = sinon.stub(network, 'connectToNetwork');
      createSubject = sinon.stub(network, 'createSubject');
    });

    afterEach(() => {
      connect.restore();
      createSubject.restore();
    });

    it(
      'should be invalid if subjectName is empty',
      test((done) => {
        request(app)
          .post('/subject/create')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4'
          )
          .send({
            subjectName: ''
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
      'should create subject success',
      test((done) => {
        connect.returns({ error: null });
        request(app)
          .post('/subject/create')
          .set(
            'authorization',
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjoxfSwiaWF0IjoxNTcwMTYwNDExfQ.xtzWBCZf0-tJWaVQocE15oeGpiVCMPwdBWxhPMYxWW4'
          )
          .send({
            subjectid: '02',
            subjectname: 'Hyperledger Fabric',
            teacherusername: 'GV01'
          })
          .then((res) => {
            expect(200);
            done();
          });
      })
    );
  });
});

describe('#GET /subject/all', () => {
  let connect;
  let query;

  beforeEach(() => {
    connect = sinon.stub(network, 'connectToNetwork');
    query = sinon.stub(network, 'query');
    query.withArgs('GetAllSubjects');
  });

  afterEach(() => {
    connect.restore();
    query.restore();
  });

  it(
    'should return all subjects',
    test((done) => {
      connect.returns({ error: null });
      query.returns(
        { SubjectID: '00', Name: 'Blockchain', TeacherUsername: 'GV00' },
        { SubjectID: '01', Name: 'Sawtooth', TeacherUsername: 'GV01' }
      );
      request(app)
        .get('/subject/all')
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

  it(
    'fail get all subjects because err connect to blockchain',
    test((done) => {
      connect.returns({ error: 'Error' });
      request(app)
        .get('/subject/all')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjo0fSwiaWF0IjoxNTcwNDMwNzc0fQ.yFZGWt9O605DvZsPxRLDeTqgKi3y1wusXw7hiIUaQVk'
        )
        .expect(500)
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

describe('#GET /subject/:id', () => {
  let connect;
  let query;

  beforeEach(() => {
    connect = sinon.stub(network, 'connectToNetwork');
    query = sinon.stub(network, 'query');
    query.withArgs('QuerySubject');
  });

  afterEach(() => {
    connect.restore();
    query.restore();
  });

  it(
    'should return subject',
    test((done) => {
      connect.returns({ error: null });
      query.returns({ SubjectID: '00', Name: 'Blockchain', TeacherUsername: 'GV00' });
      request(app)
        .get('/subject/00')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjo0fSwiaWF0IjoxNTcwNDMwNzc0fQ.yFZGWt9O605DvZsPxRLDeTqgKi3y1wusXw7hiIUaQVk'
        )
        .then((res) => {
          expect(200);
          done();
        });
    })
  );

  it(
    'subject does not exist in ledger ',
    test((done) => {
      connect.returns({ error: null });
      query.returns(null);
      request(app)
        .get('/subject/00')
        .set(
          'authorization',
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJuYW1lIjoiaG9hbmdkZCIsInBhc3N3b3JkIjoiJDJhJDEwJGhxWnRJd0ZjbDhTTGFVYnhrdVBPRWVLcXZUa25XRm9kalZhWVZkWG9aMEVlSWIzU2pUL2RHIiwibmFtZSI6ImFsaWJhYmEiLCJyb2xlIjo0fSwiaWF0IjoxNTcwNDMwNzc0fQ.yFZGWt9O605DvZsPxRLDeTqgKi3y1wusXw7hiIUaQVk'
        )
        .then((res) => {
          expect(404);
          done();
        });
    })
  );
});
