document.getElementById("submitTask").onclick = function () {
  let taskname = document.getElementById("taskName").value;
  console.log(taskname);

  $.ajax({
    url: "/todo",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({ task: taskname }),
    success: function (data) {
      console.log("result from server = " + JSON.stringify(data));

      displayTasks();
    },
  });
};

let input = document.getElementById("taskName");
input.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("submitTask").click();
  }
});

function displayTasks() {
  $.ajax({
    url: "/todos",
    type: "GET",
    success: function (data) {
      let tablehtml = "<tr> <th>Completion Status</th> <th>Task Name</th></tr>";
      for (let i = 0; i < data.todos.length; i++) {
        let checkedstatus = "";
        if (data.todos[i].completed == 1) checkedstatus = " checked='checked' ";
        tablehtml +=
          '<tr><td> <input type="checkbox" id="status"' +
          checkedstatus +
          ' onclick="myClick(' +
          data.todos[i].taskid +
          "," +
          data.todos[i].completed +
          ')"></td><td>' +
          data.todos[i].task +
          '</td><td><input type="button" value="DELETE" onclick="deleteTask(' +
          data.todos[i].taskid +
          ')"></td></tr>';
      }
      $("#table").html(tablehtml);
    },
  });
}

function myClick(id, completionStatus) {
  if (completionStatus == 1) completionStatus = 0;
  else completionStatus = 1;
  $.ajax({
    url: "/todo/" + id,
    type: "PATCH",
    contentType: "application/json",
    data: JSON.stringify({ completed: completionStatus }),
    success: function (data) {
      console.log("result from server = " + JSON.stringify(data));
      displayTasks();
    },
  });
}

function deleteTask(id) {
  $.ajax({
    url: "/todo/" + id,
    type: "DELETE",
    contentType: "application/json",
    success: function (data) {
      console.log("result from server = " + JSON.stringify(data));
      displayTasks();
    },
  });
}

displayTasks();
