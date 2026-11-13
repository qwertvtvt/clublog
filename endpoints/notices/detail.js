const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.get("/:groupid/notices/:noticeid", auth, async function(req, res) {
    try {
        const { groupid, noticeid } = req.params;
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

        const notice = await knex("notices")
            .select("title", "content", "created_at")
            .where({ groupid, noticeid })
            .first();
        if(!notice) {
            return res.status(404).json({
                success: false,
                message: "notice not found"
            });
        }

        res.json(notice);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

module.exports = router;