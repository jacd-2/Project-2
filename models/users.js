module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("user", {
    name: DataTypes.STRING
  });
  // User.associate = function(models) {
  //   // Associating Author with Posts
  //   // When an Author is deleted, also delete any associated Posts
  //   User.hasMany(models.Sounds, {
  //     onDelete: "cascade"
  //   });
  // };
  return Users;
};
