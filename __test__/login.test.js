const request = require('supertest')
const app = require('../build/app')

describe('Login in APP', () => {
  test('Without username or password', done => {
    request(app)
      .post('/login')
      .send({ password: 'asv' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(resAPP => {
        expect(resAPP.body.result).toEqual('without_parameters')
        done()
      })
  })

  test('User no found', done => {
    request(app)
      .post('/login')
      .send({ username: 'asd', password: 'asv' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(resAPP => {
        expect(resAPP.body.result).toEqual('user_not_found')
        done()
      })
  })

  test('Password Invalid', done => {
    request(app)
      .post('/login')
      .send({ username: 'Abbul', password: '123' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(resAPP => {
        expect(resAPP.body.result).toEqual('password_invalid')
        done()
      })
  })

  test('Login Success', done => {
    request(app)
      .post('/login')
      .send({ username: 'abbul', password: 'asv' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(resAPP => {
        expect(resAPP.body.result).toEqual('user_loged')
        done()
      })
  })
})
