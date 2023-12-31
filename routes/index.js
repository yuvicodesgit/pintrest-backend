var express = require('express');
var router = express.Router();
var userModel = require("./users")
var passport = require('passport')

const localStrategy = require("passport-local")
passport.use(new localStrategy(userModel.authenticate()))
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/login', function(req, res, next) {
  res.render('login');
});


router.get("/profile", isLoggedIn,(req,res)=>{
    res.send("profile")
})

router.post("/register", (req,res)=>{
  let userData = new userModel({
      username: req.body.username,
      email:req.body.email,
      fullname: req.body.fullname,
    }
  )
  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res, function(){
      res.redirect("/profile"); 
    })
  })
  })

router.post("/login",passport.authenticate("local",{
  successRedirect : "/profile",
  failureRedirect: "/login"
}),(req,res)=>{
})

router.get("/logout",(req,res)=>{
  req.logout(function(err){
    if(err){return next (err); }
    res.redirect('/');
  })
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()) return next();
  res.redirect("/");
}

module.exports = router;
