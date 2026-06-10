const express = require("express");
const router = express.Router();
const verifyToken = require("../../middleware/authentication");
const { emojiReactionToggler } = require("../../controllers/emojiReactions");

router.post("/:slug/emoji-reactions", verifyToken, emojiReactionToggler);
router.delete("/:slug/emoji-reactions", verifyToken, emojiReactionToggler);

module.exports = router;