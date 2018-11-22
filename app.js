var express     = require("express"),
    bodyParser  = require("body-parser"),
    ejs         = require("ejs"),
    app         = express(),
    mongoose    = require("mongoose"),
    SeedDB      = require("./seeds"),
    Campground  = require("./models/campground"),
    Comment  = require("./models/comment");
// SEEDING
SeedDB();
//Configure Server attributtes
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs")

mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });
//INDEX
app.get("/", function (req, res) {
    res.render("landing");
});
//Get ALL campgrounds
app.get("/campgrounds", function (req, res) {
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
app.get("/campgrounds/new", function (req, res) {
    res.render("./campgrounds/new");
});
//POST new campground
app.post("/campgrounds", function(req, res){
    Campground.create(
        {name:req.body.campName,image:req.body.imageUrl,description:req.body.description},
        function(err,campground){
            if(err){
                console.log(err);
            }else{
                console.log("Inserted new camp: "+req.body.campName);
            }
        }
    )
    res.redirect("/campgrounds");
});
//GET SHOW
app.get("/campgrounds/:id", function (req, res) {
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
//=========================================================
//Comments New
app.get("/campgrounds/:id/comments/new", function (req, res) {
    Campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
       }  else {
            res.render("./comments/new", {campground: campground});     
       }
    });
});
//POST new campground
app.post("/campgrounds/:id/comments", function(req, res){
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

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server started!") ;
});