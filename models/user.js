"use strict";

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define("User", {
        username: DataTypes.STRING
    });

    User.associate = function(models) {
        models.User.hasMany(models.Stocks);
    };

    return User;
};