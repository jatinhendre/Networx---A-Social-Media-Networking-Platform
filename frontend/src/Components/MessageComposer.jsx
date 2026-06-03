import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { sendMessage } from '@/config/redux/action/MessageAction';
import styles from './MessageComposer.module.css';

export default function MessageComposer({ conversationId, onMessageSent }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSend = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsLoading(true);
    try {
      const message = await dispatch(sendMessage(conversationId, content));
      if (message) {
        setContent('');
        if (onMessageSent) {
          onMessageSent(message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.composerContainer} onSubmit={handleSend}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          placeholder="Type a message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
          className={styles.input}
        />
        <button
          type="submit"
          disabled={!content.trim() || isLoading}
          className={styles.sendButton}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
}
