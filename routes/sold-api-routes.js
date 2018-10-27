var db = require("../models");

module.exports = function(app) {
    app.post("/api/sold", function(req, res) {
        db.Sold.create(req.body).then(function(dbSold) {
            res.json(dbSold);
        })
    })

    app.get("/api/soldAll/:id", function(req, res) {
        if(req.params.id) {
            db.Sold.findAll({
                where: {
                    UserId: req.params.id
                }
            }).then(function(result) {
                return res.json(result);
            })
        }
    })
}