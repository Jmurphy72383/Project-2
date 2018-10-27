module.exports = function(sequelize, DataTypes) {
    var nyse_symbols = sequelize.define("nyse_symbols", {
        symbol: DataTypes.STRING,
        company_name: DataTypes.STRING
    });

    return nyse_symbols;
};