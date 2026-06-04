import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styles from './MessageList.module.css';

const fallbackAvatar = '/default.jpg';

export default function MessageList({ conversationId }) {
  const { messages } = useSelector((state) => state.messages);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { conversations, currentConversation, typingConversations = {} } = useSelector((state) => state.conversations);
  const messageEndRef = useRef(null);
  const currentUserId = currentUser?._id?.toString?.() || currentUser?._id;
  const isOtherUserTyping = typingConversations[conversationId];

  const activeConversation =
    currentConversation?._id === conversationId
      ? currentConversation
      : conversations.find((c) => c._id === conversationId) || null;
  const otherUser = activeConversation?.participants?.find(
    (p) => p._id !== currentUserId
  );
  const otherUserAvatar = otherUser?.profilePicture;

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOtherUserTyping]);

  const showEmptyState = (!messages || messages.length === 0) && !isOtherUserTyping;

  if (showEmptyState) {
    return (
      <div className={styles.emptyState}>
        <p>No messages yet. Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className={styles.messageListContainer}>
      {messages && messages.map((message) => {
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
      {isOtherUserTyping && (
        <div className={`${styles.messageWrapper} ${styles.received}`}>
          <div className={styles.senderInfo}>
            <img
              src={otherUserAvatar || fallbackAvatar}
              alt="Typing..."
              className={styles.avatar}
              onError={(event) => {
                event.currentTarget.src = fallbackAvatar;
              }}
            />
          </div>
          <div className={styles.messageBubble} style={{ padding: '0.5rem 0.75rem' }}>
            <div className={styles.typingIndicatorDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      <div ref={messageEndRef} />
    </div>
  );
}
