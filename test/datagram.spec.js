const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const testData = require('./helpers/testData')
const { droneModel } = require('./../server/api/models')
const { sendUDPMessage, closeClient } = require('./helpers/udpClient')

// timeout to be used in test cases to allow for datagram processing
const { UDP_TIMEOUT = 30 } = process.env
// stub to be used during validation tests
let updateDroneLocationStub

const validationFailureHelper = (message, done) => sendUDPMessage(message, () => {
  // using timeout to allow for processing time
  setTimeout(() => {
    expect(global.drones).to.have.length(4)
    expect(updateDroneLocationStub.called).to.equal(false)
    done()
  }, UDP_TIMEOUT)
})

const validationSuccessHelper = (message, done) => sendUDPMessage(message, () => {
  // using timeout to allow for processing time
  setTimeout(() => {
    expect(global.drones).to.have.length(5)
    expect(updateDroneLocationStub.called).to.equal(true)
    done()
  }, UDP_TIMEOUT)
})

describe('Datagram', () => {
  beforeEach((done) => {
    global.drones.push(testData.stationaryDrone)
    done()
  })

  afterEach((done) => {
    global.drones.splice(3, 2)
    done()
  })

  after((done) => {
    closeClient()
    done()
  })

  describe('Location reporting', () => {
    context('data validation', () => {
      beforeEach(() => {
        expect(global.drones).to.have.length(4)
      })

      before((done) => {
        // stub model function because we just want to test validation logic
        updateDroneLocationStub = sinon.stub(droneModel, 'updateDroneLocation')
        updateDroneLocationStub.callsFake((payload) => {
          const drone = { ...payload, updatedAt: new Date() }
          global.drones.push(drone)
          return drone
        })
        done()
      })

      after((done) => {
        updateDroneLocationStub.restore()
        done()
      })

      context('should fail for', () => {
        context('missing data', () => {
          it('empty udp message', (done) => {
            validationFailureHelper('', done)
          })
          it('empty data object', (done) => {
            const message = JSON.stringify({})
            validationFailureHelper(message, done)
          })
          it('missing uuid', (done) => {
            const message = JSON.stringify({ lat: 10.0, long: 20.0 })
            validationFailureHelper(message, done)
          })
          it('missing lat', (done) => {
            const message = JSON.stringify({ uuid: 'test-drone', long: 20.0 })
            validationFailureHelper(message, done)
          })
          it('missing long', (done) => {
            const message = JSON.stringify({ uuid: 'test-drone', lat: 10.0 })
            validationFailureHelper(message, done)
          })
        })

        context('out of range coordinates', () => {
          it('long is over 180.000000', (done) => {
            const message = JSON.stringify({ ...testData.movingDrone, long: 180.000001 })
            validationFailureHelper(message, done)
          })
          it('long is under -180.000000', (done) => {
            const message = JSON.stringify({ ...testData.movingDrone, long: -180.000001 })
            validationFailureHelper(message, done)
          })
          it('lat is over 90.000000', (done) => {
            const message = JSON.stringify({ ...testData.movingDrone, lat: 90.000001 })
            validationFailureHelper(message, done)
          })
          it('lat is under -90.000000', (done) => {
            const message = JSON.stringify({ ...testData.movingDrone, lat: -90.000001 })
            validationFailureHelper(message, done)
          })
        })
      })

      context('should pass when', () => {
        it('long is between 0 and -180.000000', (done) => {
          const message = JSON.stringify({ ...testData.movingDrone, long: -119.1200034 })
          validationSuccessHelper(message, done)
        })
        it('long is between 0 and 180.000000', (done) => {
          const message = JSON.stringify({ ...testData.movingDrone, long: 79.1200034 })
          validationSuccessHelper(message, done)
        })
        it('long is -180.000000', (done) => {
          const message = JSON.stringify({ ...testData.movingDrone, long: -180.000000 })
          validationSuccessHelper(message, done)
        })
        it('long is 180.000000', (done) => {
          const message = JSON.stringify({ ...testData.movingDrone, long: 180.000000 })
          validationSuccessHelper(message, done)
        })
        it('long is 0', (done) => {
          const message = JSON.stringify({ ...testData.movingDrone, long: 0 })
          validationSuccessHelper(message, done)
        })
        it('lat is between 0 and -90.000000', (done) => {
          const message = JSON.stringify({ ...testData.movingDrone, lat: -2.1200034 })
          validationSuccessHelper(message, done)
        })
        it('lat is between 0 and 90.000000', (done) => {
          const message = JSON.stringify({ ...testData.movingDrone, lat: 43.1200034 })
          validationSuccessHelper(message, done)
        })
        it('lat is -90.000000', (done) => {
          const message = JSON.stringify({ ...testData.movingDrone, lat: -90.000000 })
          validationSuccessHelper(message, done)
        })
        it('lat is 90.000000', (done) => {
          const message = JSON.stringify({ ...testData.movingDrone, lat: 90.000000 })
          validationSuccessHelper(message, done)
        })
        it('lat is 0', (done) => {
          const message = JSON.stringify({ ...testData.movingDrone, lat: 0 })
          validationSuccessHelper(message, done)
        })
      })
    })

    it('it should store drone location report', (done) => {
      const { uuid, lat, long } = testData.movingDrone
      const message = JSON.stringify({ uuid, lat, long })
      sendUDPMessage(message, () => {
        // using timeout to allow for processing time
        setTimeout(() => {
          expect(global.drones).to.have.length(5)
          const result = global.drones[4]
          expect(result.uuid).to.equal(uuid)
          expect(result.lat).to.equal(lat)
          expect(result.long).to.equal(long)
          expect(result).to.have.property('updatedAt')
          done()
        }, UDP_TIMEOUT)
      })
    })
  })
})
