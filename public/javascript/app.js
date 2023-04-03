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
      let tablehtml =
        '<div class="row text-bg-danger border rounded-2 p-2 fw-bold fs-5"> <div class="col"></div> <div class="col">Task Name</div><div class="col text-end">Delete</div></div>';
      for (let i = 0; i < data.todos.length; i++) {
        let checkedstatus = "";
        if (data.todos[i].completed == 1) {
          checkedstatus = " checked='checked' ";
          strikeOpen = "<strike>";
          strikeClose = "</strike>";
        } else {
          strikeOpen = "";
          strikeClose = "";
        }
        tablehtml +=
          '<div class="row border-bottom border-success border-3 fw-medium" ><div class="col-1 "> <input type="checkbox" id="status"' +
          checkedstatus +
          ' onclick="myClick(' +
          data.todos[i].taskid +
          "," +
          data.todos[i].completed +
          ')"></div><div class="col text-start">' +
          strikeOpen +
          data.todos[i].task +
          strikeClose +
          '</div><div class="col-2 text-end"><input type="image" value="DELETE" class="deleteButton" src="/assets/images/deleteTask.jpg" onclick="deleteTask(' +
          data.todos[i].taskid +
          ')"></div></div></div>';
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
