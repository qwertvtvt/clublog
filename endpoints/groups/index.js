const express = require("express");
const router = express.Router();
const knex = require("../../knex.js");
const auth = require("../../middleware/auth.js");

router.get("/", auth, async function(req, res) {
    try {
        const userid = req.session.userId;
        
        const groups = await knex("members")
            .join("groups", "members.groupid", "groups.groupid")
            .select(
                "groups.groupid",
                "groups.groupname",
                "groups.description",
                "members.joined_at",
                knex.raw("(groups.authorid = ?) as author", [userid])
            )
            .where({ userid })
            .orderBy("author", "desc")
            .orderBy("joined_at", "asc");
        
        res.json(groups);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

router.use(require("./members.js"));
router.use(require("./create.js"));
router.use(require("./invite.js"));
router.use(require("./join.js"));
router.use(require("./leave.js"));

module.exports = router;