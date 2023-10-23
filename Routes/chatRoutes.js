const express = require("express");

const { accessChat, fetchChats, fetchGroups, createGroupChat, fetchChatsAndGroups, addUserToGroup, removeUserFromGroup } = require("../controllers/chatControllers");
const { protect, isAdmin } = require("../middlewares/authMiddleware")


const router = express.Router();

router.route("/").post(accessChat);
router.route("/").get(protect, isAdmin, fetchChats);
router.route("/create").post( protect, isAdmin , createGroupChat);
router.route("/fetch").get( protect, isAdmin, fetchGroups);
router.route("/add").post( protect, isAdmin, addUserToGroup);
router.route("/remove").post( protect, isAdmin, removeUserFromGroup);
router.route('/home').get(protect, fetchChatsAndGroups);


module.exports = router;
