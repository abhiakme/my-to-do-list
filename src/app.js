const express=require("express");
const mongoose=require("mongoose");
const port=3000;
const app=express();
const bodyparser=require("body-parser");
const alert=require("alert");


app.set("view engine","ejs");
// app.set("views","views");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));


mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1:27017/todo",()=>{
    console.log("db connected");

});
const listschema={
    name:{
        type:String,
        // required:true,
    }
};
const listmodel=mongoose.model("listdata",listschema);
const item= new listmodel({
    name:"",
});
const dataarray=[item];


app.get("/",(req,res)=>{
    // res.send("hello hi");
    listmodel.find({},(err,data)=>{
      if(data.length===0){
        listmodel.insertMany(dataarray,(err)=>{
            res.redirect("/");
        });
      }
      else{
        res.render("index",{listitem:data});
      }
    });
});

app.post("/",(req,res)=>{
    const n=req.body.n;
    // console.log(n);
    if(n===""){
      res.send("error");
      res.redirect("/");
    }
    const newitem= new listmodel({
        name:n,
    });
    newitem.save();
    res.redirect("/");
})

app.post("/delete",(req,res)=>{
    const temp=req.body.text;
    // console.log(temp);
    listmodel.deleteOne({name:temp},(err)=>{
        if(!err){
            // console.log("deleted");
            res.redirect("/");
        }
        else{
            console.log(err);
        }
    })
});

app.listen(port,()=>{
 console.log("lisning");
});