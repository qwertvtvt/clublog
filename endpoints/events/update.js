const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.put("/:groupid/events/:eventid", auth, async function(req, res) {
    try {
        const { groupid, eventid } = req.params;
        const userid = req.session.userId;

        const group = await knex("groups")
            .select("*")
            .where({ groupid })
            .first();
        if(!group) {
            return res.status(404).json({
                success: false,
                message: "group doesnt exist"
            });
        }
        if(group.authorid != userid) {
            return res.status(403).json({
                success: false,
                message: "operation denied"
            });
        }
        
        const { title, timestamp, location, description } = req.body;
        if(!title || !timestamp) {
            return res.status(400).json({
                success: false,
                message: "title and timestamp are required"
            });
        }
        if(
            typeof timestamp !== "number" ||
            !Number.isSafeInteger(timestamp) ||
            !Number.isFinite(new Date(timestamp).getTime())
        ) {
            return res.status(400).json({
                success: false,
                message: "timestamp must be a valid millisecond timestamp"
            });
        }

        const updated = await knex("calendar")
            .where({ groupid, eventid })
            .update({
                title,
                timestamp: Number(timestamp),
                location,
                description
            });
        
        if(updated == 0) {
            return res.status(404).json({
                success: false,
                message: "eventid doesnt exist"
            });
        }

        res.status(204).end();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

module.exports = router;