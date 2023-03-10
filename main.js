const express = require('express');
var bodyParser = require('body-parser');

const app=express()
const todos =[]
//var jsonParser = bodyParser.json()
app.use(express.json())
app.get('/todos', (req, res) =>{
        res.json({todos});
})

app.get('/todo/:id', (req,res) => {
    const todoItem = {todo:todos[req.params.id-1]}
    res.send(todoItem)
})

app.post('/todo', (req, res) =>{
    const text = req.body.task;
    const todosItem = { id: todos.length+1, completed: false, task: text };
    todos.push(todosItem);
    res.send(todosItem);
})

app.put('/todo/:id', (req,res)=>{
    const id=req.params.id;
    // todos[id-1].task=req.body.task;
    // todos[id-1].completed=req.body.completed;
    const body=req.body;
    body.id = id;
    todos[id-1]=body;
    res.json(todos[id-1]);
})

app.patch('/todo/:id', (req, res) => {
    const id = req.params.id;

    if(todos.length < id) 
        return res.status(400).json({ "error": "task not found" });

    const completed = req.body.completed;
    todos[id-1].completed = task;
    res.json(todos[id-1])
})

app.listen(3000, ()=>{
    console.log('server started');
});
