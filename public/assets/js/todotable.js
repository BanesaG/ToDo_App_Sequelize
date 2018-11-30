const socket = io();
const date = moment().format('llll');
let autoCompArray = [];

$(() => {
  
  $(document).ready(() => {
   const fields = date.split(',');
    $('#date1').text(fields[0]);
    $('#date2').text(fields[1]);
    $('#date3').text(fields[2].toString().substr(1, 4));
    render();
  });


  const searchList = function(dataList){
    autoCompArray = [];
    autoCompArray.push(dataList[0].task);
    for (let i = 1; i < dataList.length; i++) {
      let checkDuplicate = false;
      for (let j = 0; j < autoCompArray.length; j++) {
       if(dataList[i].task === autoCompArray[j]) {
         checkDuplicate = true;
         break;
       }
      }
      if(checkDuplicate === false) autoCompArray.push(dataList[i].task);
    }

  }

  const renderTables = (outputElement, dataList) => {
      searchList(dataList);
      dataList.reverse();
      dataList.forEach(e => {
        const output = $(outputElement);
        let listItem = $(`<li class='mt-4 todoItems' id='${e._id}'>`);
        if(e.compeleted === false){
          listItem.append(
            $("<p>").text(e.task),
            $("<button style='font-size:24px' class='far fa-circle removeBtn'>").text('')
          );
        }else {
        listItem.append(
          $("<p class='finishedTask'>").text(e.task),
          $("<button style='font-size:24px'  class='far fa-times-circle removeBtn doneToDo'>").text('')
        );
      }
        output.append(listItem);
      });
    
  }

  const render = function () {
    $('#inputTxtId').val('');
    $.ajax({ url: "/api/todolist", method: "GET" })
      .then((todoList) => {
        console.log('todolist', todoList);
       renderTables('#todo', todoList);
      });
  }


 const addNewTask = function () {
  newTask = {
    task: $('#inputText').val(),
    complete: false
  }
  
  switch(true){
    case ((newTask.task).trim() !== ''):
        $.ajax({ url: "/api/addNewTask", method: "POST", data: newTask}).then((data) => {
          socket.emit('new-task', {task: data});
          });
    break;
    default:
        alert('fill task on text place then add please');
    break;
  }
}

socket.on('emit-task', (data) => {
  if(data.err) $('errMessage').text(data.err);
  else{
    $("#inputTxtId").empty();
          $("#todo").empty();
          render();
  }
});

$(document).keypress(function(e) {
  if ( e.keyCode === 13 ) {
    e.preventDefault();
     addNewTask();
  }
});
   
const checkOpration = function () {
      event.preventDefault();
      if(!$(this).hasClass("doneToDo")){
        taskDel = {
          task_id: String($(this).parent().attr('id')),
          compeleted: true
        }
    
        $.ajax({url: "/api/updateTask",  method: "PUT", data: taskDel}).then(function(data) {
          socket.emit('update-task', {task: data});
          });
      }else{
        taskDel = {
          task_id: String($(this).parent().attr('id'))
        }
        
        $.ajax({url: `/api/selected/${taskDel.task_id}`,  method: "GET"}).then(function(selected) {
            
              const result = confirm("Are you sure to delete?");
              if (result) {
                $.ajax({url: "/api/removeTask",  method: "DELETE", data: taskDel}).then(function(data) {
                  socket.emit('delete-task', {task: data});
                  });
              }
          });
      };
    }
  
  $('#todo').on('click','.removeBtn' , checkOpration);

  let currentFocus;
  $('#inputTxtId').on("input", function(e) {
    let a, b, i, val = this.value;
    closeAllLists();//
    if (!val) { return false;}
    currentFocus = -1;
    a = document.createElement("DIV");
    a.setAttribute("id", this.id + "autocomplete-list");
    a.setAttribute("class", "autocomplete-items");
    this.parentNode.appendChild(a);
    for (i = 0; i < autoCompArray.length; i++) {
      if (autoCompArray[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        b = document.createElement("DIV");
        b.innerHTML = "<strong>" + autoCompArray[i].substr(0, val.length) + "</strong>";
        b.innerHTML += autoCompArray[i].substr(val.length);
        b.innerHTML += "<input type='hidden' value='" + autoCompArray[i] + "'>";
            b.addEventListener("click", function(e) {
              document.getElementById('inputTxtId').value = this.getElementsByTagName("input")[0].value;
            closeAllLists();
        });
        a.appendChild(b);
      }
    }
});

  function closeAllLists(elmnt) {
    var x = document.getElementsByClassName("autocomplete-items");
    const inp = $('#inputTxtId');
    for (var i = 0; i < x.length; i++) {
      if (elmnt != x[i] && elmnt != inp) {
      x[i].parentNode.removeChild(x[i]);
    }
  }
}

  $('#inputTxtId').on("keydown", function(e) {
    var x = document.getElementById(this.id + "autocomplete-list");
    if (x) x = x.getElementsByTagName("div");
    if (e.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (e.keyCode == 38) { 
      currentFocus--;
      addActive(x);
    } else if (e.keyCode == 13) {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x){
           x[currentFocus].click();
           currentFocus = -1;
          }
      }else { 
        if (currentFocus === -1) {
        closeAllLists(e.target); 
        addNewTask();
        }
      }
    }
});

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = (x.length - 1);
    x[currentFocus].classList.add("autocomplete-active");
  }

  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

document.addEventListener("click", function (e) {
  closeAllLists(e.target);
});

});