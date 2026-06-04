import React from 'react';
import { useRouter } from 'next/router';
import styles from './MobileNavigationDrawer.module.css';

export default function MobileNavigationDrawer({ isOpen, onClose }) {
  const router = useRouter();

  return (
    <div className={`${styles.mobileDrawer} ${isOpen ? styles.drawerOpen : ''}`}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
        ✕
      </button>

      <div
        className={styles.drawerOption}
        onClick={() => {
          router.push('/dashboard');
          onClose();
        }}
      >
        Scroll
      </div>

      <div
        className={styles.drawerOption}
        onClick={() => {
          router.push('/discover');
          onClose();
        }}
      >
        Discover
      </div>

      <div
        className={styles.drawerOption}
        onClick={() => {
          router.push('/my_connections');
          onClose();
        }}
      >
        My Connections
      </div>
    </div>
  );
}
