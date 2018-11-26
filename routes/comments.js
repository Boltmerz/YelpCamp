//Comments New
app.get("/campgrounds/:id/comments/new",isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       }  else {
            res.render("./comments/new", {campground: campground});     
       }
    });
});
//POST new campground
app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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