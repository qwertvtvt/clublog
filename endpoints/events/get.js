const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.get("/:groupid/events", auth, async function(req, res) {
    try {
        const { groupid } = req.params;
        const { year, month } = req.query;
        const userid = req.session.userId;
        const hasYear = year !== undefined;
        const hasMonth = month !== undefined;

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

        if(hasYear !== hasMonth) {
            return res.status(400).json({
                success: false,
                message: "year and month must be provided together"
            });
        }
        if(month < 1 || month > 12) {
            return res.status(400).json({
                success: false,
                message: "month is out of range"
            });
        }

        const monthStart = new Date(Number(year ?? 0), Number((month ?? 1) - 1), 1, 0, 0, 0, 0).getTime();
        const monthEnd = new Date(Number(year ?? 9999), Number(month ?? 12), 0, 23, 59, 59, 999).getTime();

        const events = await knex("calendar")
            .select("eventid", "title", "timestamp")
            .where({ groupid })
            .andWhereBetween("timestamp", [monthStart, monthEnd])
            .orderBy("timestamp", "asc")
            .orderBy("created_at", "asc")
            .orderBy("eventid", "asc")
        
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