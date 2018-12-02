var Campground  = require("../models/campground");
var Comment  = require("../models/comment");
var express = require("express");

var router = express.Router();
var middleObj = require("../middleware/index");
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
router.get("/new",middleObj.isLoggedIn, function (req, res) {
    res.render("./campgrounds/new");
});
//POST new campground
router.post("/", middleObj.isLoggedIn, function(req, res){
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
//Edit 
router.get("/:id/edit", middleObj.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
       res.render("campgrounds/edit", {campground: campground});
    });
});
//Update
router.put("/:id", middleObj.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, {name:req.body.campName,image:req.body.imageUrl,description:req.body.description}, function(err,campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            console.log("Updated camp "+campground.name);
            res.redirect("/campgrounds/"+campground._id);
        }
    } );
})
// DESTROY
router.delete("/:id", middleObj.checkCampgroundOwnership, function(req,res){
   Campground.findByIdAndRemove(req.params.id, function(err){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }
       res.redirect("/campgrounds");
   })
});


module.exports = router;