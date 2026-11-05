const express = require("express");
const router = express.Router();

router.get("/test", async function(req, res) {
    res.setHeader("Content-Type", "application/json");
    res.send({
        "status": "OK"
    });
});

module.exports = router;