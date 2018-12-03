var Campground  = require("../models/campground");
var Comment  = require("../models/comment");
var middleObj = {
    
}
middleObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please login");
    res.redirect("/login");
};
middleObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
        if(err || !foundCampground){
           console.log(err);
           req.flash("error","Unable to get campground: "+err);
           res.redirect("back");
        } else {
           if(campground.author.id.equals(req.user._id)){
                next();
            } else{
                req.flash("error","You don't have permision!!!");
               res.redirect("back");
              }

            }
        });
        
    } else {
        req.flash("error","Please login first!!!")
        res.redirect("back");
    }
}
middleObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err || !foundComment){
           console.log(err);
           res.redirect("back");
        } else {
           if(foundComment.author.id.equals(req.user._id)){
                next();
            } else{
                req.flash("error","You don't have permision!!!");
               res.redirect("back");
              }

            }
        });
        
    } else {
        res.redirect("back");
    }
}
module.exports = middleObj;