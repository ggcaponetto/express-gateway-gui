var http = require('http'),
  httpProxy = require('http-proxy')
//
// Create your proxy server and set the target in the options.
//
const port = process.env.PROXY_PORT
const target = process.env.EXPRESS_GATEWAY_ADMIN_URL
try {
  if (!port || !target) throw new Error('The express-gateway-gui needs the PROXY_PORT and EXPRESS_GATEWAY_ADMIN_URL env variables.');

  let proxy = httpProxy.createProxyServer({
    target
  });
  proxy.on('proxyReq', function (proxyReq, req, res) {
    console.debug(`express-gateway-gui: proxyReq`, { port, target })
  });
  proxy.on('proxyRes', function (proxyRes, req, res) {
    console.debug(`express-gateway-gui: proxyRes`, { port, target });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, PATCH, DELETE, HEAD');
    res.setHeader('Access-Control-Allow-Headers', '*')
  });
  proxy.on('error', function (e) {
    console.log(`Proxy error`, e)
  });
  proxy.listen(port);
  console.log(`The express-gateway-gui will proxy the incoming requests on port ${port} to ${target}`)
} catch (e) {
  console.log(`The express-gateway-gui could not create the proxy on port ${port} to ${target}`, e)
}
