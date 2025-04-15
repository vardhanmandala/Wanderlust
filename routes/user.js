const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveUrl } = require("../middleware.js");
const userController=require("../controllers/users.js")

router.get("/signUp", userController.signUpForm);

router.post("/signUp",wrapAsync(userController.saveSignUp));

//login part
router.get("/login",userController.loginForm);

router.post("/login",saveUrl,passport.authenticate('local',
    { 
       failureRedirect: '/login', 
       failureFlash:true,
    }),
    userController.loginUser
);

router.get("/logout",userController.logOut)
module.exports=router;