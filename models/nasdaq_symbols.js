module.exports = function(sequelize, DataTypes) {
    var nasdaq_symbols = sequelize.define("nasdaq_symbols", {
        symbol: DataTypes.STRING,
        company_name: DataTypes.STRING
    });

    return nasdaq_symbols;
};