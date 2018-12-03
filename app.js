var express     = require("express"),
    bodyParser  = require("body-parser"),
    ejs         = require("ejs"),
    app         = express(),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy    = require("passport-local"),
    methodOverride    = require("method-override"),
    SeedDB      = require("./seeds"),
    User        = require("./models/user"),
    flash       = require("connect-flash"),
    Campground  = require("./models/campground"),
    Comment  = require("./models/comment");
// SEEDING
// SeedDB();
//ROUTES
var commentRoutes = require("./routes/comments"),
 campgroundRoutes = require("./routes/campgrounds"),
 authRoutes = require("./routes/index");

//Configure Server attributtes
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.set("view engine","ejs")
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

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
  res.locals.error = req.flash("error"); 
  res.locals.success = req.flash("success"); 
  next();
});
app.use(authRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds/",campgroundRoutes);

app.listen(process.env.PORT,process.env.IP,function(){
   console.log("Server started!") ;
});
