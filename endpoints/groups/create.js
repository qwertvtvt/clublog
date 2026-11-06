const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");

router.post("/create", async function(req, res) {
    try {
        const { groupname, description } = req.body;
        const authorid = req.session.userId;
        if(!groupname) {
            return res.status(400).json({
                success: false,
                message: "groupname is required"
            });
        }

        const exists = await knex("groups")
            .where({ groupname })
            .first();
        if(exists) {
            return res.status(409).json({
                success: false,
                message: "This groupname is already used"
            });
        }

        const [ groupid ] = await knex("groups").insert({
            groupname,
            authorid: Number(authorid),
            description
        });

        res.status(201).json({
            success: true,
            groupid
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