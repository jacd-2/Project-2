module.exports = function(sequelize, DataTypes) {
  var Sounds = sequelize.define("Sounds", {
    name: DataTypes.STRING,
    genre: DataTypes.STRING
  });
  return Sounds;
};
