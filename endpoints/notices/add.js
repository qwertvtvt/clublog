const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.post("/:groupid/notices", auth, async function(req, res) {
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

        const now = Date.now();
        const [ noticeid ] = await knex("notices").insert({
            groupid: Number(groupid),
            title: title,
            content: content,
            created_at: now
        });

        res.status(201).json({
            success: true,
            noticeid
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