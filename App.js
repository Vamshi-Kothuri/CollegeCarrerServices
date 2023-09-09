const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const { add } = require("lodash");

const all="All";

var Pname;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/Jobs");

const postSchema = {
  companyName: String,
    jobRole: String,
    jobLocation: String,
    currentTime: String,
    jobType: String,
    num: String,
    category:String,
    sal:String,
    aboutCompany: String,
    qual:String,
    link: String
  };
  
  const Post = mongoose.model("Post", postSchema);

  const UserSchema ={
      UserName: String,
      password: String,
      PersonName: String
  }
  const User = mongoose.model("User", UserSchema);

  app.get("/Update", function(req,res){

    const requestedPostId = req.body.submit;
      
      res.render("UpdatePost",{reqid: requestedPostId, PersonName: Pname});
  });

  app.get("/",function(req,res){
    res.render("signUp");
  })

  app.get("/login",function(req,res){
    res.render("login");
  })

  app.get("/Home", function(req, res){

    res.render("Home");
  });

  app.get("/AddPost", function(req, res){
    
    res.render("AddPost",{PersonName: Pname})
  });

  app.get("/ViewJobs", function(req, res){

    Post.find({}).then(function(posts){
    
      res.render("CardDetails", {newPosts: posts, PersonName: Pname});
      
    })
     .catch(function(err){
      console.log(err);
    })
    
  });

  app.get("/:pos",function(req,res){
    
      const reqdata=req.params.pos;
      
      if(reqdata === all){
        Post.find({}).then(function(posts){
    
          res.render("CardDetails", {newPosts: posts,PersonName: Pname});
          
        })
         .catch(function(err){
          console.log(err);
        })
      }
      else{
        Post.find({category: reqdata}).then(function(FilterdJobs){

          res.render("CardDetails",{newPosts: FilterdJobs, PersonName: Pname});
    
        })
        .catch(function(err){
            console.log(err);
          })
      }
  
  })

  app.get("/posts/:postId",function(req,res){
    const requestedPostId = req.params.postId;

    Post.findOne({_id: requestedPostId}).then(function(data){
    
      res.render("RightSection", {
        about: data.aboutCompany,
        req: data.qual,
        applyHere: data.link,
        Name: data.companyName,
        position: data.jobRole,
        PersonName: Pname
      });
    })
     .catch(function(err){
      console.log(err);
    })
  })

  app.post("/AddOpportunity", function(req, res){
    const post = new Post({
      companyName: req.body.CompanyName,
      jobRole: req.body.JobRole,
      jobLocation: req.body.JobLoc,
      currentTime: req.body.CurrTime,
      jobType:req.body.JobType,
      num: req.body.NoOfApps,
      category:req.body.Division,
      sal:req.body.Salary,
      aboutCompany: req.body.AboutCompany,
      qual:req.body.Qualifications,
      link: req.body.ApplicationLink
    });
    post.save();
    
    res.render("Home");

  });

  /*app.post("/Register",function(req,res){

    const Uname = req.body.Username;
    const invalid = "UserName Already Existed"

    User.find({ UserName: Uname}).then(function(data){
        console.log(data);
      if(data === []){
        const user = new User({
          UserName: req.body.Username,
          Password: req.body.Password,
          PersonName: req.body.Name,
        });
        user.save();
        res.render("login");
      }
      else{
        res.render("signUp",{req: invalid});
      }
    })
    .catch(function(err){
      alert("error ocured");
    })

      // const user = new User({
      //   UserName: req.body.Username,
      //   password: req.body.Password,
      //   PersonName: req.body.Name,
      // });
      // user.save();
      // res.render("login");
    
  })*/

  app.post("/Register", async(req,res)=>{
      
      const existUname = await User.findOne({UserName: req.body.Username})
      Pname = req.body.Name;
      if(!existUname){
         const user = new User({
        UserName: req.body.Username,
        password: req.body.Password,
        PersonName: req.body.Name,
      });
      user.save();
      res.redirect("/login");
      }
      else{
        console.log("User Already Existed");
        res.render("signUp");
      }

  })

/*  app.post("/login",function(req,res){
    const Uname = req.body.Username;
    const pwd = req.body.Password;
    const invalid = "Invalid UserName or Password"

    User.findOne({UserName: Uname, password: pwd}).then(function(data){
      if(data != isEmpty){
        res.render("Home");
      }
      else{
        res.render("login",{req: invalid});
      }
          
    })
    .catch(function(err){
        alert("error occured");
    })
  })*/

  app.post("/login", async(req,res)=>{
    const Userexisted = await User.findOne({UserName: req.body.Username, password: req.body.Password})

    if(Userexisted){
      res.redirect("/Home");
    }
    else if(!Userexisted){
      const invalid = "Invalid UserName or Password"
      
      res.render("login");
    }
  })
 
  app.post("/Update",function(req,res){
      
      // const requestedPostId = req.query.type;
      const requestedPostId = req.params.postId;

      console.log(requestedPostId);


      Post.updateOne({_id: requestedPostId},{$set: {

        companyName : req.body.CompanyName,
        jobRole : req.body.JobRole,
        jobLocation : req.body.JobLoc,
        currentTime : req.body.CurrTime,
        jobType : req.body.JobType,
        num :  req.body.NoOfApps,
        category : req.body.Division,
        sal : req.body.Salary,
        aboutCompany :  req.body.AboutCompany,
        qual : req.body.Qualifications,
        link : req.body.ApplicationLink
  
        }
      })
      res.render("Home");
  })

  app.post("/Delete", function(req,res){
    const requestedPostId = req.body.submit;
      console.log(requestedPostId);

    Post.deleteOne({_id: requestedPostId}).then(function(data){
        res.redirect("/ViewJobs");
    })
  })
 

  app.listen(4000, function() {
    console.log("Server started on port 4000");
  });