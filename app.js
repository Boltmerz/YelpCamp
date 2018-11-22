var express     = require("express"),
    bodyParser  = require("body-parser"),
    ejs         = require("ejs"),
    app         = express(),
    mongoose    = require("mongoose");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs")
mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });

//Schema
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String
});
var Campground = mongoose.model("Campground", campgroundSchema);


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
            res.render("campgrounds", {campgrounds: allCampgrounds});    
        }
    });
});
//Get the page to add new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("newCampground");
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
     Campground.findById({_id:req.params.id}, function (err,campground){
        if(err)
        {
            console.log(err);
        }
        else {
            res.render("show", {campground: campground});    
        }
    });
});
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server started!") ;
});