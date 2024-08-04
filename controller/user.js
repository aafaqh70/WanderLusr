const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.userSignup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({
      email: email,
      username: username,
    });
    const registerdUser = await User.register(newUser, password);
    req.logIn(registerdUser, (err) => {
      if (err) {
        next(err);
      }
      req.flash("success", "Wellcome to Successfuly!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.userLogin = (req, res, next) => {
  if (res.locals.redirectUrl) {
    req.flash("success", "Wellcome back to WanderLust");
    return res.redirect(res.locals.redirectUrl);
  }
  req.flash("success", "Wellcome back to WanderLust");
  return res.redirect("/listings");
};

module.exports.userSignOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are loged out!");
    res.redirect("/listings");
  });
};
