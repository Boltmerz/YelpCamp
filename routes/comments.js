var Campground  = require("../models/campground");
var Comment  = require("../models/comment");
var express = require("express");
var router = express.Router({mergeParams: true});
var middleObj = require("../middleware/index");
//Comments New
router.get("/new",middleObj.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       }  else {
            res.render("./comments/new", {campground: campground});     
       }
    });
});
//POST new Comment
router.post("/", middleObj.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground) {
        if(err){
            console.log(err);
        } else {
                Comment.create( 
                    req.body.comment,
                    function(err,comment){
                        if(err){
                            console.log(err);
                        }else{
                            comment.author.id = req.user._id;
                            comment.author.username = req.user.username;
                            comment.save();
                            console.log("Inserted new comment");
                            campground.comments.push(comment);
                            campground.save(function(err, campground){
                                if(err){
                                    console.log(err);
                                } else {
                                    console.log("Comment added successfuly to campground!");
                                    res.redirect("/campgrounds/"+campground._id);
                                }
                            })
                            
                        }
                    });
        }
    });
});
//Edit comment
router.get("/:comment_id/edit", middleObj.checkCommentOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            console.log("Error "+err)
        } else {
            res.render("./comments/edit", {campground_id: req.params.id,comment: foundComment});        
        }
    })
});
//COMMENT Update
router.put("/:comment_id", middleObj.checkCommentOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err,updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
//Delete comment
router.delete("/:comment_id", middleObj.checkCommentOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment) {
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       }
       res.redirect("/campgrounds/"+req.params.id);
   });
});
module.exports = router;