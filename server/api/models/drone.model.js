// model
global.drones = [{
  uuid: 'abc',
  lat: 10,
  long: 40,
  updatedAt: new Date()
}, {
  uuid: 'pqr',
  lat: 20,
  long: 50,
  updatedAt: new Date()
}, {
  uuid: 'xyz',
  lat: 31.146576,
  long: -92.497360,
  updatedAt: new Date()
}]

const droneModel = {
  findAllDrones: () => new Promise((resolve) => {
    return resolve(global.drones)
  }),

  findInactiveDrones: () => new Promise((resolve) => {
    // find drones inactive for more than 10 seconds
    const inactive = global.drones.filter(({ updatedAt }) => {
      const epochSeconds = updatedAt.getTime() / 1000
      const timeNow = Date.now() / 1000
      return timeNow - epochSeconds > 10
    })
    return resolve(inactive)
  }),

  updateDroneLocation: ({ uuid, lat, long }) => new Promise((resolve) => {
    const storedDrone = global.drones.find(item => {
      return item.uuid === uuid
    })

    let result
    if (!storedDrone) {
      // create new drone info
      const newDrone = {
        uuid,
        lat,
        long,
        updatedAt: new Date()
      }
      global.drones.push(newDrone)
      result = newDrone
    } else if (storedDrone.lat === lat && storedDrone.long === long) {
      // do nothing
      result = storedDrone
    } else {
      // update drone info
      const updatedDrone = {
        ...storedDrone,
        lat,
        long,
        updatedAt: new Date()
      }

      const index = global.drones.indexOf(storedDrone)
      global.drones.splice(index, 1, updatedDrone)

      result = updatedDrone
    }
    return resolve(result)
  })
}

module.exports = droneModel
