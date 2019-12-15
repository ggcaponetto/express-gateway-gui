# express-gateway-gui

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

This is a simple GUI for [https://www.express-gateway.io/](https://www.express-gateway.io/).
The repository is under **active** development and at it's earliest phase, so expect:

- Wild git commits
- No docs
- Expect things to break

A this time the following admin sections are implemented:

- [x] Users
- [x] Apps
- [ ] Credentials
- [ ] Scopes
- [ ] Schemas
- [ ] Policies
- [ ] Service Endpoints
- [ ] API Endpoints
- [ ] Pipeline

## Getting started

1. ```npm i```
1. ``lerna bootstrap``
1. ``lerna build``
1. ``lerna start``

## Usage with docker (baked)
// TODO

## Usage with docker (build it yourself)

On Windows: Use ``host.docker.internal`` to access the host.

The GUI needs to talk to a proxy (``REACT_APP_PROXY_URL``) which will talk to the express-gateway admin API. 
The proxy can be configured to talk to the default express-gateway endpoint or a custom one. This is achieved by
setting ``EXPRESS_GATEWAY_ADMIN_URL`` to something that is reachable from within the proxy docker container. The port
on which the proxy will be listeningm, can be set by ``PROXY_PORT``.

1. Build the container

``docker build --build-arg REACT_APP_PROXY_URL=http://localhost:9877 -t express-gateway-gui . ``

1. Run the container

``docker run -e EXPRESS_GATEWAY_ADMIN_URL=http://host.docker.internal:9876 -e PROXY_PORT=9877 -d -p 5000:5000 -p 9877:9877 -it express-gateway-gui``

## Contribution

1. ```npm i```
1. ``lerna bootstrap``

Hack a little bit with the preview:
1. ``lerna start-dev``