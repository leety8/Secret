require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
//const { Console } = require("console");
const encrypt = require("mongoose-encryption");

const app = express();

//log the API_key
console.log(process.env.API_KEY);

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

//Connect the server to hte mongodb server
mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

//set up a new DB with schema first
const userSchema = new mongoose.Schema({ email: "String", password: "String" });
//To have the secret from .env file
userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});
//create the model to create users to add userDB to
const User = new mongoose.model("User", userSchema);

//to see the pages
app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
// get the user info
app.post("/register", function (req, res) {
  //grasb the name on the body name variable htlm
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });

  newUser.save(function (err) {
    if (err) {
      Console.log(err);
    } else {
      res.render("Secrets");
    }
  });
});
//to log if there are an account alreay check on the database
app.post("/login", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("Secrets");
        }
      }
    }
  });
});

//TODO r
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
