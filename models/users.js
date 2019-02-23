module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define("user", {
        name: DataTypes.STRING
    });
    return Users;
  };