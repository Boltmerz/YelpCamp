var express = require("express");
var router = express.Router();
var passport    = require("passport");
var User = require("../models/user");
//// INDEX
router.get("/", function (req, res) {
    console.log(req.user);
    res.render("landing");
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
//////////////AUTH
router.get("/register", function (req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    
   User.register(new User({username:req.body.username}),req.body.password,function(err,user){
      if(err){
          console.log(err);
          req.flash("error", err.message);
          return res.redirect("/register");
      }
      console.log("User registered");
      passport.authenticate("local")(req,res,function(){
        req.flash("success", "Welcome "+req.body.username)
        res.redirect("/campgrounds");});
   });
});

router.get("/login", function (req, res) {
    res.render("login");
});
router.post("/login", passport.authenticate("local",{successRedirect: "/campgrounds",failureRedirect:"/login"}), function (req, res) {
    
});
// LOGOUT
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "logged you out");
    res.redirect("/campgrounds");
});
module.exports = router;