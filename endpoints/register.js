const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
const knex = require("../knex.js");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15分間
    max: 5, // 最大5回まで
    message: {
        success: false,
        message: "Too many requests. Please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/register", limiter, async function(req, res) {
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