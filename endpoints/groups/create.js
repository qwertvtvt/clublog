const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.post("/create", auth, async function(req, res) {
    try {
        const { groupname, description } = req.body;
        const authorid = req.session.userId;
        if(typeof groupname !== "string" || !groupname.trim()) {
            return res.status(400).json({
                success: false,
                message: "groupname is required"
            });
        }

        const now = Date.now();
        const group = await knex.transaction(async function(trx) {
            const exists = await trx("groups")
                .where({ groupname: groupname.trim() })
                .first();
            if(exists) return null;

            const [ groupid ] = await trx("groups").insert({
                groupname: groupname.trim(),
                authorid: Number(authorid),
                description
            });
            await trx("members").insert({
                userid: Number(authorid),
                groupid,
                joined_at: now
            });

            return { groupid, joined_at: now };
        });

        if(!group) {
            return res.status(409).json({
                success: false,
                message: "This groupname is already used"
            });
        }

        res.status(201).json({
            success: true,
            ...group
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