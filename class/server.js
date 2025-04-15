const express=require("express");
const app=express();
const session =require("express-session");
const flash = require('connect-flash');
const path = require("path");
const methodOverride = require("method-override");
const engine = require('ejs-mate')

const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash('success');
    res.locals.err=req.flash('faliure');
    next();
})

app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash('faliure', 'The User Not Registered');    
    }else{
        req.flash('success', 'The User Registered Succesfully');
    }
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
    res.render("page.ejs",{name:req.session.name});
})


app.listen(3000,()=>{
    console.log("The server has started");
});