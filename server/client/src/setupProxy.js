const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/api", "/transactions"],
    createProxyMiddleware({
      target: 'http://localhost:5000'
    })
  );
};