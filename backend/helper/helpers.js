const slugify = (string) => {
  return string.trim().toLowerCase().replace(/\W|_/g, "-");
};

const appendTagList = (articleTags, article) => {
  const tagList = articleTags.map((tag) => tag.name);

  if (!article) return tagList;
  article.dataValues.tagList = tagList;
};

const appendFavorites = async (loggedUser, article) => {
  const favorited = await article.hasUser(loggedUser ? loggedUser : null);
  article.dataValues.favorited = loggedUser ? favorited : false;

  const favoritesCount = await article.countUsers();
  article.dataValues.favoritesCount = favoritesCount;
};

const appendFollowers = async (loggedUser, toAppend) => {
  //
  if (toAppend?.author) {
    const author = await toAppend.getAuthor();

    const following = await author.hasFollower(loggedUser ? loggedUser : null);
    toAppend.author.dataValues.following = loggedUser ? following : false;

    const followersCount = await author.countFollowers();
    toAppend.author.dataValues.followersCount = followersCount;
    //
  } else {
    const following = await toAppend.hasFollower(
      loggedUser ? loggedUser : null,
    );
    toAppend.dataValues.following = loggedUser ? following : false;

    const followersCount = await toAppend.countFollowers();
    toAppend.dataValues.followersCount = followersCount;
  }
};

const appendEmojiReactions = async (loggedUser, article) => {
  const validEmojiTypes = ['like', 'love', 'laugh', 'surprise', 'sad', 'angry'];
  const counts = {};
  const userReactions = [];

  for (const type of validEmojiTypes) {
    const count = await article.countEmojiReactions(type);
    counts[type] = count;

    if (loggedUser) {
      const hasReacted = await article.hasUserEmojiReaction(loggedUser, type);
      if (hasReacted) {
        userReactions.push(type);
      }
    }
  }

  article.dataValues.emojiReactions = {
    counts,
    userReactions
  };
};

module.exports = { slugify, appendTagList, appendFavorites, appendFollowers, appendEmojiReactions };