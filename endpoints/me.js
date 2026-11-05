const express = require("express");
const router = express.Router();
const knex = require("../knex.js");

router.get("/me", async function(req, res) {
    try {
        if(!req.session.userId) {
            return res.status(401).json({
                success: false,
                authenticated: false
            });
        }

        const user = await knex("users")
            .select("userid", "username")
            .where({ userid: req.session.userId })
            .first();
        if(!user) {
            return res.status(401).json({
                success: false,
                authenticated: false
            });
        }

        res.json({
            success: true,
            authenticated: true,
            user
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false
        });
    }
});

module.exports = router;