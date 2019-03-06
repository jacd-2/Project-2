module.exports = function(sequelize, DataTypes) {
  var Sounds = sequelize.define("Sounds", {
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    file: DataTypes.STRING
  });

  Sounds.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Sounds.belongsTo(models.Users, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Sounds;
};
