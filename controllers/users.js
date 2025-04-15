const User=require("../models/user.js");

module.exports.signUpForm=(req, res) => {
    res.render("user/signUp.ejs");
};

module.exports.saveSignUp=async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({username,email});
        const regUser=await User.register(newUser,password);
        console.log(regUser);
        req.login(regUser,(err)=>{
            if(err){
                next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }catch(e){
        req.flash("failure","The Username already exist Try UNQ usename");
        res.redirect("/signUp");
    }
};

module.exports.loginForm=(req, res) => {
    res.render("user/login.ejs");
};

module.exports.loginUser=(req, res) => {
    req.flash("success", "Logged-in Successfully!");
    res.redirect(res.locals.redirectUrl);
};

module.exports.logOut=(req,res)=>{
    if(!req.user){
        req.flash("failure","You're Not logged in!");
        return res.redirect("/login");
    }
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logout Successfull!");
        res.redirect("/listings");
    })
};