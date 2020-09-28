// Dependencies
const express = require("express");
const PORT = process.env.PORT || 8080;
const app = express();
const session = require("express-session");
// Requiring passport as we've configured it
const passport = require("./config/passport");

// Serve static content for the app from the "public" directory
app.use(express.static("public"));

// Parse application body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Use sessions to keep track of user's login status
app.use(session({ secret: "keyboard cat", resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Set Handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import the models folder
const db = require("./models");

//Use the given routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);

// Start the server so it can listening to client requests.
db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log("🌎 Now listening at: http://localhost:" + PORT);
  });
});