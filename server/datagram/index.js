const { droneModel } = require('./../api/models')
const { error, errorMessages, logger, validate } = require('./../utils')

module.exports = async function (msg, rinfo) {
  if (msg.length <= 1) return error(errorMessages.EMPTY_UDP_MESSAGE)

  logger(`
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

  if (!message || !validate(message)) {
    return logger(errorMessages.UDP_MESSAGE_VALIDATION_FAILED)
  }

  const result = await droneModel.updateDroneLocation(message)

  logger(`
  ========== LOCATION REPORTED ==========
    uuid:       ${result.uuid}
    lat:        ${result.lat}
    long:       ${result.long}
    updatedAt:  ${result.updatedAt}
  =======================================`)
}
