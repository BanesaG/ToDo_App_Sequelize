const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ToDoListSchema = new Schema({
    
    task: {
      type: String,
      required: "Task is Required"
    },
    completed: Boolean
  });

var ToDoList = mongoose.model("ToDoList", ToDoListSchema);

module.exports = ToDoList;
