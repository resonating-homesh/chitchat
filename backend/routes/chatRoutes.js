const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { accessChat, fetchChats, createGroupChat, renameGroup, addToGroup, exitGroup } = require("../controllers/chatControllers");
const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/group").post(protect, createGroupChat);
router.route("/rename").put(protect, renameGroup);
router.route("/exitgroup").put(protect, exitGroup);
router.route("/addtogroup").put(protect, addToGroup);

module.exports = router;