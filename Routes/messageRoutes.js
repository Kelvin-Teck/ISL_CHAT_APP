const express = require("express");

const { allMessages, sendMessage, sendMessageToIndividual } = require("../controllers/messageControllers");
const { protect } = require("../middlewares/authMiddleware")

const router = express.Router();

router.route("/:chatId").get(protect, allMessages);
router.route("/").post(protect, sendMessage);
router.route("/individual").post(protect, sendMessageToIndividual);

module.exports = router;
