import request from 'supertest';
import supertest from "supertest";
import app from "../../../main/app";
const router = supertest(app);

describe('CompanyLookupController', () => {
  test('GET /limited/company-number', async () => {
    const res = await request(app).get('/register-acsp/limited/company-number');
    expect(res.status).toBe(200);//render company number page

  });

  test('POST /limited/company-number', async () => {
    const res = await request(app).post('/register-acsp/limited/company-number').send({ companyNumber: 'NI038379' });
    expect(res.status).toBe(302); // Redirect status code - valid company number

  });

  test('POST /limited/company-number', async () => {
    const res = await request(app).post('/register-acsp/limited/company-number').send({ companyNumber: '' });
    expect(res.status).toBe(400); // Bad request status code -invalid company number

  });

  test('POST /limited/company-number', async () => {
    const res = await request(app).post('/register-acsp/limited/company-number').send({ companyNumber: '12345678' });
    expect(res.status).toBe(400); // Bad request status code -invalid company number

  });
});