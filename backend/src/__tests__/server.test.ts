import request from 'supertest';
import app from '../server';
import mongoose from 'mongoose';

// Mock mongoose to prevent it from trying to connect to a real database
jest.mock('mongoose', () => {
  const originalMongoose = jest.requireActual('mongoose');
  return {
    ...originalMongoose,
    connect: jest.fn().mockResolvedValue(undefined),
    connection: {
      close: jest.fn().mockResolvedValue(undefined),
    },
  };
});

describe('GET /', () => {
  it('should respond with a 200 status code and the correct message', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Project Saga API is running!');
  });
});
