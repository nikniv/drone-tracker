const tenSecondsAgo = new Date((Date.now() / 1000 - 10) * 1000)

const movingDrone = {
  uuid: 'moving-drone',
  lat: 30,
  long: 30,
  updatedAt: new Date()
}

const stationaryDrone = {
  uuid: 'stationary-drone',
  lat: 20,
  long: 20,
  updatedAt: tenSecondsAgo
}

module.exports = {
  movingDrone,
  stationaryDrone,
  tenSecondsAgo
}
