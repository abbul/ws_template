const request = require('supertest')
const app = require('../build/app')

describe('run APP', () => {
  test('path / ', done => {
    request(app)
      .get('/')
      .then(resAPP => {
        expect(resAPP.body.result).toEqual('ok')
        done()
      })
  })
})
