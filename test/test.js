const request = require('supertest')
const expect = require('chai').expect
const app = require('../app')
// import * as supertest from 'supertest'

// console.log(app)

describe('GET static pages', function () {
  describe('/', function () {
    it('should response 302', function (done) {
      request(app)
      .get('/')
      .end(function (err, response) {
        expect(response.status).to.equal(302)
        done()
    })
  })
})
//   describe('/home/all', function () {
//     it('should response 200', function (done) {
//       request(app)
//       .get('/home/all')
//       .end(function (err, response) {
//         expect(response.status).to.equal(200)
//         done()
//     })
//   })
// })
  // get home page feature recipe to be same as get all recipe length (store this)

  // get home one recipe should have property of ingredients
  // search recipe should get 200 and an array of values
  // post recipe should get length of recipe from get + 1
  // delete recipe
  // ingredients test
})
