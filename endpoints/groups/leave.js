const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.post("/leave/:groupid", auth, async function(req, res) {
    try {
        const { groupid } = req.params;
        const userid = req.session.userId;

        const deleted = await knex("members")
            .where({ groupid, userid })
            .del();
        if(deleted == 0) {
            return res.status(404).json({
                success: false,
                message: "group or user doesn't exist"
            });
        }

        res.status(200).json({
            success: true
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
});

module.exports = router;