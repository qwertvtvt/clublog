const express = require("express");
const router = express.Router();

router.use(require("./add.js"));
router.use(require("./detail.js"));
router.use(require("./get.js"));
router.use(require("./update.js"));
router.use(require("./delete.js"));

module.exports = router;