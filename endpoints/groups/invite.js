const express = require("express");
const router = express.Router();
const crypto = require('crypto');

router.get("/invite/:groupid", async function(req, res) {
    try {
        const { groupid } = req.params;
        const requestedUserId = req.session.userId;

        const group = await knex("groups")
            .select("*")
            .where({ groupid })
            .first();
        if(!group) return res.status(404);
        if(group.authorid != requestedUserId) return res.status(403);

        const inviteCode = crypto.randomBytes(10).toString('hex')

        const [ code ] = await knex("invites").insert({
            code: inviteCode,
            groupid: groupid
        });

        res.status(201).json({
            success: true,
            code
        });
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

module.exports = router;