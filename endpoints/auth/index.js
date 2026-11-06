const express = require("express");
const router = express.Router();

router.use(require("./register.js"));
router.use(require("./login.js"));
router.use(require("./logout.js"));

module.exports = router;