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

document.getElementById("");
function displayTasks() {
  $.ajax({
    url: "/todos",
    type: "GET",
    success: function (data) {
      let tablehtml = "";
      for (let i = 0; i < data.todos.length; i++) {
        let checkedstatus = "";
        if (data.todos[i].completed == 1) checkedstatus = " checked='checked' ";
        tablehtml +=
          '<tr><td> <input type="checkbox"' +
          checkedstatus +
          'onclick="myClick()"></td><td>' +
          data.todos[i].task +
          "</td></tr>";
      }
      $("#table").append(tablehtml);
    },
  });
}
