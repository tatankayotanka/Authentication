//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyparser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encryption =require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser:true});
const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String
  }
);
userSchema.plugin(encryption, { secret:process.env.SECRET, encryptedFields: ["password"] });
const User = mongoose.model("User", userSchema);

app.get("/", function(req,res){
  res.render("home");
});
app.get("/login", function(req,res){
  res.render("login");
});
app.get("/register", function(req,res){
  res.render("register");
});
app.post("/register",function(req,res){
  const newUser = new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }else{
      res.render("secrets");
      console.log("User registered successfully");
    }
  });
});
app.post("/login", function(req,res){
  User.findOne({email:req.body.username},function(err,foundUser){
    if(err){
      console.log(err);
    }else{
      if(foundUser){
        if(foundUser.password===req.body.password){
          res.render("secrets");
        }else{
          res.send("password incorrect");
        }
      }else{
        res.send("user not existing");
      }
    }
  })
});

app.listen(3000,function(){
  console.log("Server started on port 3000");
});
