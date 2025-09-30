const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/stt", {
      target: "http://localhost:3333",
      onError(err, req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('ok');
      },
    })
  );
};