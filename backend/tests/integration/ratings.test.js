/**
 * Integration Tests — Ratings endpoint (/api/ratings)
 * Seeds a user and course before each test.
 */

const request = require('supertest');
const app = require('../../app');
const db = require('./dbHelper');
const Course = require('../../models/course');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

let userId;
let courseId;

beforeAll(async () => { await db.connect(); });

beforeEach(async () => {
    await db.clearDatabase();

    const course = await Course.create({ Name: 'Programming I', Code: 'COP3502' });
    courseId = course._id.toString();

    const hashed = await bcrypt.hash('password123', 10);
    const user = await User.create({
        First_Name: 'Test',
        Last_Name: 'User',
        Username: 'testuser',
        Password: hashed,
        Email: 'test@ucf.edu',
    });
    userId = user._id.toString();
});

afterAll(async () => { await db.disconnect(); });

const baseRating = () => ({
    User: userId,
    Course: courseId,
    Option_A_Count: 4,
    Option_B_Count: 3,
    Option_C_Count: 5,
    Option_D_Count: 2,
    Option_E_Count: 1,
});

describe('POST /api/ratings', () => {
    it('creates a rating and returns 201', async () => {
        const res = await request(app).post('/api/ratings').send(baseRating());
        expect(res.statusCode).toBe(201);
        expect(res.body._id).toBeDefined();
        expect(res.body.Option_A_Count).toBe(4);
    });

    it('returns 400 when User is missing', async () => {
        const { User: _, ...body } = baseRating();
        const res = await request(app).post('/api/ratings').send(body);
        expect(res.statusCode).toBe(400);
    });

    it('returns 400 when Course is missing', async () => {
        const { Course: _, ...body } = baseRating();
        const res = await request(app).post('/api/ratings').send(body);
        expect(res.statusCode).toBe(400);
    });

    it('returns 404 when User ID does not exist', async () => {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoose = require('mongoose');
        const fakeUserId = new mongoose.Types.ObjectId().toString();
        const res = await request(app)
            .post('/api/ratings')
            .send({ ...baseRating(), User: fakeUserId });
        expect(res.statusCode).toBe(404);
    });

    it('returns 400 when user tries to rate the same course twice', async () => {
        await request(app).post('/api/ratings').send(baseRating());
        const res = await request(app).post('/api/ratings').send(baseRating());
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/already rated/i);
    });

    it('updates the user Rated_Courses array after rating', async () => {
        await request(app).post('/api/ratings').send(baseRating());
        const updatedUser = await User.findById(userId);
        const ratedIds = updatedUser.Rated_Courses.map((id) => id.toString());
        expect(ratedIds).toContain(courseId);
    });
});
