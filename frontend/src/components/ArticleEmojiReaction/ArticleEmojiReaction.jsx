import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toggleEmojiReaction from "../../services/toggleEmojiReaction";

const DEFAULT_EMOJI_LIST = [
  { type: 'like', emoji: '👍' },
  { type: 'love', emoji: '❤️' },
  { type: 'laugh', emoji: '😂' },
  { type: 'surprise', emoji: '😮' },
  { type: 'sad', emoji: '😢' },
  { type: 'angry', emoji: '😡' }
];

function ArticleEmojiReaction({ slug, userReactions = [], reactionCounts = {}, onReactionUpdate }) {
  const [loadingStates, setLoadingStates] = useState({});
  const { headers, isAuth } = useAuth();

  const handleEmojiClick = async (emojiType) => {
    if (!isAuth) return alert("You need to login first");

    const isReacted = userReactions.includes(emojiType);
    setLoadingStates(prev => ({ ...prev, [emojiType]: true }));

    try {
      const updatedArticle = await toggleEmojiReaction({
        slug,
        emojiType,
        isReacted,
        headers
      });
      if (onReactionUpdate) {
        onReactionUpdate(updatedArticle);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [emojiType]: false }));
    }
  };

  return (
    <div className="emoji-reactions-container d-flex gap-2 mt-3 mb-3">
      {DEFAULT_EMOJI_LIST.map(({ type, emoji }) => {
        const isReacted = userReactions.includes(type);
        const count = reactionCounts[type] || 0;
        const isLoading = loadingStates[type] || false;
        return (
          <button
            key={type}
            className={`btn btn-sm ${isReacted ? 'btn-primary' : 'btn-outline-secondary'}`}
            disabled={isLoading}
            onClick={() => handleEmojiClick(type)}
          >
            <span className="emoji-icon">{emoji}</span>
            <span className="ms-1 reaction-count">{count}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ArticleEmojiReaction;