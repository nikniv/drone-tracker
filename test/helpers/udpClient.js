const dgram = require('dgram')

const client = dgram.createSocket('udp4')

const sendUDPMessage = async function (message, callback) {
  client.send(message, 5001, '0.0.0.0', (err) => {
    if (err) throw err
    client.close()
    callback()
  })
}

module.exports = sendUDPMessage
