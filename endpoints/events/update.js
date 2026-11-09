const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.put("/:groupid/events/:eventid", auth, async function(req, res) {
    try {
        
    } catch (error) {
        
    }
});

module.exports = router;