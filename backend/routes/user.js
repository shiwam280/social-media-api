const express = require("express");
const { getUserController } = require("../controllers/userControllers");
const router = express.Router();

router.get("/:userId", getUserController);

module.exports = router;
