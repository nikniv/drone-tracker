const dgram = require('dgram')
const client = dgram.createSocket('udp4')
const { UDP_PORT = 4000 } = process.env

const sendUDPMessage = (message, callback) => {
  client.send(message, UDP_PORT, '0.0.0.0', (err) => {
    if (err) throw err
    callback()
  })
}

const closeClient = () => client.close()

module.exports = {
  sendUDPMessage,
  closeClient
}
