import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { setCurrentConversation } from '@/config/redux/reducer/ConversationReducer';
import styles from './ConversationList.module.css';

const fallbackAvatar = '/default.jpg';

export default function ConversationList({ onSelectConversation }) {
  const { conversations, onlineUsers = [] } = useSelector((state) => state.conversations);
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSelectConversation = (conversation) => {
    dispatch(setCurrentConversation(conversation));
    if (onSelectConversation) {
      onSelectConversation(conversation);
    }
    router.push(`/messages/${conversation._id}`);
  };

  const getOtherUser = (conversation) => {
    return conversation.participants.find(
      (p) => p._id !== currentUser?._id
    );
  };

  const getLastMessagePreview = (conversation) => {
    if (!conversation.lastMessage) return 'No messages yet';
    const message = conversation.lastMessage;
    const maxLength = 50;
    return (
      message.content?.substring(0, maxLength) +
        (message.content?.length > maxLength ? '...' : '') ||
      'Attachment'
    );
  };

  if (!conversations || conversations.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <div className={styles.conversationListContainer}>
      {conversations.map((conversation) => {
        const otherUser = getOtherUser(conversation);
        const isOnline = otherUser && onlineUsers.includes(otherUser._id);

        return (
          <div
            key={conversation._id}
            className={`${styles.conversationItem} ${
              conversation._id === router.query.id ? styles.activeConversation : ''
            }`}
            onClick={() => handleSelectConversation(conversation)}
          >
            <div className={styles.avatarWrapper}>
              <img
                src={otherUser.profilePicture || fallbackAvatar}
                alt={otherUser.username}
                className={styles.avatar}
                onError={(event) => {
                  event.currentTarget.src = fallbackAvatar;
                }}
              />
              {isOnline && <span className={styles.onlineIndicator} />}
            </div>
            <div className={styles.conversationInfo}>
              <div className={styles.header}>
                <h3 className={styles.name}>{otherUser.name}</h3>
                <span className={styles.time}>
                  {new Date(conversation.lastMessageAt).toLocaleString([], {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className={styles.previewContainer}>
                <p className={`${styles.preview} ${conversation.unreadCount > 0 ? styles.unreadPreview : ''}`}>
                  {getLastMessagePreview(conversation)}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className={styles.unreadBadge}>
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
