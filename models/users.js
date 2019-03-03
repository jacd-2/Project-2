module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("Users", {
    user_name: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
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
