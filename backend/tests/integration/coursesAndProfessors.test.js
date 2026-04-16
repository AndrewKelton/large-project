/**
 * Integration Tests — Courses & Professors endpoints
 */

const request = require('supertest');
const app = require('../../app');
const db = require('./dbHelper');

beforeAll(async () => { await db.connect(); });
afterEach(async () => { await db.clearDatabase(); });
afterAll(async () => { await db.disconnect(); });

// ─── Courses ──────────────────────────────────────────────────────────────────
describe('Courses API', () => {
    it('GET /api/courses — returns empty array when no courses exist', async () => {
        const res = await request(app).get('/api/courses');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('POST /api/courses — creates a course and returns 201', async () => {
        const res = await request(app)
            .post('/api/courses')
            .send({ Name: 'Programming I', Code: 'COP3502' });
        expect(res.statusCode).toBe(201);
        expect(res.body.Name).toBe('Programming I');
        expect(res.body.Code).toBe('COP3502');
        expect(res.body._id).toBeDefined();
    });

    it('GET /api/courses — returns created courses', async () => {
        await request(app).post('/api/courses').send({ Name: 'Programming I', Code: 'COP3502' });
        await request(app).post('/api/courses').send({ Name: 'Data Structures', Code: 'COP3530' });

        const res = await request(app).get('/api/courses');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('POST /api/courses — returns 400 when Name is missing', async () => {
        const res = await request(app).post('/api/courses').send({ Code: 'COP3502' });
        expect(res.statusCode).toBe(400);
    });

    it('POST /api/courses — returns 400 when Code is missing', async () => {
        const res = await request(app).post('/api/courses').send({ Name: 'Programming I' });
        expect(res.statusCode).toBe(400);
    });
});

// ─── Professors ───────────────────────────────────────────────────────────────
describe('Professors API', () => {
    it('GET /api/professors — returns empty array when no professors exist', async () => {
        const res = await request(app).get('/api/professors');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('POST /api/professors — creates a professor and returns 201', async () => {
        const res = await request(app)
            .post('/api/professors')
            .send({ First_Name: 'Jane', Last_Name: 'Doe' });
        expect(res.statusCode).toBe(201);
        expect(res.body.First_Name).toBe('Jane');
        expect(res.body.Last_Name).toBe('Doe');
        expect(res.body._id).toBeDefined();
    });

    it('GET /api/professors — returns all created professors', async () => {
        await request(app).post('/api/professors').send({ First_Name: 'Jane', Last_Name: 'Doe' });
        await request(app).post('/api/professors').send({ First_Name: 'John', Last_Name: 'Smith' });

        const res = await request(app).get('/api/professors');
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
    });

    it('POST /api/professors — returns 400 when First_Name is missing', async () => {
        const res = await request(app).post('/api/professors').send({ Last_Name: 'Doe' });
        expect(res.statusCode).toBe(400);
    });

    it('POST /api/professors — returns 400 when Last_Name is missing', async () => {
        const res = await request(app).post('/api/professors').send({ First_Name: 'Jane' });
        expect(res.statusCode).toBe(400);
    });
});
