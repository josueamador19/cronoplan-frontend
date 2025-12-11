// src/components/ui/CommentBox.jsx
import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const CommentBox = ({ user, onSubmit }) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim()) {
      onSubmit(comment);
      setComment('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="comment-box">
      <img
        src={user.avatar}
        alt={user.name}
        className="comment-avatar"
      />
      <input
        type="text"
        className="comment-input"
        placeholder="Escribe un comentario..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button
        className="comment-submit-btn"
        onClick={handleSubmit}
        disabled={!comment.trim()}
      >
        <FaPaperPlane />
      </button>
    </div>
  );
};

export default CommentBox;