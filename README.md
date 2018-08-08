# Drone Tracker
Track location of drones in real-time.

## Assumptions

- Latitude range: `-90.000000` - `90.000000`
- Longitude range: `-180.000000` - `180.000000`
- Drone location data reporting: JSON string sent over UDP
- Test cases cover REST API endpoints and Datagram module (for location reporting)

# App setup

### Build docker image

```
docker build -t drone-tracker .
```

### Deploy docker container

The following commands will configure the app to listen to:
- HTTP requests on: `http://localhost:8080`
- UDP messages on: `http://localhost:8081`

The `--rm` flag removes container after exiting to prevent container and memory clutter.

#### As a daemon in the background

```
docker run --rm -p 8080:3000 -p 8081:4000/udp -d drone-tracker
```

#### In the foreground

```
docker run --rm -p 8080:3000 -p 8081:4000/udp -d drone-tracker
```

### Stop docker container

```
docker ps
docker stop <CONTAINER ID>
```

## API Usage

### UDP Datagrams

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

### REST API

Get a list of:

- **All drones**: `curl -G http://localhost:8080/drones`
- **Inactive drones**: `curl -G http://localhost:8080/drones/incative`

## Tests

The following Docker commands will build and run the specified `npm test` script.

```
docker build -t drone-tracker-test -f Dockerfile.test .
docker run --rm drone-tracker-test
```

You can also run tests locally with `npm run test:local` if needed.

Test files are located in `/test` folder.

## Lint

- Run ESLint tool: `npm run lint`
- Autofix some lint issues: `npm run lintfix`
