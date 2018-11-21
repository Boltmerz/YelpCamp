var express=require("express")
var bodyParser=require("body-parser")
var ejs=require("ejs")
var app = express()
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs")

var campgrounds =
    [
        {name:"SITE 1",image:"http://images.pexels.com/photos/1066801/pexels-photo-1066801.jpeg"},
        {name:"SITE 2",image:"https://images.pexels.com/photos/1601513/pexels-photo-1601513.jpeg"},
        {name:"SITE 3",image:"https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104491f2c771aee9b0b1_340.jpg"},
        {name:"SITE 4",image:"https://images.pexels.com/photos/1048039/pexels-photo-1048039.jpeg"},
        {name:"SITE 5",image:"https://images.pexels.com/photos/959252/dramatic-clouds-sky-drama-959252.jpeg"},
    ];

//INDEX
app.get("/", function (req, res) {
    res.render("landing");
});
//campgrounds
app.get("/campgrounds", function (req, res) {
    res.render("campgrounds", {campgrounds: campgrounds});
});
//Get the page to add new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("newCampground");
});
//POST new campground
app.post("/campgrounds", function(req, res){
    campgrounds.push({name:req.body.campName,image:req.body.imageUrl});
    res.render("campgrounds", {campgrounds: campgrounds});
});
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server started!") ;
});