const request = require('supertest');
const chai = require('chai');
const app = require('../app');
const expect = chai.expect;

describe('API Routes', () => {
  describe('GET /api/users', () => {
    it('should return all users', (done) => {
      request(app)
        .get('/api/users')
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe('GET /api/users/:userId', () => {
    it('should return a user by id', (done) => {
      const testUserId = '01281ead-366b-4185-851c-ef60336855d8';
      request(app)
        .get(`/api/users/${testUserId}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.equal(testUserId);
          done();
        });
    });
  });

  describe('PUT /api/users/:userId', () => {
    it('should update a user by id', (done) => {
      const testUserId = '01281ead-366b-4185-851c-ef60336855d8'; 
      const updateData = {
        username: 'Rani Barkhane',
        age: 25,
        hobbies: ['Reading', 'Coding']
      };
  
      request(app)
        .put(`/api/users/${testUserId}`)
        .send(updateData)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.equal(testUserId);
          // Check that the fields have been updated
          expect(res.body.username).to.equal(updateData.username);
          expect(res.body.age).to.equal(updateData.age);
          expect(res.body.hobbies).to.deep.equal(updateData.hobbies);
          done();
        });
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should return a 404 status code if the user is not found', (done) => {
      const nonExistentUserId = '01281ead-366b-4185-851c-ef60336855d88';
  
      request(app)
        .delete(`/api/users/${nonExistentUserId}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  
  });

});