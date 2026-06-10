'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmojiReactions extends Model {
    static associate(models) {
      // define association here
    }
  }
  EmojiReactions.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    emojiType: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'EmojiReactions',
    timestamps: false,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'articleId', 'emojiType']
      }
    ]
  });
  return EmojiReactions;
};