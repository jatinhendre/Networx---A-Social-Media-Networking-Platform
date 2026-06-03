import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './MessageList.module.css';

const fallbackAvatar = '/default.jpg';

export default function MessageList({ conversationId }) {
  const { messages } = useSelector((state) => state.messages);
  const { user: currentUser } = useSelector((state) => state.auth);
  const messageEndRef = useRef(null);
  const currentUserId = currentUser?._id?.toString?.() || currentUser?._id;

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!messages || messages.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className={styles.messageListContainer}>
      {messages.map((message) => {
        const isSentByCurrentUser =
          Boolean(currentUserId) && message.senderId?._id === currentUserId;

        return (
          <div
            key={message._id}
            className={`${styles.messageWrapper} ${
              isSentByCurrentUser ? styles.sent : styles.received
            }`}
          >
            {!isSentByCurrentUser && (
              <div className={styles.senderInfo}>
                <img
                  src={message.senderId.profilePicture || fallbackAvatar}
                  alt={message.senderId.username}
                  className={styles.avatar}
                  onError={(event) => {
                    event.currentTarget.src = fallbackAvatar;
                  }}
                />
              </div>
            )}
            <div className={styles.messageBubble}>
              <p className={styles.content}>{message.content}</p>
              <span className={styles.timestamp}>
                {new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              {isSentByCurrentUser && message.isRead && (
                <span className={styles.readIndicator}>✓✓</span>
              )}
            </div>
          </div>
        );
      })}
      <div ref={messageEndRef} />
    </div>
  );
}
