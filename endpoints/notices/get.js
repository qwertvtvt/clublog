const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.get("/:groupid/notices", auth, async function(req, res) {
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

        const notices = await knex("notices")
            .select("noticeid", "title", "created_at")
            .where({ groupid })
            .orderBy("created_at", "desc");

        res.json(notices);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

module.exports = router;