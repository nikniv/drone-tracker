const { errorMessages } = require('./constants')

const error = (err) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(new Error(err))
  }
  return false
}

const logger = (content) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(content)
  }
}

const validate = (message) => {
  const { uuid, lat, long } = message

  if (!uuid || typeof uuid !== 'string' || !uuid.trim().length) {
    return error(errorMessages.MISSING_OR_INVALID_UUID)
  }
  if (typeof lat !== 'number' || lat < -90.000000 || lat > 90.000000) {
    return error(errorMessages.MISSING_OR_INVALID_LAT)
  }
  if (typeof long !== 'number' || long < -180.000000 || long > 180.000000) {
    return error(errorMessages.MISSING_OR_INVALID_LONG)
  }

  return true
}

module.exports = {
  error,
  logger,
  validate
}
