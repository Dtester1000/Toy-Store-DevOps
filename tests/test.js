const request = require('supertest');
const express = require('express');
const router = require('./routes/my_router');
const User = require('../models/userModel');
const auth = require('../middlewares/Auth');

jest.mock('../models/userModel');
jest.mock('../middlewares/Auth');

const app = express();
app.use(express.json());
app.use('/', router);

describe('Authentication Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /register', () => {
    const validUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    it('should register a new user with valid data', async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save.mockResolvedValue(true);

      const response = await request(app)
        .post('/register')
        .send(validUser);

      expect(response.statusCode).toBe(201);
      expect(response.body).toEqual({ message: 'User registered successfully' });
      expect(User.prototype.save).toHaveBeenCalled();
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/register')
        .send({ email: 'invalid' });

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toMatch(/validation error/i);
    });

    it('should return 400 for existing user', async () => {
      User.findOne.mockResolvedValue(validUser);

      const response = await request(app)
        .post('/register')
        .send(validUser);

      expect(response.statusCode).toBe(400);
      expect(response.body.error).toBe('User already exists');
    });
  });

  describe('POST /login', () => {
    const validCredentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    beforeEach(() => {
      auth.comparePassword.mockResolvedValue(true);
      auth.generateToken.mockReturnValue('mock-token');
    });

    it('should login with valid credentials', async () => {
      User.findOne.mockResolvedValue({ email: validCredentials.email, password: 'hashed' });

      const response = await request(app)
        .post('/login')
        .send(validCredentials);

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toBe('Logged in successfully');
      expect(auth.setTokenCookie).toHaveBeenCalledWith(
        expect.any(Object), 
        'mock-token'
      );
    });

    it('should return 401 for invalid credentials', async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/login')
        .send(validCredentials);

      expect(response.statusCode).toBe(401);
    });

    it('should return 401 for incorrect password', async () => {
      User.findOne.mockResolvedValue({ email: validCredentials.email, password: 'hashed' });
      auth.comparePassword.mockResolvedValue(false);

      const response = await request(app)
        .post('/login')
        .send(validCredentials);

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /logout', () => {
    it('should clear the access token cookie', async () => {
      const response = await request(app)
        .post('/logout')
        .send();

      expect(response.statusCode).toBe(200);
      expect(response.headers['set-cookie']).toEqual(
        expect.arrayContaining([
          expect.stringContaining('access_token=;')
        ])
      );
    });
  });
});
