const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.get("/members/:groupid", auth, async function(req, res) {
    try {
        const { groupid } = req.params;
        const userid = req.session.userId;
        
        const exists = await knex("groups")
            .select("*")
            .where({ groupid })
            .first();
        if(!exists) {
            return res.status(404).json({
                success: false,
                message: "group doesnt exist"
            });
        }

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

        const members = await knex("members")
            .join("users", "members.userid", "users.userid")
            .join("groups", "members.groupid", "groups.groupid")
            .select(
                "users.userid",
                "users.username",
                "members.joined_at",
                knex.raw("(groups.authorid = users.userid) as author")
            )
            .where("members.groupid", groupid)
            .orderBy("members.joined_at", "asc")
        
        res.json(members);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

module.exports = router;