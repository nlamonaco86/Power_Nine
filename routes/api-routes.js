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
      sex: req.body.sex,
      age: req.body.age,
      goal: req.body.goal,
      email: req.body.email,
      password: req.body.password,
      dumbbell: req.body.dumbbell,
      barbell: req.body.barbell,
      machine: req.body.machine,
      proficiency: req.body.proficiency
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
        sex: req.user.sex,
        age: req.user.age,
        height: req.user.height,
        weight: req.user.weight,
        goal: req.user.goal,
        proficiency: req.user.proficiency,
        dumbell: req.user.dumbbell,
        barbell: req.user.barbell,
        machine: req.user.machine,
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
  // ********************************** EXERCISES ******************************************** //
  // add an exercise to the database (admin only, eventually)
  app.post("/api/exercises", function (req, res) {
    db.Exercise.create({
      exerName: req.body.exerName,
      main: req.body.main,
      alternate: req.body.alternate,
      auxillary: req.body.auxillary,
      equipment: req.body.equipment,
      upper: req.body.upper,
      push: req.body.push,
      compound: req.body.compound
    })
      .then(function () {
        console.log(res)
      })
      .catch(function (err) {
        res.status(401).json(err);
      });
  });
  // PERSONALIZE user
  app.get("/api/personalize/:id", function (req, res) {
    db.User.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(result => {
        res.json(result);
      });
  });
  // FIND exercises
  app.get("/api/exercises/:muscle", function (req, res) {
    db.Exercise.findAll({
      where: {
        main: req.params.muscle
      }
    })
      .then(exercises => {
        res.json(exercises);
      });
  });

  app.get("/api/exercises/:muscle/anySecondary/:equipReq", function (req, res) {
    db.Exercise.findAll({
      where: {
        main: req.params.muscle,
        equipment: req.params.equipReq
      }
    })
      .then(exercises => {
        res.json(exercises);
      });
  });

  app.get("/api/exercises/:muscle/:secondaryMuscle/anyEquip", function (req, res) {
    db.Exercise.findAll({
      where: {
        main: req.params.muscle,
        alternate: req.params.secondaryMuscle
      }
    })
      .then(exercises => {
        res.json(exercises);
      });
  });

  app.get("/api/exercises/:muscle/:secondaryMuscle/:equipReq", function (req, res) {
    db.Exercise.findAll({
      where: {
        main: req.params.muscle,
        alternate: req.params.secondaryMuscle,
        equipment: req.params.equipReq
      }
    })
      .then(exercises => {
        res.json(exercises);
      });
  });

};