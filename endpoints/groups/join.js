const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");

router.get("/join/:code", async function(req, res) {
    try {
        const { inviteCode } = req.params;
        const userid = req.session.userId;
        
        const invite = await knex("invites")
            .select("*")
            .where({ code: inviteCode })
            .first();
        if(!invite) return res.status(404);

        const now = Date.now();
        if(invite.revoked || invite.age < now) return res.status(404);

        const join_to = invite.groupid;

        const [ groupid ] = await knex("members").insert({
            userid,
            groupid: join_to,
            joined_at: now
        });

        res.status(201).json({
            success: true,
            groupid
        });
    } catch (error) {
        console.error(error);
        res.status(500);
    }
});

module.exports = router;