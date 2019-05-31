const router = require("express").Router();
//const usersRoutes = require("./users");
const teachersRoutes = require("./teachers");
const studentsRoutes = require("./students");
const missionsRoutes = require("./missions");


//Routes
// router.use("/users", usersRoutes);
router.use("/teachers", teachersRoutes);
router.use("/students", studentsRoutes);
router.use("/missions", missionsRoutes);

module.exports = router;
