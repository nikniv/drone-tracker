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
docker run -p 8080:3000 -p 8081:4000/udp -d drone-tracker
```

#### In the foreground

```
docker run -p 8080:3000 -p 8081:4000/udp -d drone-tracker
```

The above will configure the app to listen to:
- HTTP requests on: `http://localhost:8080`
- UDP messages on: `http://localhost:8081`

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
curl -G http://localhost:8080/api/
```

## Tests

```
npm run test
```

## Lint

```
npm run lint
```