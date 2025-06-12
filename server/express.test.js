const request = require('supertest');
const {app, server} = require('./server');

describe('Express: Server listening test', ()=>{
    afterAll(()=>{
        server.close();
    });
    test('Server is listening on port 8000', async () =>{
        const response = await request(app).get('/');
        expect(response.status).toBe(200);
    });
});