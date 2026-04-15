/**
 * Unit Tests — Mongoose Models
 * Tests schema validation in isolation without a real database.
 * Uses jest.mock to prevent any actual DB connection.
 */

const mongoose = require('mongoose');

// ─── User Model ──────────────────────────────────────────────────────────────
describe('User model — schema validation', () => {
    const User = require('../../models/user');

    it('creates a valid user document', () => {
        const user = new User({
            Username: 'testuser',
            Password: 'hashedpass123',
            Email: 'test@ucf.edu',
            First_Name: 'Test',
            Last_Name: 'User',
        });
        const err = user.validateSync();
        expect(err).toBeUndefined();
    });

    it('fails validation when Username is missing', () => {
        const user = new User({
            Password: 'hashedpass123',
            Email: 'test@ucf.edu',
        });
        const err = user.validateSync();
        expect(err.errors['Username']).toBeDefined();
    });

    it('fails validation when Password is missing', () => {
        const user = new User({
            Username: 'testuser',
            Email: 'test@ucf.edu',
        });
        const err = user.validateSync();
        expect(err.errors['Password']).toBeDefined();
    });

    it('fails validation when Email is missing', () => {
        const user = new User({
            Username: 'testuser',
            Password: 'hashedpass123',
        });
        const err = user.validateSync();
        expect(err.errors['Email']).toBeDefined();
    });

    it('defaults isEmailVerified to false', () => {
        const user = new User({
            Username: 'testuser',
            Password: 'hashedpass123',
            Email: 'test@ucf.edu',
        });
        expect(user.isEmailVerified).toBe(false);
    });

    it('defaults Date_Created to a Date', () => {
        const user = new User({
            Username: 'testuser',
            Password: 'hashedpass123',
            Email: 'test@ucf.edu',
        });
        expect(user.Date_Created).toBeInstanceOf(Date);
    });
});

// ─── Course Model ─────────────────────────────────────────────────────────────
describe('Course model — schema validation', () => {
    const Course = require('../../models/course');

    it('creates a valid course document', () => {
        const course = new Course({ Name: 'Programming I', Code: 'COP3502' });
        const err = course.validateSync();
        expect(err).toBeUndefined();
    });

    it('fails validation when Name is missing', () => {
        const course = new Course({ Code: 'COP3502' });
        const err = course.validateSync();
        expect(err.errors['Name']).toBeDefined();
    });

    it('fails validation when Code is missing', () => {
        const course = new Course({ Name: 'Programming I' });
        const err = course.validateSync();
        expect(err.errors['Code']).toBeDefined();
    });
});

// ─── Professor Model ──────────────────────────────────────────────────────────
describe('Professor model — schema validation', () => {
    const Professor = require('../../models/professor');

    it('creates a valid professor document', () => {
        const prof = new Professor({ First_Name: 'Jane', Last_Name: 'Doe' });
        const err = prof.validateSync();
        expect(err).toBeUndefined();
    });

    it('fails validation when First_Name is missing', () => {
        const prof = new Professor({ Last_Name: 'Doe' });
        const err = prof.validateSync();
        expect(err.errors['First_Name']).toBeDefined();
    });

    it('fails validation when Last_Name is missing', () => {
        const prof = new Professor({ First_Name: 'Jane' });
        const err = prof.validateSync();
        expect(err.errors['Last_Name']).toBeDefined();
    });
});

// ─── Rating Model ─────────────────────────────────────────────────────────────
describe('Rating model — schema validation', () => {
    const Rating = require('../../models/rating');

    const validBase = () => ({
        Course: new mongoose.Types.ObjectId(),
        User: new mongoose.Types.ObjectId(),
        Option_A_Count: 4,
        Option_B_Count: 3,
        Option_C_Count: 5,
        Option_D_Count: 2,
        Option_E_Count: 1,
    });

    it('creates a valid rating document', () => {
        const rating = new Rating(validBase());
        const err = rating.validateSync();
        expect(err).toBeUndefined();
    });

    it('fails validation when Course is missing', () => {
        const data = validBase();
        delete data.Course;
        const rating = new Rating(data);
        const err = rating.validateSync();
        expect(err.errors['Course']).toBeDefined();
    });

    it('fails validation when User is missing', () => {
        const data = validBase();
        delete data.User;
        const rating = new Rating(data);
        const err = rating.validateSync();
        expect(err.errors['User']).toBeDefined();
    });

    it('fails validation when Option_A_Count is below 1', () => {
        const rating = new Rating({ ...validBase(), Option_A_Count: 0 });
        const err = rating.validateSync();
        expect(err.errors['Option_A_Count']).toBeDefined();
    });

    it('fails validation when Option_B_Count exceeds 5', () => {
        const rating = new Rating({ ...validBase(), Option_B_Count: 6 });
        const err = rating.validateSync();
        expect(err.errors['Option_B_Count']).toBeDefined();
    });

    it('fails validation when Option_C_Count is not an integer', () => {
        const rating = new Rating({ ...validBase(), Option_C_Count: 3.5 });
        const err = rating.validateSync();
        expect(err.errors['Option_C_Count']).toBeDefined();
    });

    it('defaults Professor_Rated to false', () => {
        const rating = new Rating(validBase());
        expect(rating.Professor_Rated).toBe(false);
    });
});
