const request = require('supertest');
const chai = require('chai');
const app = require('../app');
const expect = chai.expect;

describe('API Routes', () => {
  let testUserId = '6583defcf656d5ae3b1034b1';
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
      request(app)
        .get(`/api/users/${testUserId}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body._id).to.equal(testUserId);
          done();
        });
    });
  });

  describe('PUT /api/users/:userId', () => {
    it('should update a user by id', (done) => {
      const testUserId = '6583dd346ac3bcdc43ad9bd7'; 
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
          
          done();
        });
    });
  });

  describe('DELETE /api/users/:userId', () => {
    it('should return a 404 status code if the user is not found', (done) => {
      const nonExistentUserId = '6583e34da69d23c47b5ee096';
  
      request(app)
        .delete(`/api/users/${nonExistentUserId}`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(404);
          done();
        });
    });
  });
  
  });

