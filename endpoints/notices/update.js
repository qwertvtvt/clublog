const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.put("/:groupid/notices/:noticeid", auth, async function(req, res) {
    try {
        const { groupid, noticeid } = req.params;
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
        if(group.authorid !== userid) {
            return res.status(403).json({
                success: false,
                message: "operation denied"
            });
        }

        const { title, content } = req.body;
        if(!title) {
            return res.status(400).json({
                success: false,
                message: "title is required"
            });
        }

        const updated = await knex("notices")
            .where({ groupid, noticeid })
            .update({
                title,
                content
            });
        if(updated == 0) {
            return res.status(404).json({
                success: false,
                message: "notice not found"
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