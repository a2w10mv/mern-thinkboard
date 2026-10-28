import request from 'supertest';
import express from 'express';
import { connectDB, closeDB, clearDB } from './test-setup.js';
import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import User from './models/User.js';
import Note from './models/Note.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);

describe('Auth & Notes Integration', () => {
  beforeAll(async () => await connectDB());
  afterAll(async () => await closeDB());
  afterEach(async () => await clearDB());

  it('should register and login', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'testuser', password: 'password123' })
      .expect(201);

    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'testuser', password: 'password123' })
      .expect(200);

    expect(res.body.token).toBeDefined();
  });
});
