const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const knex = require("../knex.js");

router.post("/register", async function(req, res) {
    try {
        const { username, password } = req.body;
        if(!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username or password needed"
            });
        }

        const exists = await knex("users")
            .where({ username })
            .first();
        if(exists) {
            return res.status(409).json({
                success: false,
                message: "This username is already used"
            });
        }

        const hashed = await bcrypt.hash(password, 12);

        const [ userId ] = await knex("users").insert({
            username,
            password: hashed
        });

        res.setHeader("Content-Type", "application/json");
        res.send({
            success: true,
            userId
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