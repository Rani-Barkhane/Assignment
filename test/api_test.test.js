const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');
const app = require('../app'); // Remove the ".js" extension

chai.use(chaiHttp);
const expect = chai.expect;
// Assuming you have a test user object for scenarios
let testUser = {
  username: 'TestUser',
  age: 25,
  hobbies: ['Reading'],
};

describe('API Tests', () => {
  // Reload data before each test
  before((done) => {
    users = loadData();
    done();
  });

  // Cleanup: Delete the created user after tests
  after((done) => {
    chai
      .request(app)
      .delete(`/api/users/${testUser.id}`)
      .end((err, res) => {
        // Optional: Check if the deletion was successful
        expect(res).to.have.status(204);
        done();
      });
  });

  it('should get all records with a GET api/users request', (done) => {
    chai
      .request(app)
      .get('/api/users')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array').that.is.empty;
        done();
      });
  });

  it('should create a new object by a POST api/users request', (done) => {
    chai
      .request(app)
      .post('/api/users')
      .send(testUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        testUser.id = res.body.id; // Save the generated id for future tests
        done();
      });
  });

  it('should get the created record by its id with a GET api/users/{userId} request', (done) => {
    chai
      .request(app)
      .get(`/api/users/${testUser.id}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal(testUser);
        done();
      });
  });

  it('should update the created record with a PUT api/users/{userId} request', (done) => {
    const updatedData = {
      username: 'UpdatedUser',
      age: 26,
      hobbies: ['Reading', 'Gaming'],
    };

    chai
      .request(app)
      .put(`/api/users/${testUser.id}`)
      .send(updatedData)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.deep.equal({ ...testUser, ...updatedData });
        done();
      });
  });

  it('should return 404 when trying to get a deleted object by id with a GET api/users/{userId} request', (done) => {
    chai
      .request(app)
      .delete(`/api/users/${testUser.id}`)
      .end(() => {
        chai
          .request(app)
          .get(`/api/users/${testUser.id}`)
          .end((err, res) => {
            expect(res).to.have.status(404);
            done();
          });
      });
  });
});
