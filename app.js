//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
//const encrypt=require('mongoose-encryption');
//const md5=require("md5");
const bcrypt=require("bcrypt");
const saltRounds=10;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true,useUnifiedTopology:true});

const userSchema= new mongoose.Schema({
  email:String,
  password:String
});


//userSchema.plugin(encrypt,{secret: process.env.SECRET,encryptedFields:["password"]});



const User=new mongoose.model("User",userSchema);

app.use(express.static("public"));

app.get("/",function (req, res){
  res.render("home");
})

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
});

app.post("/register",function (req, res){
  bcrypt.hash(req.body.username, saltRounds, function(err, hash) {
    const newuser= new User({
      email: req.body.username,
    //  password: md5(req.body.password)
      password: hash
    });

    newuser.save(function(err){
      if(!err)
      res.render("secrets");
      else console.log(err);
    });
  });
  });


app.post("/login",function (req, res){
  const username= req.body.username;
//  const password = md5(req.body.password);
 const password = req.body.password;// Plain text password which we give at the time of login


  User.findOne({email:username},function (err,founduser){
    if(err)
    {
      console.log(err)
    }
    else{
      if(founduser)
      {
        bcrypt.compare(password, founduser.password, function(err, result){
          if(result===true){
        console.log(founduser.password);
      }

        });




        /*if(founduser.password===password){
        res.render("secrets");
      }*/
    }
    }
  });
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
