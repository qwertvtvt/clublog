const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.get("/:groupid/events", auth, async function(req, res) {
    try {
        const { groupid } = req.params;
        const userid = req.session.userId;

        const isMember = await knex("members")
            .select("*")
            .where({ groupid, userid })
            .first();
        if(!isMember) {
            return res.status(403).json({
                success: false,
                message: "Forbidden"
            });
        }

        const events = await knex("calendar")
            .select("eventid", "title", "timestamp")
            .where({ groupid });
        
        res.json(events);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

module.exports = router;