var db = require("../models");

module.exports = function(app) {
    app.get("/api/allNyse", function(req, res) {
        db.nyse_symbols.findAll({}).then(function(results) {
            res.json(results);
        })
    })

    app.get("/api/allNasdaq", function(req, res) {
        db.nasdaq_symbols.findAll({}).then(function(results) {
            res.json(results);
        })
    })

    app.get("/api/nyse/:singleStockNyse?", function(req, res) {
        if(req.params.singleStockNyse) {
            db.nyse_symbols.findAll({
                limit: 10,
                where: {
                    company_name: {
                        $like: '%' + req.params.singleStockNyse + '%'
                    }
                }
            }).then(function(result) {
                return res.json(result);
            })
        }
    })

    app.get("/api/nasdaq/:singleStockNasdaq?", function(req, res) {
        if(req.params.singleStockNasdaq) {
            db.nasdaq_symbols.findAll({
                limit: 10,
                where: {
                    company_name: {
                        $like: '%' + req.params.singleStockNasdaq + '%'
                    }
                }
            }).then(function(result) {
                return res.json(result);
            })
        }
    })


}