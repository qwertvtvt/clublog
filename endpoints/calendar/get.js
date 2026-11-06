const express = require('express');
const router = express.Router();
const knex = require('../../knex.js');

router.get("/:eventid", async function(req, res) {
    try {
        const { eventid } = req.params;
        if(!eventid) return res.status(404);

        const event = await knex("calendar")
            .select("*")
            .where({ eventid })
            .first();
        if(!event) return res.status(404);

        res.setHeader("Content-Type", "application/json");
        res.send(event);
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

module.exports = router;