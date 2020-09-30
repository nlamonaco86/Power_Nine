// Requiring path to so we can use relative routes to our HTML files
var path = require("path");

// Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app) {

  app.get("/", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/signup.html"));
  });

  app.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
      res.redirect("/members");
    }
    res.sendFile(path.join(__dirname, "../public/login.html"));
  });

  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the signup page
  app.get("/members", isAuthenticated, function(req, res) {
    res.sendFile(path.join(__dirname, "../public/members.html"));
  });

  app.get("/about", function(req, res) {
    // If the user already has an account send them to the members page
    res.sendFile(path.join(__dirname, "../public/about.html"));
  });

};

// // Requiring path to so we can use relative routes to our HTML files
// var path = require("path");

// // Import the model to use it
// const order = require("../config/workouts.js");

// // Requiring our custom middleware for checking if a user is logged in
// var isAuthenticated = require("../config/middleware/isAuthenticated");

// module.exports = function(app) {

//   app.get("/", function(req, res) {
//     // If the user already has an account send them to the orders page
//     if (req.user) {
//       order.all((data) => {
//         //store them in an object for handlebars to use
//         let hbsObject = {
//           orders: data
//         };
//         res.render("index", hbsObject);
//       });
//     }
//     res.sendFile(path.join(__dirname, "../public/splash.html"));
//   });

//   app.get("/login", function(req, res) {
//     // If the user already has an account send them to the orders page
//     if (req.user) {
//       order.all((data) => {
//         //store them in an object for handlebars to use
//         let hbsObject = {
//           orders: data
//         };
//         res.render("index", hbsObject);
//       });
//     }
//     res.sendFile(path.join(__dirname, "../public/login.html"));
//   });

//   app.get("/tracker", function(req, res) {
//     res.sendFile(path.join(__dirname, "../public/tracker.html"));
//   });

//   // // Here we've add our isAuthenticated middleware to this route.
//   // // If a user who is not logged in tries to access this route they will be redirected to the signup page
//   app.get("/members", isAuthenticated, function(req, res) {
//     order.all((data) => {
//       //store them in an object for handlebars to use
//       let hbsObject = {
//         orders: data
//       };
//       res.render("index", hbsObject);
//     });
//   });

//   // app.get("/orders", (req, res) =>{
//   //   //read all entries from the orders table
//   //   order.all((data) => {
//   //     //store them in an object for handlebars to use
//   //     let hbsObject = {
//   //       orders: data
//   //     };
//   //     res.render("index", hbsObject);
//   //   });
//   // });

//   // ADMIN FUNCTION
  
// };
