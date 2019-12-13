# express-gateway-gui

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

This is a simple GUI for [https://www.express-gateway.io/](https://www.express-gateway.io/).
The repository is under **active** development, at the moment this means:
- Wild git commits
- No docs
- Expect things to break

## contribution: getting started

1. ```npm i```
1. ``lerna bootstrap``

Hack a little bit with the preview:
1. ``lerna start-dev``

## getting started

1. ```npm i```
1. ``lerna bootstrap``
1. ``lerna build``
1. ``lerna start``

## usage with docker (baked)
// TODO

## usage with docker (build it yourself)

readable:
1. ``docker build -t express-gateway-gui``
1. ``docker run -e EXPRESS_GATEWAY_ADMIN_URL=http://localhost:9876 -d -p 5000:5000 -p 9877:9877 -it express-gateway-gui``

oneliner:
1. ``docker build --build-arg REACT_APP_PROXY_URL=http://localhost:9878 -t express-gateway-gui . && docker run -e EXPRESS_GATEWAY_ADMIN_URL=http://localhost:9876 -e PROXY_PORT=9877 -d -p 5000:5000 -p 9878:9877 -it express-gateway-gui``
