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
const Student = require("../../models/Student");

router.get("/", function(req,res){
    Student.find().then(function(dbModel) {
        res.json(dbModel);
    })
    .catch(function(err){
        res.status(422).json(err);
    });
})

router.get("/:id", (req, res) =>{
  Student.findById(req.params.id)
  .then(function(dbModel) {
    res.json(dbModel);
  })
  .catch(function(err){
    res.status(422).json(err);
});
}),

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation
console.log(req.body)
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const newStudent = new Student({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    studentID: req.body.studentID,
    studentClass: req.body.studentClass,
    studentAddress: req.body.studentAddress,
    role: req.body.role,
    teacherID: req.body.id,
  });

  // Hash password before saving in database
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newStudent.password, salt, (err, hash) => {
      if (err) throw err;
      newStudent.password = hash;
      newStudent
        .save()
        .then(student => res.json(student))
        .catch(err => console.log(err));
    });
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
  Student.findOne({ email }).then(student => {
    // Check if user exists
    if (!student) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    // Check password
    bcrypt.compare(password, student.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: student.id,
          name: student.name
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
    Student.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then(function(dbModel){
        res.json(dbModel);
    })
    .catch(function(err){
        res.status(422).json(err);
    })
})

router.delete("/:id", function(req,res){
    Student.findById({ _id: req.params.id })
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



