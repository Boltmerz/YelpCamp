var express     = require("express"),
    bodyParser  = require("body-parser"),
    ejs         = require("ejs"),
    app         = express(),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy    = require("passport-local"),
    SeedDB      = require("./seeds"),
    User        = require("./models/user"),
    Campground  = require("./models/campground"),
    Comment  = require("./models/comment");
// SEEDING
SeedDB();
//ROUTES
var commentRoutes = require("./routes/comments"),

//Configure Server attributtes
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs")

mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });
//PASSPORT CONFIGURATIONS
app.use(require("express-session")({
    secret: "This IZ doom playxyz kgmrgn jjjw nalwo charlie hebra",
    resave: false,
    saveUninitialized: false,
}));
//
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
  res.locals.currentUser = req.user; 
  next();
});

//INDEX
app.get("/", function (req, res) {
    console.log(req.user);
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
app.get("/campgrounds/:id" ,function (req, res) {
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

//////////////AUTH
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/register", function(req, res) {
    
   User.register(new User({username:req.body.username}),req.body.password,function(err,user){
      if(err){
          console.log(err);
          return res.redirect("/register");
      }
      console.log("User registered");
      passport.authenticate("local")(req,res,function(){
          res.redirect("/campgrounds");});
   });
});

app.get("/login", function (req, res) {
    res.render("login");
});
app.post("/login", passport.authenticate("local",{successRedirect: "/campgrounds",failureRedirect:"/login"}), function (req, res) {
    
});
// LOGOUT
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server started!") ;
});