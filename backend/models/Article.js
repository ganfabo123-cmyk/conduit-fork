"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate({ User, Tag, Comment }) {
      // define association here

      // Users
      this.belongsTo(User, { foreignKey: "userId", as: "author" });

      // Comments
      this.hasMany(Comment, { foreignKey: "articleId", onDelete: "cascade" });

      // Tag list
      this.belongsToMany(Tag, {
        through: "TagList",
        as: "tagList",
        foreignKey: "articleId",
        timestamps: false,
        onDelete: "cascade", // FIXME: delete tags
      });

      // Favorites
      this.belongsToMany(User, {
        through: "Favorites",
        foreignKey: "articleId",
        otherKey: "userId",
        timestamps: false,
      });

      // Emoji Reactions
      this.belongsToMany(User, {
        through: "EmojiReactions",
        foreignKey: "articleId",
        otherKey: "userId",
        timestamps: false,
      });
    }

    // Custom emoji reaction methods
    async addEmojiReaction(user, emojiType) {
      const EmojiReaction = sequelize.models.EmojiReactions;
      await EmojiReaction.upsert({
        userId: user.id,
        articleId: this.id,
        emojiType: emojiType
      });
    }

    async removeEmojiReaction(user, emojiType) {
      const EmojiReaction = sequelize.models.EmojiReactions;
      await EmojiReaction.destroy({
        where: {
          userId: user.id,
          articleId: this.id,
          emojiType: emojiType
        }
      });
    }

    async countEmojiReactions(emojiType) {
      const EmojiReaction = sequelize.models.EmojiReactions;
      return await EmojiReaction.count({
        where: {
          articleId: this.id,
          emojiType: emojiType
        }
      });
    }

    async hasUserEmojiReaction(user, emojiType) {
      if (!user) return false;
      const EmojiReaction = sequelize.models.EmojiReactions;
      return await EmojiReaction.findOne({
        where: {
          userId: user.id,
          articleId: this.id,
          emojiType: emojiType
        }
      }) !== null;
    }

    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        userId: undefined,
      };
    }
  }
  Article.init(
    {
      slug: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      body: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Article",
    },
  );
  return Article;
};