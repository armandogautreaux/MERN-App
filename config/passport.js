const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const Teacher = mongoose.model("Teacher");
const Student = mongoose.model("Student")
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Teacher.findById(jwt_payload.id)
        .then(teacher => {
          if (teacher) {
            return done(null, teacher);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      Student.findById(jwt_payload.id)
        .then(student => {
          if (student) {
            return done(null, student);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
