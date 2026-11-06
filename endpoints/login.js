const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcrypt");
const knex = require("../knex.js");

const DUMMY_HASH = "$2b$12$wbOryM08OJMlGyHaOMvdueTq9yoklRDqB.xATNWsmHfptojt/nP4e";

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

router.post("/login", limiter, async function(req, res) {
    try {
        const { username, password } = req.body;

        const user = await knex("users")
            .where({ username })
            .first();
        if(!user) {
            await bcrypt.compare(password, DUMMY_HASH);
            return res.status(401).json({
                success: false,
                message: "Username or password is incorrect"
            });
        }

        const valid = await bcrypt.compare(
            password,
            user.password
        );
        if(!valid) {
            return res.status(401).json({
                success: false,
                message: "Username or password is incorrect"
            });
        }

        req.session.regenerate((error) => {
            if(error) {
                return res.status(500).json({
                    success: false,
                    message: "Session Error"
                });
            }

            req.session.userId = user.userid

            res.json({
                success: true,
                user: {
                    userid: user.userid,
                    username: user.username
                }
            });
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
});

module.exports = router;