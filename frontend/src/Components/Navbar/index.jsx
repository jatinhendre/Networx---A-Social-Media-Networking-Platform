import React from 'react'
import styles from './styles.module.css'
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/AuthReducer';

function Navbar() {
  const authState = useSelector((state)=>state.auth);
    const router = useRouter();
    const dispatch = useDispatch();
    const isLoggedIn = authState.loggedIn || authState.isTokenThere;
  return (
    <div className={styles.container}>
        <nav>
            <h1 style={{cursor: "pointer"}} onClick={()=>{
                router.push("/")
            }}>Networx</h1>
            {isLoggedIn && (
  <div style={{display:'flex', gap:'1.2rem'}}>
    Hey.. {authState.user?.name || 'User'}
    <p style={{fontWeight:'bold'}}>Profile</p>
    <p onClick={() => {localStorage.removeItem('token'); router.push("/login"); dispatch(reset())}} style={{fontWeight:'semibold',cursor:'pointer'}}>LogOut</p>
  </div>
)}

            {!isLoggedIn && <div className={styles.navOptions}>
                <button
            className={styles.heroButton}
            onClick={() => router.push("/login")}
          >
            Be a part!
          </button>
            </div>}
        </nav>
    </div>
  )
}

export default Navbar