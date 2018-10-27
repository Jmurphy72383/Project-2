"use strict";

module.exports = function(sequelize, DataTypes) {
    var Sold = sequelize.define("Sold", {
        symbol: DataTypes.STRING,
        company_name: DataTypes.STRING,
        market: DataTypes.STRING,
        shares: DataTypes.INTEGER,
        buy_date: DataTypes.DATE,
        buy_price: DataTypes.DECIMAL(8, 2),
        sell_price: DataTypes.DECIMAL(8, 2),
        sell_date: DataTypes.DATE,
        net_total: DataTypes.DECIMAL(8, 2)
    });

    Sold.associate = function(models) {
        models.Sold.belongsTo(models.User, {
            foreignKey: {
                allowNull: false
            }
        });
    };

    return Sold;
};