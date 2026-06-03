import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import UserLayout from '@/pages/layouts/UserLayout';
import ConversationList from '@/Components/ConversationList';
import { fetchConversations, fetchUnreadCount } from '@/config/redux/action/ConversationAction';
import styles from './index.module.css';

export default function MessagesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, conversations } = useSelector(
    (state) => state.conversations
  );
  const { isTokenThere } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isTokenThere) {
      router.push('/login');
      return;
    }

    dispatch(fetchConversations());
    dispatch(fetchUnreadCount());
  }, [isTokenThere, dispatch]);

  if (!isTokenThere) {
    return null;
  }

  return (
    <UserLayout>
      <div className={styles.messagesPageContainer}>
        <div className={styles.sidebar}>
          <div className={styles.header}>
            <h1>Messages</h1>
          </div>
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
