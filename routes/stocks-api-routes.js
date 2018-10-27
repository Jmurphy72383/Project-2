var db = require("../models");

module.exports = function(app) {
    app.post("/api/stocks", function(req, res) {
        db.Stocks.create(req.body).then(function(dbStocks) {
            res.json(dbStocks);
        })
    })

    // app.get("/api/stocksAll", function(req, res) {
    //     db.Stocks.findAll({}).then(function(results) {
    //         res.json(results);
    //     })
    // })

    app.get("/api/stocksAll/:id", function(req, res) {
        if(req.params.id) {
            db.Stocks.findAll({
                where: {
                    UserId: req.params.id
                }
            }).then(function(result) {
                return res.json(result);
            })
        }
    })


    app.put("/api/stocks", function(req, res) {
        db.Stocks.update({
            current_price: req.body.current_price
        },
          {
            where: {
              company_name: req.body.company_name
            }
          }).then(function(dbStocks) {
          res.json(dbStocks);
        });
    });

    app.get("/api/stocks/:soldStock?", function(req, res) {
        if(req.params.soldStock) {
            db.Stocks.findAll({
                limit: 1,
                where: {
                    id: req.params.soldStock
                }
            }).then(function(result) {
                return res.json(result);
            })
        }
    })

    app.delete("/api/stocks/:id", function(req, res) {
        db.Stocks.destroy({
            where: {
                id: req.params.id
            }
        }).then(function(dbStocks) {
            res.json(dbStocks);
        })
    })
}

