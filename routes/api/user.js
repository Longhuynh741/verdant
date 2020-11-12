const router = require("express").Router();
const bodyParser = require("body-parser");
const db = require("../../models");
const bcrypt = require("bcryptjs");

// create application/json parser
const jsonParser = bodyParser.json();

// create a GET route for testing (getting all users)
router.get("/api/users", (req, res) => {
  console.log("Clicked to retrieve users");
  db.User.find({})
    .then((foundUser) => {
      res.json(foundUser);
    })
    .catch((err) => {
      if (err) throw err;
    });
});

// delete and find use this var, make sure to swap out when using dynamic data
let userID = "5fa5e3246017de4309aa0ed8";

// find user by ID
router.get("/api/users/:id", (req, res) => {
  console.log("Clicked to retrieve a single user by ID");
  db.User.find({ _id: userID })
    .then((foundUser) => {
      res.json(foundUser);
    })
    .catch((err) => {
      if (err) throw err;
    });
});

// // find user by email address
// router.get("/api/users/register", (req, res) => {
//   db.User.findOne({ email })
//     .then((foundUser) => {
//       res.json(foundUser);
//     })
//     .catch((err) => {
//       if (err) throw err;
//     });
// });

// CREATE AND REGISTER USER ROUTE
router.post("/api/users/register", jsonParser, (req, res) => {
  // destructure the req.body object to grab variables
  const { email, password, first_name, last_name } = req.body;

  db.User.findOne({ email: email }).then((foundExistingUser) => {
    if (foundExistingUser) {
      res.json({ msg: "email address already in use" });
      // console.log(foundUser);
    } else {
      // hashing user password by using bcrypt and salt
      // then setting password to the new hashed password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) throw err;
        let password = hash;
        db.User.create({ email, password, first_name, last_name });
        res.json({
          msg: "Successfully created and saved a user to the database",
        });
      });
    }
  });
});

// USER LOGIN ROUTE
router.post("/api/users/login", jsonParser, (req, res) => {
  // destructure the req.body object to grab variables
  const { email, password } = req.body;
  console.log("USER SUBMITTED EMAIL:", email);
  console.log("USER SUBMITTED PASSW:", password);

  db.User.findOne({ email: email }).then((foundUser) => {
    console.log("USER FOUND WITH:", foundUser);
  }).catch((err) => {
    if (err) throw err;
  })
});

// update user by id
router.put("/api/users/:id", (req, res) => {
  // use findByIdAndUpdate
});

// delete user by id
router.delete("/api/users/:id", (req, res) => {
  console.log(req.params);
  db.User.findByIdAndDelete({ _id: userID })
    .then((deletedUser) => {
      console.log("Deleted user");
      console.log(deletedUser);
    })
    .catch((err) => {
      if (err) throw err;
    });
});

module.exports = router;
