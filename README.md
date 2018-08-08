# Drone Tracker
Track location of drones in real-time.

## Assumptions

- Latitude range: `-90.000000` to `90.000000`
- Longitude range: `-180.000000` to `180.000000`
- Drone location data reporting protocol: JSON string sent over UDP
- Test cases cover REST API endpoints and Datagram module (for location reporting)
- Standard ESLint guidelines are used for code syntax
- Data is stored locally in app, under global variable named `global.drones`
- To prepare for future database IO, async/await and Promise are used in controller and model functions

**Note:** UDP was used as protocol of choice because:
- It has a comparatively smaller minimum packet size
- Since location is transmitted every second, Drones can simply transmit their location to server without needing acknowledgement. This reduces modem network traffic costs.
- Following this concept, we can further implement other compression methods like gzip to compress location data even more

# Container setup

Docker images for the app can be created for two environments: deployment and test.
There are two Dockerfiles for each kind of setup in the prjoect directory.

## Environment variables

You can optionally set environment vaiables for the following in the Dockerfile:
- `HTTP_PORT`: Internal port on which HTTP server will run
- `UDP_PORT`: Internal port on which UDP server will run
- `NODE_ENV`: This is set to `test` for unit test mode
- `UDP_TIMEOUT`: Needed for unit testing of Datagram module, defaults to `30` (value is in milliseconds)

## Deployment Mode

### Build docker image

```
docker build -t drone-tracker .
```

### Deploy docker container

The following commands will configure the app to listen to:
- HTTP requests on: `http://localhost:8080`
- UDP messages on: `http://localhost:8081`

#### As a daemon in the background

```
docker run --rm -p 8080:3000 -p 8081:4000/udp -d drone-tracker
```

#### In the foreground

```
docker run --rm -p 8080:3000 -p 8081:4000/udp drone-tracker
```

The `-p` flag is used to bind internal port of container to its external port, where we can actually access the app from outside. 
The `--rm` flag removes container after exiting to prevent container and memory clutter. `-d` denotes whether container is run in daemon mode.

### Stop docker container

```
docker ps
docker stop <CONTAINER ID>
```

## Unit Test Mode

The following Docker commands will build and run the specified `npm test` script.

```
docker build -t drone-tracker-test -f Dockerfile.test .
docker run --rm drone-tracker-test
```

You can also run tests locally with `npm run test:local` if needed.

Test files are located in `/test` folder.

# API Usage

## UDP Datagrams

The application accepts UDP data packets containing drone location information.

The data packet needs to be in stringified JSON format, containing `uuid`, `lat` and `long` values.

e.g.

```
  {
    "uuid": "my-drone",
    "lat": -31.213123,
    "long": 89.189876
  }
```

To test the datagram module, you can send UDP messages using the terminal, as follows:

```
echo '{ "uuid": "my-drone", "lat": -31.213123, "long": 89.189876 }' > /dev/udp/0.0.0.0/8081
```

## REST API

### Get a list of:

- **All drones**: `GET`: `http://localhost:8080/drones`
- **Inactive drones**: `GET`: `http://localhost:8080/drones/incative`

You can test these endpoints using `curl` on the terminal:
```
curl -G http://localhost:8080/drones
curl -G http://localhost:8080/drones/incative
```

### Size of incoming data packet
When drones report their location over the UDP channel, the size of the message content is logged on the server console, like so:

```
  ========== DATAGRAM RECEIVED ==========
    size:   64 bytes
    from:   127.0.0.1:51990
    msg:    { "uuid": "abc", "lat": 31.213123213, "long": -19.18987987988 }
  =======================================
```

This is obtained from the implementation of the `dgram` node module. See [here](https://nodejs.org/api/dgram.html#dgram_event_message). 
If we need to implement any further allowance logic based on message size, it can be done here.

## Lint

- Run ESLint tool: `npm run lint`
- Autofix some lint issues: `npm run lintfix`
