# Drone Tracker
Track location of drones in real-time.

# Setup

### Build image

```
docker build -t drone-tracker .
```

### Deploy image

#### As a daemon in the background

```
docker run --rm -p 8080:3000 -p 8081:4000/udp -d drone-tracker
```

#### In the foreground

```
docker run --rm -p 8080:3000 -p 8081:4000/udp -d drone-tracker
```

The above will configure the app to listen to:
- HTTP requests on: `http://localhost:8080`
- UDP messages on: `http://localhost:8081`

The `--rm` flag removes container after exiting to prevent container and memory clutter.

### Stop image

```
docker ps
docker stop <CONTAINER ID>
```

## API Usage

### UDP Datagrams

TODO

```
echo "This is my data" > /dev/udp/0.0.0.0/8080
```

### REST API

TODO

```
curl -G http://localhost:8080/
```

## Tests

The following Docker commands will build and run the specified `npm test` script.

```
docker build -t drone-tracker-test -f Dockerfile.test .
docker run --rm drone-tracker-test
```

You can also run tests locally with `npm run test:local` if needed.

## Lint

- Run ESLint tool: `npm run lint`
- Autofix some lint issues: `npm run lintfix`
