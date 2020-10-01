// Requiring our models and passport as we've configured it
var db = require("../models");
var passport = require("../config/passport");
// dotenv module reads environment variables, for eventual use with Cloudinary
require('dotenv').config();

module.exports = function (app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function (req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically 
  // hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created
  //  successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function (req, res) {
    db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      .then(function () {
        res.redirect(307, "/api/login");
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

  // Route for logging user out
  app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function (req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        name: req.user.name,
        email: req.user.email,
        id: req.user.id,
        profilePic: req.user.profilePic,
        cloudUploadName: process.env.CLOUDINARY_CLOUDNAME,
        cloudUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
      });
    }
  });
  app.put("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      //UPDATE users profile Pic
      db.User.update({ profilePic: req.body.profilePic }, {
        where: { id: req.user.id }
      })
        .then(data => {
          res.json(data);
        })
        .catch(err => {
          res.json({ err });
        });
    }
  });
  // GET all users for trade info section
  app.get("/api/user_data/all", function (req, res) {
    db.User.findAll({})
      .then(result => {
        res.json(result);
      });
  });
  // GET SINGLE user for trade info section
  app.get("/api/user_data/:id", function (req, res) {
    db.User.findOne({
      where: { id: req.params.id }
    })
      .then(result => {
        res.json(result);
      });
  });

  // ********************************** SET FINDING ******************************************** //
  // SELECT * FROM sets WHERE UserID = ?
  app.get("/api/sets/:id", function (req, res) {
    db.Set.findAll({
      where: { UserId: req.params.id }
    })
      .then(result => {
        res.json(result);
      });
  });

  // SELECT * FROM cards WHERE setId = ?
  app.get("/api/cards/:setId", function (req, res) {
    db.Card.findAll({
      where: { SetId: req.params.setId }
    })
      .then(result => {
        res.json(result);
      });
  });


  // ********************** TRADING ***************************************** // 
  // CREATE a Trade
  app.post("/api/trades", function (req, res) {
    db.Trade.create({
      senderID: req.body.sender,
      receiverID: req.body.receiver,
      message: req.body.message,
      sendCard: req.body.iTrade,
      receiveCard: req.body.theyTrade
    })
      .then(function () {
        res.send("success")
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });

// FIND ALL trades by RECEIVER
  app.get("/api/trades/:receiverID", function (req, res) {
    db.Trade.findAll({
      where: { receiverID: req.params.receiverID }
    })
      .then(result => {
        res.json(result);
      });
  });
}