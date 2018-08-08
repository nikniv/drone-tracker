const chai = require('chai')
const request = require('supertest')
const expect = chai.expect
const testData = require('./helpers/testData')
const { httpServer: app } = require('./../app')

describe('Drones REST API', () => {
  beforeEach((done) => {
    global.drones.push(testData.stationaryDrone)
    global.drones.push(testData.movingDrone)
    done()
  })

  afterEach(() => {
    global.drones.splice(3, 2)
  })

  describe('/GET Drones', () => {
    it('it should GET all drones', (done) => {
      request(app)
        .get('/drones')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err
          expect(res.body.length).to.equal(5)
          done()
        })
    })
  })

  describe('/GET Inactive Drones', () => {
    it('it should GET all inactive drones', (done) => {
      request(app)
        .get('/drones/inactive')
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          if (err) throw err
          expect(res.body.length).to.equal(1)
          const result = res.body[0]
          const secondsSinceUpdate = (Date.now() - new Date(result.updatedAt).getTime()) / 1000
          expect(result.uuid).to.equal(testData.stationaryDrone.uuid)
          expect(result.lat).to.equal(testData.stationaryDrone.lat)
          expect(result.long).to.equal(testData.stationaryDrone.long)
          expect(secondsSinceUpdate).to.be.gte(10)
          done()
        })
    })
  })
})
