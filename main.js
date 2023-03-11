require("dotenv").config();
const mysql = require("mysql2");
const express = require("express");
var bodyParser = require("body-parser");

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

const app = express();
app.use(express.json());

//Fetching values from table
app.get("/todos", (req, res) => {
  let query = "select * from mytodo.task";
  if (req.query.completed) query += " where completed=" + req.query.completed;

  connection.query(query, (err, rows, fields) => {
    if (err) res.status(400).json({ error: err.message });
    else res.json({ todos: rows });
  });
});

//Fetching value of a specific id from table
app.get("/todo/:id", (req, res) => {
  connection.query(
    "select * from mytodo.task where taskid=" + req.params.id,
    (err, result, fields) => {
      if (err) res.status(400).json({ error: err.message });
      // if no value found then return { no_data: true }
      else res.json({ todo: result[0] });
    }
  );
});

//inserting values to table
app.post("/todo", (req, res) => {
  connection.query(
    "insert into mytodo.task (task) VALUES (?)",
    [req.body.task],
    (err, result, fields) => {
      if (err) res.status(400).json({ error: err.message });
      //send back the created object
      else {
        let selectQuery =
          "SELECT * from myTODO.TASK where taskid=" + result.insertId;
        connection.query(selectQuery, (err, result) => {
          if (err) res.status(400).json({ error: err.message });
          else res.json({ todo: result[0] });
        });
      }
    }
  );
});

//Update entries
app.patch("/todo/:id", (req, res) => {
  let task = req.body.task;
  let completed = req.body.completed;
  let id = req.params.id;

  let setClause = "UPDATE mytodo.task SET ";
  let condition = " where taskid=" + id;

  let setValues = [];
  if (task) setValues.push("task='" + task + "'");
  if (typeof completed != "undefined") setValues.push("completed=" + completed);

  let query = setClause + setValues.join(", ") + condition;

  connection.query(query, (err, result, fields) => {
    if (err) res.status(400).json({ error: err.message });
    else {
      let selectQuery = "SELECT * from mytodo.task where taskid=" + id;
      connection.query(selectQuery, (err, selectResult) => {
        if (err) res.status(400).json({ error: err.message });
        else res.json({ todo: selectResult[0] });
      });
    }
  });
});

//delete entries from table
app.delete("/todo/:id", (req, res) => {
  let id = req.params.id;
  let sql = "DELETE from mytodo.task WHERE taskid=" + id;
  let selectQuery = "SELECT * from mytodo.task WHERE taskid=" + id;
  connection.query(selectQuery, (err, selectResult) => {
    if (err) res.status(400).json({ error: err.message });
    else {
      connection.query(sql, (err, result, fields) => {
        if (err) res.status(400).json({ error: err.message });
        //return the deleted json
        else res.status(200);
      });
      res.json({ todo: selectResult[0] });
    }
  });
});

app.listen(3000, () => {
  console.log("server started");
});
