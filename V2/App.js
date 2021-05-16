const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true});

const itemSchema = {
    task : String
};

const Item = mongoose.model("Item ",itemSchema);

const item1 = new Item({
    task: "Welcome to TODO List"
});

const item2 = new Item({
    task: "Like share and subscribe "
});

const item3 = new Item({
    task: "Have Fun !!"
});

const defalutItems = [item1,item2,item3];
const items = [item1.task,item2.task,item3.task];

Item.insertMany(defalutItems, function(err){
    if(err)
    {
        console.log(err);
    }
    else{
        console.log("SUccess!!");
    }
});

var subject = "Work ";
const app = express(); 
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
   let day = date();
    res.render("list",{listTitle: "Today", newListItems: items});

});

app.post("/",function(req,res){
    var item = req.body.newItem;
   // console.log(item);
  if(req.body.list === "Work"){
      workItems.push(item);
      res.redirect("/work");
  }
  else{
    items.push(item);
    res.redirect("/");
  }
})


app.get("/work",function(req,res){
    res.render("list",{listTitle: "Work List",newListItems: workItems});
});


app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})

app.listen(4000,function(){
    console.log("Server Started!");
});
