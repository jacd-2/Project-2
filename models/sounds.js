module.exports = function(sequelize, DataTypes) {
  var Sounds = sequelize.define("Sounds", {
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    price: DataTypes.INTEGER
  });
  return Sounds;
};
