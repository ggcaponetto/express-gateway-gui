var http = require('http'),
  httpProxy = require('http-proxy')
//
// Create your proxy server and set the target in the options.
//
const port = process.env.PROXY_PORT;
const target = process.env.TARGET_HOST;
let proxy = httpProxy.createProxyServer({ target: target }).listen(port)
proxy.on('proxyRes', function(proxyRes, req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, PATCH');
});
console.log(`The express-gateway-gui will proxy the incoming requests on port ${port} to ${target}`)
