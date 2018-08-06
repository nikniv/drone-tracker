const http = require('http')
const dgram = require('dgram')
const routes = require('./server/api/routes')
const datagram = require('./server/datagram')

const { HTTP_PORT = 3000, UDP_PORT = 4000 } = process.env

// create an http server
const httpServer = http.createServer(routes)

httpServer.listen(HTTP_PORT, () => {
  console.log(`HTTP server listening at internal port ${HTTP_PORT}`)
})

// create a simple UDP server
const udpServer = dgram.createSocket('udp4')

udpServer.on('error', (err) => {
  console.log(`server error:\n${err.stack}`)
  udpServer.close()
})

udpServer.on('message', datagram)

udpServer.on('listening', () => {
  const address = udpServer.address()
  console.log(`UDP server listening at internal address ${address.address}:${address.port}`)
})

udpServer.bind(UDP_PORT)

module.exports = {
  httpServer,
  udpServer
}
