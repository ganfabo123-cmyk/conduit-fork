const { UnauthorizedError, NotFoundError } = require("../helper/customErrors");
const {
  appendFollowers,
  appendFavorites,
  appendTagList,
  appendEmojiReactions,
} = require("../helper/helpers");
const { Article, Tag, User } = require("../models");

//* Toggle Emoji Reaction for Article
const emojiReactionToggler = async (req, res, next) => {
  try {
    const { loggedUser } = req;
    if (!loggedUser) throw new UnauthorizedError();

    const { slug } = req.params;
    const { emojiType } = req.body;

    const article = await Article.findOne({
      where: { slug: slug },
      include: [
        {
          model: Tag,
          as: "tagList",
          attributes: ["name"],
        },
        {
          model: User,
          as: "author",
          attributes: ["username", "bio", "image"],
        },
      ],
    });
    if (!article) throw new NotFoundError("Article");

    if (req.method === "POST") {
      await article.addEmojiReaction(loggedUser, emojiType);
    }
    if (req.method === "DELETE") {
      await article.removeEmojiReaction(loggedUser, emojiType);
    }

    appendTagList(article.tagList, article);
    await appendFollowers(loggedUser, article);
    await appendFavorites(loggedUser, article);
    await appendEmojiReactions(loggedUser, article);

    res.json({ article });
  } catch (error) {
    next(error);
  }
};

module.exports = { emojiReactionToggler };