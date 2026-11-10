const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.post("/join/:code", auth, async function(req, res) {
    try {
        const inviteCode = req.params.code;
        const userid = req.session.userId;
        
        const invite = await knex("invites")
            .select("*")
            .where({ code: inviteCode })
            .first();
        if(!invite) {
            return res.status(404).json({
                success: false,
                message: "invite code doesn't exist"
            });
        }

        const now = Date.now();
        if(invite.revoked || (invite.age !== null && Number(invite.age) < now)) {
            return res.status(404).json({
                success: false,
                message: "invite code doesn't exist"
            });
        }

        const join_to = invite.groupid;

        const isJoined = await knex("members")
            .select("*")
            .where({ userid, groupid: join_to })
            .first();
        if(isJoined) {
            return res.status(409).json({
                success: false,
                message: "Already a member of this group"
            });
        }

        await knex("members").insert({
            userid,
            groupid: join_to,
            joined_at: now
        });

        res.status(201).json({
            success: true,
            groupid: join_to
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