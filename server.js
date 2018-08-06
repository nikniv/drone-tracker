const http = require('http')
const dgram = require('dgram')

// create a simple http server
const httpServer = http.createServer(function (req, res) {
  res.write('Welcome to drone-tracker app!')
  res.end()
})

httpServer.listen(3000, function () {
  console.log('HTTP server listening at internal port 4000')
})

// create a simple UDP server
const server = dgram.createSocket('udp4')

server.on('error', (err) => {
  console.log(`server error:\n${err.stack}`)
  server.close()
})

server.on('message', (msg, rinfo) => {
  console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`)
})

server.on('listening', () => {
  const address = server.address()
  console.log(`UDP server listening at internal address ${address.address}:${address.port}`)
})

server.bind(4000)
