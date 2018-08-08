const { droneModel } = require('./../models')

module.exports = {
  getAllDrones: async function (req, res) {
    const results = await droneModel.findAllDrones()

    res.setHeader('Content-Type', 'application/json')
    res.writeHead(200)
    res.write(JSON.stringify(results))
    res.end()
    return res
  },

  getInactiveDrones: async function (req, res) {
    const results = await droneModel.findInactiveDrones()

    res.setHeader('Content-Type', 'application/json')
    res.writeHead(200)
    res.write(JSON.stringify(results))
    res.end()
    return res
  }
}
