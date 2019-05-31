const express = require("express");
const router = express.Router();

// Load User model
const Mission = require("../../models/Mission");

router.get("/", function(req,res){
    Mission.find().then(function(dbModel){
        res.json(dbModel)
    })
});

router.post("/", function(req, res) {
    Mission.create(req.body).then(function(dbModel){
        res.json(dbModel)
    })
});


module.exports = router;
