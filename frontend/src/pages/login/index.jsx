import React, { useEffect, useState } from 'react';
import UserLayout from '../layouts/UserLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from './login.module.css';
import { loginUser, registerUser } from '@/config/redux/action/AuthAction';
import { emptyMessage } from '@/config/redux/reducer/AuthReducer';

function Login() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [LoginMethod, setLoginMethod] = useState(false); // false => Sign Up, true => Sign In
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  const router = useRouter();

  useEffect(() => {
    if (authState.loggedIn) {
      router.push('/dashboard');
    }
  }, [authState.loggedIn, router]);


  useEffect(()=>{
    if(localStorage.getItem("token")){
      router.push('/dashboard');
    }
  },[])
useEffect(()=>{
  dispatch(emptyMessage());
},[LoginMethod,dispatch])

  const handleRegister = () => {
    dispatch(registerUser({ username, password, name, email }));
   
  };
  useEffect(()=>{
    if(authState.message === "Registration Successful"){
    setLoginMethod(true);
   }
  },[authState.message])

  
  const handleAuth = () => {
    if (LoginMethod) {
      // Sign In mode
      dispatch(loginUser({ email, password }));
    } else {
      // Sign Up mode
      handleRegister();
    }
  };

  const statusColor = authState.isError ? 'red' : 'green';
  const statusMessage = authState.message || '';

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.card_container}>
          <div className={styles.card_container_left}>
            <p className={styles.title}>{LoginMethod ? 'Sign In' : 'Sign Up'}</p>

            {statusMessage && (
              <p style={{ color: statusColor }}>{statusMessage}</p>
            )}

            <div className={styles.inputContainer}>
              {!LoginMethod && (
                <div className={styles.inputRow}>
                  <input
                    onChange={(e) => setUsername(e.target.value)}
                    type="text"
                    className={styles.inputField}
                    placeholder="username"
                    name="username"
                  />
                  <input
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    className={styles.inputField}
                    placeholder="name"
                    name="name"
                  />
                </div>
              )}

              <input
                type="text"
                onChange={(e) => setEmail(e.target.value)}
                className={styles.inputField}
                placeholder="email"
                name="email"
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className={styles.inputField}
                placeholder="password"
                name="password"
              />
            </div>

            <div className={styles.buttonOutline} onClick={handleAuth}>
              <p>{LoginMethod ? 'Sign In' : 'Sign Up'}</p>
            </div>
          </div>

          <div className={styles.card_container_right}>
            {!LoginMethod ? <p>Already have an account?</p> : <p>New here?</p>}
            <div
              className={styles.buttonFill}
              onClick={() => {
                setLoginMethod(!LoginMethod);
              }}  
            >
              <p style={{color:'black'}}>{LoginMethod ? 'Sign Up' : 'Sign In'}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default Login;
