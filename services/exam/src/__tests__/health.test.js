const request = require('supertest');
const app = require('./../index'); // Import your Express app

describe('Health Route', () => {
  it('should respond with status 200 and a health message', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Hello from Exam-Service and Health Ok');
  });
});