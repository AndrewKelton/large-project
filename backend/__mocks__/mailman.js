// Manual mock for api/mailman.js
// Prevents real email sending during tests.
const sendMail = jest.fn().mockResolvedValue({ id: 'mock-email-id' });
module.exports = { sendMail };
