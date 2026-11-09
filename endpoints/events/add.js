const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.post("/:groupid/events", auth, async function(req, res) {
    try {
        const { groupid } = req.params;
        const { title, timestamp, location, description } = req.body;
        const idempotencyKey = req.headers
        if(!title || !timestamp) {
            return res.status(400).json({
                success: false,
                message: "title and timestamp are required"
            });
        }
    } catch (error) {
        
    }
});

module.exports = router;