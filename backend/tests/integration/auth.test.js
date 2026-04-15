/**
 * Integration Tests — Auth endpoints (/api/register, /api/login)
 * Uses mongodb-memory-server so no real DB is required.
 */

const request = require('supertest');
const app = require('../../app');
const db = require('./dbHelper');

beforeAll(async () => { await db.connect(); });
afterEach(async () => { await db.clearDatabase(); });
afterAll(async () => { await db.disconnect(); });

// ─── Registration ─────────────────────────────────────────────────────────────
describe('POST /api/register', () => {
    const validUser = {
        First_Name: 'John',
        Last_Name: 'Knight',
        Username: 'jknight',
        Password: 'securePass1',
        Email: 'jknight@ucf.edu',
    };

    it('registers a new user and returns 201 with a success message', async () => {
        const res = await request(app).post('/api/register').send(validUser);
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toMatch(/account created/i);
    });

    it('returns 400 when Username is missing', async () => {
        const { Username, ...body } = validUser;
        const res = await request(app).post('/api/register').send(body);
        expect(res.statusCode).toBe(400);
    });

    it('returns 400 when Email is invalid', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ ...validUser, Email: 'not-an-email' });
        expect(res.statusCode).toBe(400);
    });

    it('returns 400 when Password is too short', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({ ...validUser, Password: 'abc' });
        expect(res.statusCode).toBe(400);
    });

    it('returns 400 when Username is already taken', async () => {
        await request(app).post('/api/register').send(validUser);
        const res = await request(app)
            .post('/api/register')
            .send({ ...validUser, Email: 'other@ucf.edu' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/username already taken/i);
    });

    it('returns 400 when Email is already registered', async () => {
        await request(app).post('/api/register').send(validUser);
        const res = await request(app)
            .post('/api/register')
            .send({ ...validUser, Username: 'otheruser' });
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/email already registered/i);
    });
});

// ─── Login ────────────────────────────────────────────────────────────────────
describe('POST /api/login', () => {
    const registerPayload = {
        First_Name: 'Jane',
        Last_Name: 'Knight',
        Username: 'janeknight',
        Password: 'password123',
        Email: 'jane@ucf.edu',
    };

    beforeEach(async () => {
        await request(app).post('/api/register').send(registerPayload);
    });

    it('returns 200 with a JWT token on valid credentials', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ Username: 'janeknight', Password: 'password123' });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
        expect(res.body.message).toMatch(/login successful/i);
    });

    it('returns 400 when username does not exist', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ Username: 'nobody', Password: 'password123' });
        expect(res.statusCode).toBe(400);
    });

    it('returns 400 when password is incorrect', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({ Username: 'janeknight', Password: 'wrongpassword' });
        expect(res.statusCode).toBe(400);
    });
});
