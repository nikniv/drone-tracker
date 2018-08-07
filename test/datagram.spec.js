const chai = require('chai')
const expect = chai.expect
const sendUDPMessage = require('./helpers/udpClient')

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
    long: 30
  }

  beforeEach((done) => {
    global.drones.push(stationaryDrone)
    done()
  })

  afterEach(() => {
    global.drones.splice(3, 2)
  })

  describe('Location Reporting', () => {
    it('it should store drone location report', (done) => {
      const message = JSON.stringify(movingDrone)
      sendUDPMessage(message, () => {
        // using timeout to allow for processing time
        setTimeout(() => {
          expect(global.drones).to.have.length(5)
          done()
        }, 30)
      })
    })
  })
})
