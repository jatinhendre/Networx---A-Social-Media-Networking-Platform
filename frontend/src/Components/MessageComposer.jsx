import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from '@/config/redux/action/MessageAction';
import { getSocket } from '@/config/socket';
import styles from './MessageComposer.module.css';

export default function MessageComposer({ conversationId, onMessageSent }) {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const dispatch = useDispatch();

  const { token } = useSelector((state) => state.auth);
  const socket = getSocket(token);

  // Clean up typing status on unmount or active conversation change
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping && socket) {
        socket.emit('typing', { conversationId, isTyping: false });
      }
    };
  }, [isTyping, socket, conversationId]);

  const handleInputChange = (e) => {
    setContent(e.target.value);

    if (!socket) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', { conversationId, isTyping: true });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', { conversationId, isTyping: false });
    }, 2000);
  };

  const handleSend = async (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    setIsLoading(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
    if (socket) {
      socket.emit('typing', { conversationId, isTyping: false });
    }

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
          onChange={handleInputChange}
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
