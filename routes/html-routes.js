var path = require("path");

// Routes
module.exports = function(app) {

  //index route loads home.html
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/home.html"));
  });

  //traders route loads traders.html
  app.get("/traders", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/traders.html"));
  });

  //portfolio route loads portfolio.html
  app.get("/portfolio", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/portfolio.html"));
  });

};