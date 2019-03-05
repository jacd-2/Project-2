const Sequelize = require('sequelize');
const sequelize = new Sequelize('song_info_db', 'root', '1Likeomlets', {
  dialect: 'mysql'
})

module.exports = function(sequelize, DataTypes) {
  var Users = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true 
    },
    name: DataTypes.STRING,
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  });
  
  return Users;
};


