
if(process.env.NODE_ENV != "production"){
    require('dotenv').config(); // shouldn't be used in the production as it has username and password
}

const express = require('express');
const app = express();
const ejs = require('ejs');
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate')
const ExpressError=require("./utils/ExpressError.js");
const session =require("express-session");
const flash = require('connect-flash');
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js")

const reviewsRoute=require("./routes/reviews.js");
const listingsRoute=require("./routes/listings.js");
const userRoute=require("./routes/user.js");



app.engine('ejs', engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
ejs.cache={}


const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now() + 7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

// Root route
app.get("/",(req, res) => {
    res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());
//middleware for falsh messages


//passport configuraton
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middle ware for locals
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.failure=req.flash("failure");
    res.locals.failureMessage=req.flash("failure");
    res.locals.curUser=req.user;
    res.locals.redirectUrl='/listings';
    next();
})

app.use("/listings",listingsRoute);              // The listings route
app.use("/listings/:id/reviews", reviewsRoute);   // The reviews route 
app.use("/", userRoute);    // The signin & login route


//demo user for example of passport registrations
app.get("/demo",async (req,res)=>{
    let fakeUser=new User({
        email:"karan@gmail.com",
        username:"karanShiva",
    });
    let regUser=await User.register(fakeUser,"Password");
    console.log(regUser);
    res.send(regUser);
})
//for 404
app.all("*", (req, res, next) => {
    console.log(`404 Error: ${req.originalUrl}`);
    next(new ExpressError(404, "Page not found"));
});


//middleware to handle errors
app.use((err, req, res, next) => {
    let{status=500,message="Error occured Internally"}=err;
    if (err.name === "ValidationError") {
        return res.send("Validation Error: " + err.message);
    }
    res.status(status).render("./layouts/error.ejs",{err});
    next(err)
});
//start the server
app.listen(8080, () => {
    console.log("The Server has Started");
});
