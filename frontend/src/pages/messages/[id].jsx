import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import UserLayout from '@/pages/layouts/UserLayout';
import ConversationList from '@/Components/ConversationList';
import MessageList from '@/Components/MessageList';
import MessageComposer from '@/Components/MessageComposer';
import {
  fetchMessages,
  clearMessagesAction,
} from '@/config/redux/action/MessageAction';
import { markConversationAsRead } from '@/config/redux/action/MessageAction';
import {
  fetchConversations,
} from '@/config/redux/action/ConversationAction';
import { setCurrentConversation } from '@/config/redux/reducer/ConversationReducer';
import { getSocket } from '@/config/socket';
import styles from './conversation.module.css';

const fallbackAvatar = '/default.jpg';

export default function ConversationPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = router.query;
  const { isTokenThere, token, user: currentUser } = useSelector(
    (state) => state.auth
  );
  const { conversations, currentConversation, onlineUsers = [], typingConversations = {} } = useSelector(
    (state) => state.conversations
  );
  const { messages, isLoading } = useSelector((state) => state.messages);
  const activeConversation =
    currentConversation?._id === id
      ? currentConversation
      : conversations.find((conversation) => conversation._id === id) || null;

  useEffect(() => {
    if (!isTokenThere) {
      router.push('/login');
      return;
    }
  }, [isTokenThere]);

  // Load messages when conversation ID changes
  useEffect(() => {
    if (id && isTokenThere) {
      if (!conversations.length) {
        dispatch(fetchConversations());
      }

      dispatch(fetchMessages(id));
      dispatch(markConversationAsRead(id));
    }
  }, [id, isTokenThere, conversations.length, dispatch]);

  useEffect(() => {
    if (id && activeConversation && currentConversation?._id !== activeConversation._id) {
      dispatch(setCurrentConversation(activeConversation));
    }
  }, [id, activeConversation, currentConversation?._id, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearMessagesAction());
    };
  }, [dispatch]);

  // Setup Socket.IO listeners
  useEffect(() => {
    if (!id || !isTokenThere || !token) return;

    const socket = getSocket(token);
    if (!socket) return;

    // Join conversation room
    socket.emit('join_conversations');

    // Listen for new messages
    const handleMessageReceived = (data) => {
      if (data.conversationId === id) {
        dispatch({ type: 'message/addMessage', payload: data.message });
        socket.emit('mark_as_read', { conversationId: id });
      }
    };

    // Listen for read receipts
    const handleMessagesRead = (data) => {
      if (data.conversationId === id) {
        dispatch({
          type: 'message/markMessagesAsRead',
          payload: data.readBy,
        });
      }
    };

    socket.on('message_received', handleMessageReceived);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('message_received', handleMessageReceived);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [id, isTokenThere, token, dispatch]);

  if (!isTokenThere) {
    return null;
  }

  const otherUser = activeConversation?.participants?.find(
    (participant) => participant._id !== currentUser?._id
  );

  const isOnline = otherUser && onlineUsers.includes(otherUser._id);
  const isTyping = activeConversation && typingConversations[activeConversation._id];

  return (
    <UserLayout showMobileDrawer>
      <div className={styles.conversationPageContainer}>
        <div className={styles.sidebar}>
          <div className={styles.header}>
            <h1>Messages</h1>
          </div>
          <ConversationList />
        </div>
        <div className={styles.chatWindow}>
          {id && activeConversation ? (
            <>
              <div className={styles.chatHeader}>
                <button
                  type="button"
                  onClick={() => router.push('/messages')}
                  className={styles.backButton}
                  aria-label="Back to messages"
                >
                  <ArrowLeft size={20} />
                </button>
                {otherUser && (
                  <>
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
                    <div className={styles.userInfo}>
                      <h2>{otherUser.name}</h2>
                      {isTyping ? (
                        <p className={styles.activeStatusText}>Typing...</p>
                      ) : isOnline ? (
                        <p className={styles.activeStatusText}>Active now</p>
                      ) : (
                        <p>@{otherUser.username}</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              {isLoading ? (
                <div className={styles.loadingState}>Loading messages...</div>
              ) : (
                <MessageList conversationId={id} />
              )}
              <MessageComposer conversationId={id} />
            </>
          ) : (
            <div className={styles.emptyState}>
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
