const request = require('supertest')
const app = require('../build/app')

describe('Register in APP', () => {
  test('Missing Paramerts', done => {
    request(app)
      .post('/register')
      .send({ username: 'john', firstName: 'Johnny', lastName: 'Jordan' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(response => {
        expect(response.status).toBe(415)
        done()
      })
  })
})
