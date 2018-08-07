// routes
const { droneController } = require('./../controllers')

const router = (request, response) => {
  request.on('error', (err) => {
    console.error(err)
    response.statusCode = 400
    response.end()
  })

  response.on('error', (err) => {
    console.error(err)
  })

  switch (request.method) {
    case 'GET': {
      switch (request.url) {
        case '/': {
          response.write('Welcome to drone-tracker app!')
          response.end()
          break
        }
        case '/drones': {
          droneController.getAllDrones(request, response)
          break
        }
        case '/drones/inactive': {
          droneController.getInactiveDrones(request, response)
          break
        }
        default: {
          response.statusCode = 404
          response.write('404 NOT FOUND')
          response.end()
        }
      }
    }
  }
}

module.exports = router
