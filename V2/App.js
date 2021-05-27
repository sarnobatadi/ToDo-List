const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true},{useUnifiedTopology: true});

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
//const items = [item1.task,item2.task,item3.task];
/*

*/

const listSchema = {
    task: String,
    items: [itemSchema]
};

const List = mongoose.model("List",listSchema);

var subject = "Work ";
const app = express(); 
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
   let day = date();
   Item.find({},function(err,foundItem){
       if(foundItem.length === 0)
        {
            Item.insertMany(defalutItems, function(err){
                if(err)
                {
                    console.log(err);
                }
                else{
                    console.log("SUccess!!");
                }
                });
            res.redirect("/");
        }
       else{
           res.render("list",{listTitle: "Today", newListItems: foundItem});
       }
   })
    

});




app.get("/work",function(req,res){
    res.render("list",{listTitle: "Work List",newListItems: workItems});
});

app.get("/:customListName",function(req,res){
    const customListName = req.params.customListName ;
List.find({name:customListName},function(err,foundlist){
    if(!err)
    {
        if(!foundlist)
        {    
            const list = new List({
            name: customListName,
            items: defalutItems
            }) ;
            list.save();
            res.redirect("/" + customListName);
        }
        else
        {
            res.render("list",{listTitle: customListName ,newListItems: foundlist })
        }
    }
    
})
    

});
app.post("/",function(req,res){
    const  itemName = req.body.newItem;
    const item = new Item({
        task : itemName
    })


    item.save();
    res.redirect("/");
   // console.log(item);
 
})

app.post("/work",function(req,res){
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
})

app.post("/delete",function(req,res){
   const checkedItemId = req.body.checkbox ;
   Item.findByIdAndRemove(checkedItemId,function(err){
       if(err)
       {
           console.log(err);
       }
       else{
           console.log("Deleted!");
       }
       res.redirect("/");
   })
})


app.listen(4000,function(){
    console.log("Server Started!");
});
