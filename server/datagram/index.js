const { droneModel } = require('./../api/models')
const { error, validate } = require('./utils')

module.exports = async function (msg, rinfo) {
  if (msg.length <= 1) return error('Empty UDP message')

  console.log(`
  ========== DATAGRAM RECEIVED ==========
    size:   ${rinfo.size} bytes
    from:   ${rinfo.address}:${rinfo.port}
    msg:    ${msg}
  =======================================`)

  const message = JSON.parse(msg, (key, value) =>
    (key === 'lat' || key === 'long') && typeof parseFloat(value) === 'number'
      ? parseFloat(value)
      : value
  )
  if (!validate(message)) {
    return error('UDP message validation failed')
  }

  const result = await droneModel.updateDroneLocation(message)

  console.log(`
  ========== LOCATION REPORTED ==========
    uuid:       ${result.uuid}
    lat:        ${result.lat}
    long:       ${result.long}
    updatedAt:  ${result.updatedAt}
  =======================================`)
}
