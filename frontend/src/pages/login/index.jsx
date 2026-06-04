import React, { useEffect, useState } from 'react';
import UserLayout from '../layouts/UserLayout';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Eye, EyeOff, AlertCircle, Check, X } from 'lucide-react';
import styles from './login.module.css';
import { loginUser, registerUser } from '@/config/redux/action/AuthAction';
import { emptyMessage } from '@/config/redux/reducer/AuthReducer';

function Login() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  const [LoginMethod, setLoginMethod] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');

  // Validation States
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (authState.loggedIn) {
      router.push('/dashboard');
    }
  }, [authState.loggedIn, router]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push('/dashboard');
    }
  }, []);

  useEffect(() => {
    dispatch(emptyMessage());
  }, [LoginMethod, dispatch]);

  useEffect(() => {
    if (authState.message === "Registration Successful") {
      setLoginMethod(true);
      setErrors({});
      setSubmitted(false);
      setPassword('');
      setConfirmPassword('');
      setUsername('');
      setName('');
    }
  }, [authState.message]);

  // Validation Helpers
  const validateEmail = (emailVal) => {
    if (!emailVal) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) return "Invalid email address";
    return "";
  };

  const validatePassword = (passVal, isSignUp) => {
    if (!passVal) return "Password is required";
    if (isSignUp) {
      if (passVal.length < 8) return "Must be at least 8 characters";
      if (!/[A-Z]/.test(passVal)) return "Must contain an uppercase letter";
      if (!/[0-9]/.test(passVal)) return "Must contain a number";
      if (!/[@$!%*?&]/.test(passVal)) return "Must contain a special character (@$!%*?&)";
    }
    return "";
  };

  const validateUsername = (userVal) => {
    if (!userVal) return "Username is required";
    if (userVal.length < 3) return "Must be at least 3 characters";
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    if (!usernameRegex.test(userVal)) return "Only letters, numbers, _, ., - allowed";
    return "";
  };

  const validateName = (nameVal) => {
    if (!nameVal) return "Name is required";
    if (nameVal.trim().length < 2) return "Must be at least 2 characters";
    return "";
  };

  const validateConfirmPassword = (confirmVal, passVal) => {
    if (!confirmVal) return "Confirm password is required";
    if (confirmVal !== passVal) return "Passwords do not match";
    return "";
  };

  const handleAuth = () => {
    setSubmitted(true);
    const newErrors = {};

    if (LoginMethod) {
      // Sign In mode
      const emailErr = validateEmail(email);
      const passErr = validatePassword(password, false);
      if (emailErr) newErrors.email = emailErr;
      if (passErr) newErrors.password = passErr;
    } else {
      // Sign Up mode
      const userErr = validateUsername(username);
      const nameErr = validateName(name);
      const emailErr = validateEmail(email);
      const passErr = validatePassword(password, true);
      const confirmPassErr = validateConfirmPassword(confirmPassword, password);

      if (userErr) newErrors.username = userErr;
      if (nameErr) newErrors.name = nameErr;
      if (emailErr) newErrors.email = emailErr;
      if (passErr) newErrors.password = passErr;
      if (confirmPassErr) newErrors.confirmPassword = confirmPassErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (LoginMethod) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ username, password, name, email }));
    }
  };

  const statusColor = authState.isError ? '#ef4444' : '#10b981';
  const statusMessage = authState.message || '';

  // Password criteria checklist live checks
  const passLengthMet = password.length >= 8;
  const passUpperMet = /[A-Z]/.test(password);
  const passNumberMet = /[0-9]/.test(password);
  const passSpecialMet = /[@$!%*?&]/.test(password);

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.card_container}>
          <div className={styles.card_container_left}>
            <p className={styles.title}>{LoginMethod ? 'Sign In' : 'Sign Up'}</p>

            {statusMessage && (
              <p style={{ color: statusColor, fontWeight: 500, fontSize: '0.9rem', textAlign: 'center', marginTop: '10px' }}>
                {statusMessage}
              </p>
            )}

            <div className={styles.inputContainer}>
              {!LoginMethod && (
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <input
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        if (submitted) {
                          setErrors(prev => ({ ...prev, username: validateUsername(e.target.value) }));
                        }
                      }}
                      type="text"
                      className={`${styles.inputField} ${errors.username ? styles.inputFieldError : ''}`}
                      placeholder="username"
                      name="username"
                      autoComplete="off"
                    />
                    {errors.username && (
                      <span className={styles.errorText}>
                        <AlertCircle size={14} style={{ flexShrink: 0 }} /> {errors.username}
                      </span>
                    )}
                  </div>

                  <div className={styles.inputGroup}>
                    <input
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (submitted) {
                          setErrors(prev => ({ ...prev, name: validateName(e.target.value) }));
                        }
                      }}
                      type="text"
                      className={`${styles.inputField} ${errors.name ? styles.inputFieldError : ''}`}
                      placeholder="name"
                      name="name"
                      autoComplete="off"
                    />
                    {errors.name && (
                      <span className={styles.errorText}>
                        <AlertCircle size={14} style={{ flexShrink: 0 }} /> {errors.name}
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className={styles.inputGroup}>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (submitted) {
                      setErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }));
                    }
                  }}
                  className={`${styles.inputField} ${errors.email ? styles.inputFieldError : ''}`}
                  placeholder="email"
                  name="email"
                  autoComplete="off"
                />
                {errors.email && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} style={{ flexShrink: 0 }} /> {errors.email}
                  </span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (submitted) {
                        setErrors(prev => ({ ...prev, password: validatePassword(e.target.value, !LoginMethod) }));
                      }
                    }}
                    className={`${styles.inputField} ${errors.password ? styles.inputFieldError : ''}`}
                    placeholder="password"
                    name="password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} style={{ flexShrink: 0 }} /> {errors.password}
                  </span>
                )}
              </div>

              {!LoginMethod && (
                <div className={styles.inputGroup}>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (submitted) {
                          setErrors(prev => ({ ...prev, confirmPassword: validateConfirmPassword(e.target.value, password) }));
                        }
                      }}
                      className={`${styles.inputField} ${errors.confirmPassword ? styles.inputFieldError : ''}`}
                      placeholder="confirm password"
                      name="confirmPassword"
                      autoComplete="new-password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <span className={styles.errorText}>
                      <AlertCircle size={14} style={{ flexShrink: 0 }} /> {errors.confirmPassword}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className={styles.buttonPrimary} onClick={handleAuth}>
              <p>{LoginMethod ? 'Sign In' : 'Sign Up'}</p>
            </div>
          </div>

          <div className={styles.card_container_right}>
            <img className={styles.image} src="/images/login_logo.png" alt="logo" />

            {!LoginMethod ? <p style={{fontSize:'1.5rem'}}>Already have an account?</p> : <p style={{fontSize:'1.5rem'}}>New here?</p>}
            <div
              className={styles.buttonFill}
              onClick={() => {
                setLoginMethod(!LoginMethod);
                setErrors({});
                setSubmitted(false);
                setShowPassword(false);
                setConfirmPassword('');
              }} 
            >
              <p style={{ color: 'black', fontSize:'1rem' }}>{LoginMethod ? 'Sign Up' : 'Sign In'}</p>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default Login;
