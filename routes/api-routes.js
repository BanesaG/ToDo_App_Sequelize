const db = require('../model');

module.exports = function(app) {

  app.get('/api/todolist', function(req, res) {
      db.ToDoList.find({}).then(function(dbtodolist){  
        res.json(dbtodolist);
    })
    .catch(function(err){
        res.json(err);
    })
  });

  app.get('/api/selected/:id', function(req, res) {
    db.ToDoList.findOne({_id: req.params.id}).then(function(dbtodolist){
      res.json(dbtodolist);
  })
  .catch(function(err){
      res.json(err);
  })
});

  app.post('/api/addNewTask', function(req, res) {

    db.ToDoList.create(req.body)
        .then(function(dbtodolist) {
          res.json({dbtodolist});
        })
        .catch(function(err) {
          res.json({err: err});
        });
  });

  app.delete('/api/removeTask', function(req, res){
      const chosen = req.body.task_id;

      db.ToDoList.remove({_id: chosen}).then(function(dbtodolist){
          db.ToDoList.find({}).then(function(dbtodolist){
            res.json(dbtodolist);
        })
        .catch(function(err){
            res.json(err);
        })
      })
      .catch(function(err){
        res.json(err);
    });
  });


  app.put('/api/updateTask', function (req, res) {
      db.ToDoList.findOneAndUpdate({_id: req.body.task_id}, {$set: {compeleted: req.body.compeleted}})
          .then(function (dbtodolist) {
              res.json(dbtodolist);
          })
          .catch(function(err) {
              res.json(err);
          });
  });
}