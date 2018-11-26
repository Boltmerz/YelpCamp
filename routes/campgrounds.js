var Campground  = require("../models/campground");
var Comment  = require("../models/comment");
var express = require("express");
var router = express.Router();
//Get ALL campgrounds
router.get("/", function (req, res) {
    //res.render("campgrounds", {campgrounds: campgrounds});
    Campground.find({}, function (err,allCampgrounds){
        if(err)
        {
            console.log(err);
        }
        else {
            res.render("./campgrounds/campgrounds", {campgrounds: allCampgrounds});    
        }
    });
});
//Get the page to add new campground
router.get("/new",isLoggedIn, function (req, res) {
    res.render("./campgrounds/new");
});
//POST new campground
router.post("/", isLoggedIn, function(req, res){
    var author={
        id: req.user._id,
        username: req.user.username
    };
    Campground.create(
        {name:req.body.campName,image:req.body.imageUrl,description:req.body.description,author},
        function(err,campground){
            if(err){
                console.log(err);
            }else{
                console.log("Inserted new camp: "+req.body.campName+" Author: "+campground.author);
            }
        }
    )
    res.redirect("/campgrounds");
});
//GET SHOW
router.get("/:id" ,function (req, res) {
     Campground.findById(req.params.id).populate("comments").exec(function (err,campground){
        if(err)
        {
            console.log(err);
        }
        else {
            res.render("./campgrounds/show", {campground: campground});    
        }
    });
});
function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports = router;