import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import UserLayout from '@/pages/layouts/UserLayout';
import ConversationList from '@/Components/ConversationList';
import { fetchConversations, fetchUnreadCount, findOrCreateConversation } from '@/config/redux/action/ConversationAction';
import { getMyConnections } from '@/config/redux/action/AuthAction';
import styles from './index.module.css';

const fallbackAvatar = '/default.jpg';

export default function MessagesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useSelector(
    (state) => state.conversations
  );
  const authState = useSelector((state) => state.auth);
  const [searchQuery, setSearchQuery] = useState('');

  const acceptedConnections = useMemo(
    () => (authState.connections || []).filter((conn) => conn.status_accepted === true),
    [authState.connections]
  );

  const getOtherUser = (conn) => {
    if (!conn || !authState.user) return null;
    const currentUserId = String(authState.user._id);
    const senderId = String(conn.userId?._id || conn.userId);

    return senderId === currentUserId ? conn.connectionId : conn.userId;
  };

  const filteredConnections = useMemo(() => {
    if (!searchQuery.trim()) return acceptedConnections;

    const term = searchQuery.toLowerCase();
    return acceptedConnections.filter((conn) => {
      const otherUser = getOtherUser(conn);
      return (
        otherUser?.name?.toLowerCase().includes(term) ||
        otherUser?.username?.toLowerCase().includes(term) ||
        otherUser?.email?.toLowerCase().includes(term)
      );
    });
  }, [acceptedConnections, searchQuery, authState.user]);

  useEffect(() => {
    if (!authState.isTokenThere) {
      router.push('/login');
      return;
    }

    dispatch(fetchConversations());
    dispatch(fetchUnreadCount());
    if (!authState.connections?.length) {
      const token = localStorage.getItem('token');
      if (token) {
        dispatch(getMyConnections({ token }));
      }
    }
  }, [authState.isTokenThere, authState.connections?.length, dispatch, router]);

  const getAvatarUrl = (user) => {
    return user?.profilePicture && user.profilePicture !== ''
      ? user.profilePicture
      : fallbackAvatar;
  };

  const startChat = async (user) => {
    if (!user?._id) return;
    const conversation = await dispatch(findOrCreateConversation(user._id));
    if (conversation) {
      router.push(`/messages/${conversation._id}`);
    }
  };

  if (!authState.isTokenThere) {
    return null;
  }

  return (
    <UserLayout hideFooter>
      <div className={styles.messagesPageContainer}>
        <div className={styles.sidebar}>
          <div className={styles.header}>
            <h1>Messages</h1>
          </div>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search connections to message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          {searchQuery.trim() && (
            <div className={styles.quickConnections}>
              <h3>Search Results</h3>
              {filteredConnections.length === 0 ? (
                <p className={styles.emptyConnections}>No connections found.</p>
              ) : (
                filteredConnections.map((conn) => {
                  const user = getOtherUser(conn);
                  if (!user) return null;

                  return (
                    <button
                      key={conn._id}
                      type="button"
                      className={styles.connectionItem}
                      onClick={() => startChat(user)}
                    >
                      <img
                        src={getAvatarUrl(user)}
                        alt={user.username}
                        className={styles.connectionAvatar}
                        onError={(event) => {
                          event.currentTarget.src = fallbackAvatar;
                        }}
                      />
                      <span className={styles.connectionName}>{user.name}</span>
                      <span className={styles.connectionHandle}>@{user.username}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}
          {isLoading ? (
            <div className={styles.loadingState}>Loading conversations...</div>
          ) : (
            <ConversationList />
          )}
        </div>
        <div className={styles.mainContent}>
          <div className={styles.emptyState}>
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
