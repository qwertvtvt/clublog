const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.post("/:groupid/events", auth, async function(req, res) {
    try {
        const { groupid } = req.params;
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

        const [ eventid ] = await knex("calendar").insert({
            groupid: Number(groupid),
            title: title,
            timestamp: Number(timestamp),
            location: location,
            description: description
        });

        res.status(201).json({
            success: true,
            eventid
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

module.exports = router;