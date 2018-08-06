const chai = require('chai')
const request = require('supertest')
const expect = chai.expect
const { httpServer: app } = require('./../app')

describe('Drones', () => {
  const tenSecondsAgo = new Date((Date.now() / 1000 - 10) * 1000)
  const stationaryDrone = {
    uuid: 'stationary-drone',
    lat: 20,
    long: 20,
    updatedAt: tenSecondsAgo
  }
  const movingDrone = {
    uuid: 'moving-drone',
    lat: 30,
    long: 30,
    updatedAt: new Date()
  }

  beforeEach((done) => {
    global.drones.push(stationaryDrone)
    global.drones.push(movingDrone)
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
          expect(res.body[0].uuid).to.equal(stationaryDrone.uuid)
          done()
        })
    })
  })
})
