var Campground  = require("../models/campground");
var Comment  = require("../models/comment");
var middleObj = {
    
}
middleObj.isLoggedIn = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};
middleObj.checkCampgroundOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
        if(err){
           console.log(err);
           res.redirect("back");
        } else {
           if(campground.author.id.equals(req.user._id)){
                next();
            } else{
               res.redirect("back");
              }

            }
        });
        
    } else {
        res.redirect("back");
    }
}
middleObj.checkCommentOwnership = function(req,res,next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err,foundComment){
        if(err){
           console.log(err);
           res.redirect("back");
        } else {
           if(foundComment.author.id.equals(req.user._id)){
                next();
            } else{
               res.redirect("back");
              }

            }
        });
        
    } else {
        res.redirect("back");
    }
}
module.exports = middleObj;