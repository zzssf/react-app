const { legacyCreateProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    '/api/v1/table',
    legacyCreateProxyMiddleware({
      target: 'http://localhost:3099',
      changeOrigin: true
    })
  )
  app.use(
    '/api2',
    legacyCreateProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true
    })
  )
}
