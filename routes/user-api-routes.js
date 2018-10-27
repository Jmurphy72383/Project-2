var db = require("../models");

module.exports = function(app) {
    app.post("/api/users", function(req, res) {
        db.User.create(req.body).then(function(dbUser) {
            res.json(dbUser);
        });
    });

    app.get("/api/all", function(req, res) {
        db.User.findAll({}).then(function(results) {
            res.json(results);
        });
    });

    app.delete("/api/users/:id", function(req, res) {
        db.User.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbUser) {
            res.json(dbUser);
        })
    })
}