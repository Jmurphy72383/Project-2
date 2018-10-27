"use strict";

module.exports = function(sequelize, DataTypes) {
    var Stocks = sequelize.define("Stocks", {
        symbol: DataTypes.STRING,
        company_name: DataTypes.STRING,
        market: DataTypes.STRING,
        shares: DataTypes.INTEGER,
        buy_date: DataTypes.DATE,
        buy_price: DataTypes.DECIMAL(8, 2),
        current_price: DataTypes.DECIMAL(8, 2),
        sell_date: {
            type: DataTypes.DATE,
            allowNull: true
        },
        net_total: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true
        }
    });

    Stocks.associate = function(models) {
        models.Stocks.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Stocks;
};