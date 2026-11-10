const express = require("express");
const router = express.Router();
const crypto = require('crypto');
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.post("/invite/:groupid", auth, async function(req, res) {
    try {
        const { groupid } = req.params;
        const requestedUserId = req.session.userId;

        const group = await knex("groups")
            .select("*")
            .where({ groupid })
            .first();
        if(!group) {
            return res.status(404).json({
                success: false,
                message: "group doesn't exist"
            });
        }
        if(group.authorid != requestedUserId) {
            return res.status(403).json({
                success: false,
                message: "operation denied"
            });
        }

        const inviteCode = crypto.randomBytes(10).toString('hex')

        const [ code ] = await knex("invites").insert({
            code: inviteCode,
            groupid: groupid
        });

        res.status(201).json({
            success: true,
            code: inviteCode
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