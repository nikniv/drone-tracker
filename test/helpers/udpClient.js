const dgram = require('dgram')
const client = dgram.createSocket('udp4')

const sendUDPMessage = (message, callback) => {
  client.send(message, 5001, '0.0.0.0', (err) => {
    if (err) throw err
    callback()
  })
}

const closeClient = () => client.close()

module.exports = {
  sendUDPMessage,
  closeClient
}
