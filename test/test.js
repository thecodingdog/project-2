const request = require('supertest')
const expect = require('chai').expect
const app = require('../app')
// import * as supertest from 'supertest'

describe('GET static pages', function () {
  describe('getting homepage', function () {
    this.timeout(5000)
    it('should response 200', function (done) {
      request(app)
      .get('/')
      .end(function (err, response) {
        if (err) console.log(err)
        expect(response.status).to.equal(200)
        done()
      })
    })
  })
  describe('getting login page', function () {
    this.timeout(5000)
    it('should response 200', function (done) {
      request(app)
      .get('/userAuth/login')
      .end(function (err, response) {
        if (err) console.log(err)
        expect(response.status).to.equal(200)
        done()
      })
    })
  })
  describe('getting register page', function () {
    this.timeout(5000)
    it('should response 200', function (done) {
      request(app)
      .get('/userAuth/register')
      .end(function (err, response) {
        if (err) console.log(err)
        expect(response.status).to.equal(200)
        done()
      })
    })
  })
  describe('negative test for error page', function () {
    this.timeout(5000)
    it('should response 404', function (done) {
      request(app)
      .get('/userAuth/bla')
      .end(function (err, response) {
        if (err) console.log(err)
        expect(response.status).to.equal(404)
        done()
      })
    })
  })
})
// test Auth
describe('TEST PRIVATE PAGES', function () {
  describe('negative test login', function () {
    this.timeout(5000)
    const authenticatedUser = request.agent(app)
    before(function (done) {
      authenticatedUser
      .post('/userAuth/login')
      .send({email: 'wz@gmail.com', password: ''})
      .end(function (err, response) {
        if (err) console.log(err)
        expect(response.status).to.equal(302)
        done()
      })
    })

    describe('accessing private page favrecipe', function () {
      it('should response 302', function (done) {
        authenticatedUser
        .get('/favrecipe')
        .end((err, res) => {
          if (err) console.log(err)
          expect(res.status).to.equal(302)
          done()
        })
      })
    })
  })
  describe('positive test login', function () {
    this.timeout(5000)
    const authenticatedUser = request.agent(app)
    before(function (done) {
      authenticatedUser
      .post('/userAuth/login')
      .send({email: 'wz@gmail.com', password: '123456'})
      .end(function (err, response) {
        if (err) console.log(err)
        expect(response.status).to.equal(302)
        done()
      })
    })

    describe('CRUD recipe', function () {
      describe('POST recipe', function () {
        it('should response 200 & get back testrecipe', function (done) {
          authenticatedUser
          .post('/favrecipe/add')
          .send({name: 'testrecipe'})
          .end((err, res) => {
            if (err) console.log(err)
            expect(res.status).to.equal(200)
            expect(res.body).to.have.property('status')
            done()
          })
        })
      })

      describe('GET recipe', function () {
        it('should response 200', function (done) {
          authenticatedUser
        .get(`/favrecipe/testrecipe`)
        .end((err, res) => {
          if (err) console.log(err)
          expect(res.status).to.equal(200)
          expect(res.body.pop().name).to.equal('testrecipe')
          done()
        })
        })
      })
    })
  })
})
// to test delete for recipe, remove all 'test recipes', then post one, and check that there's only array of 1
// test CRUD ingredients
