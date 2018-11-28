module.exports = function(sequelize, DataTypes) {
  var ToDoList = sequelize.define("ToDoList", {
    task: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  });
  return ToDoList;
};