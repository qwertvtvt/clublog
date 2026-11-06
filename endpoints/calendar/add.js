const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");

router.post("/add", async function(req, res) {
    try {
        const { title, timestamp, location, description } = req.body;
        if(!title || !timestamp) {
            return res.status(400).json({
                success: false,
                message: "Title and date are needed"
            });
        }

        const [ eventid ] = await knex("calendar").insert({
            title: title.trim(),
            timestamp: Number(timestamp),
            location: location ?? null,
            description: description ?? null
        });

        res.setHeader("Content-Type", "application/json");
        res.send({
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