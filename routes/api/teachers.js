const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const Teacher = require("../../models/Teacher");

router.get("/", function(req,res){
  Teacher.find().then(function(dbModel) {
      res.json(dbModel);
  })
  .catch(function(err){
      res.status(422).json(err);
  });
})

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  Teacher.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newTeacher = new Teacher({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        teacherID: req.body.teacherID,
        teacherClass: req.body.teacherClass,
        teacherUsername: req.body.teacherUsername,
        teacherSubject: req.body.teacherSubject,
        teacherGrade: req.body.teacherGrade
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newTeacher.password, salt, (err, hash) => {
          if (err) throw err;
          newTeacher.password = hash;
          newTeacher
            .save()
            .then(teacher => res.json(teacher))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
  // Form validation

  const { errors, isValid } = validateLoginInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  Teacher.findOne({ email }).then(teacher => {
    // Check if user exists
    if (!teacher) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, teacher.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: teacher.id,
          name: teacher.name
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.patch("/:id", function(req,res){
  Teacher.findOneAndUpdate({ _id: req.params.id }, req.body)
  .then(function(dbModel){
      res.json(dbModel);
  })
  .catch(function(err){
      res.status(422).json(err);
  })
})

router.delete("/:id", function(req,res){
  Teacher.findById({ _id: req.params.id })
  .then(function(dbModel){
      dbModel.remove();
  })
  .then(function(dbModel){
      res.json(dbModel);
  })
  .catch(function(err){
      res.status(422).json(err);
  })
})


module.exports = router;
