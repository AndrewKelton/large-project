/**
 * Unit Tests — Route Handlers
 * Tests each route handler in isolation by mocking Mongoose models.
 * No real DB connection is made.
 */

const httpMocks = require('node-mocks-http');

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Builds a mock Express req/res pair and calls the given handler,
 * returning a promise that resolves to the mock response.
 */
async function callHandler(handler, { method = 'GET', body = {}, params = {} } = {}) {
    const req = httpMocks.createRequest({ method, body, params });
    const res = httpMocks.createResponse();
    await handler(req, res);
    return res;
}

// ─── Courses Route ────────────────────────────────────────────────────────────
describe('Courses route handlers', () => {
    let Course;

    beforeEach(() => {
        jest.resetModules();
        jest.mock('../../models/course');
        Course = require('../../models/course');
    });

    it('GET / — returns all courses', async () => {
        const fakeCourses = [
            { _id: '1', Name: 'Programming I', Code: 'COP3502' },
            { _id: '2', Name: 'Data Structures', Code: 'COP3530' },
        ];
        Course.find = jest.fn().mockResolvedValue(fakeCourses);

        const router = require('../../api/courses');
        // Extract the GET '/' handler directly from the router stack
        const layer = router.stack.find(
            (l) => l.route && l.route.path === '/' && l.route.methods.get
        );
        const handler = layer.route.stack[0].handle;

        const res = await callHandler(handler);
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res._getData())).toEqual(fakeCourses);
    });

    it('POST / — returns 400 when Name is missing', async () => {
        const router = require('../../api/courses');
        const layer = router.stack.find(
            (l) => l.route && l.route.path === '/' && l.route.methods.post
        );
        const handler = layer.route.stack[0].handle;

        const res = await callHandler(handler, { method: 'POST', body: { Code: 'COP3502' } });
        expect(res.statusCode).toBe(400);
    });

    it('POST / — returns 400 when Code is missing', async () => {
        const router = require('../../api/courses');
        const layer = router.stack.find(
            (l) => l.route && l.route.path === '/' && l.route.methods.post
        );
        const handler = layer.route.stack[0].handle;

        const res = await callHandler(handler, { method: 'POST', body: { Name: 'Programming I' } });
        expect(res.statusCode).toBe(400);
    });

    it('POST / — creates a course and returns 201', async () => {
        const newCourse = { _id: '3', Name: 'Algorithms', Code: 'COP4531' };
        Course.create = jest.fn().mockResolvedValue(newCourse);

        const router = require('../../api/courses');
        const layer = router.stack.find(
            (l) => l.route && l.route.path === '/' && l.route.methods.post
        );
        const handler = layer.route.stack[0].handle;

        const res = await callHandler(handler, {
            method: 'POST',
            body: { Name: 'Algorithms', Code: 'COP4531' },
        });
        expect(res.statusCode).toBe(201);
        expect(JSON.parse(res._getData())).toEqual(newCourse);
    });
});

// ─── Professors Route ─────────────────────────────────────────────────────────
describe('Professors route handlers', () => {
    let Professor;

    beforeEach(() => {
        jest.resetModules();
        jest.mock('../../models/professor');
        Professor = require('../../models/professor');
    });

    it('GET / — returns all professors', async () => {
        const fakeProfessors = [{ _id: '1', First_Name: 'Jane', Last_Name: 'Doe' }];
        Professor.find = jest.fn().mockResolvedValue(fakeProfessors);

        const router = require('../../api/professors');
        const layer = router.stack.find(
            (l) => l.route && l.route.path === '/' && l.route.methods.get
        );
        const handler = layer.route.stack[0].handle;

        const res = await callHandler(handler);
        expect(res.statusCode).toBe(200);
        expect(JSON.parse(res._getData())).toEqual(fakeProfessors);
    });

    it('POST / — returns 400 when First_Name is missing', async () => {
        const router = require('../../api/professors');
        const layer = router.stack.find(
            (l) => l.route && l.route.path === '/' && l.route.methods.post
        );
        const handler = layer.route.stack[0].handle;

        const res = await callHandler(handler, { method: 'POST', body: { Last_Name: 'Doe' } });
        expect(res.statusCode).toBe(400);
    });

    it('POST / — returns 400 when Last_Name is missing', async () => {
        const router = require('../../api/professors');
        const layer = router.stack.find(
            (l) => l.route && l.route.path === '/' && l.route.methods.post
        );
        const handler = layer.route.stack[0].handle;

        const res = await callHandler(handler, { method: 'POST', body: { First_Name: 'Jane' } });
        expect(res.statusCode).toBe(400);
    });

    it('POST / — creates a professor and returns 201', async () => {
        const newProf = { _id: '2', First_Name: 'John', Last_Name: 'Smith' };
        Professor.create = jest.fn().mockResolvedValue(newProf);

        const router = require('../../api/professors');
        const layer = router.stack.find(
            (l) => l.route && l.route.path === '/' && l.route.methods.post
        );
        const handler = layer.route.stack[0].handle;

        const res = await callHandler(handler, {
            method: 'POST',
            body: { First_Name: 'John', Last_Name: 'Smith' },
        });
        expect(res.statusCode).toBe(201);
        expect(JSON.parse(res._getData())).toEqual(newProf);
    });
});
