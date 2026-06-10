import axios from "axios";
import errorHandler from "../helpers/errorHandler";

async function toggleEmojiReaction({ slug, emojiType, isReacted, headers }) {
  try {
    const { data } = await axios({
      headers,
      method: isReacted ? "DELETE" : "POST",
      url: `api/articles/${slug}/emoji-reactions`,
      data: { emojiType }
    });

    return data.article;
  } catch (error) {
    errorHandler(error);
  }
}

export default toggleEmojiReaction;