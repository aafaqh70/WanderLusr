const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { SaveRedirectUrl } = require("../Utils/Middleware.js");
const userController = require("../controller/user.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(userController.userSignup);

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    SaveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.userLogin
  );

router.get("/logout", userController.userSignOut);

module.exports = router;
