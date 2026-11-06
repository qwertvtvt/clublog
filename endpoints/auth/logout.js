const express = require("express");
const router = express.Router();

router.post("/logout", async function(req, res) {
    req.session.destroy((error) => {
        if(error) {
            return res.status(500).json({
                success: false,
                message: "failed to logout"
            });
        }

        res.clearCookie("connect.sid");

        res.json({
            success: true,
            message: "succeeded to logout"
        });
    })
});

module.exports = router;