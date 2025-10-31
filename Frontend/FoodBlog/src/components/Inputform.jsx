
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


export const Inputform = ({ setIsModalOpen, onSuccessLogin }) => {
  const styles = {
    form: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
    label: { fontWeight: 500, color: '#333' },
    input: {
      padding: '0.7rem',
      borderRadius: '6px',
      border: '1px solid #ccc',
      fontSize: '1rem',
    },
    button: {
      backgroundColor: '#4caf50',
      color: 'white',
      border: 'none',
      padding: '0.8rem 1.2rem',
      borderRadius: '6px',
      cursor: 'pointer',
      marginTop: '0.5rem',
      fontWeight: 'bold',
    },
    registerText: {
      textAlign: 'center',
      fontSize: '0.9rem',
      color: '#007bff',
      marginTop: '0.5rem',
      cursor: 'pointer',
    },
    otpInput: {
      width: '3rem',
      textAlign: 'center',
      fontSize: '1.2rem',
      padding: '0.5rem',
      borderRadius: '6px',
      border: '1px solid #ccc',
    },
    errorText: {
      color: 'red',
      fontSize: '0.9rem',
      marginTop: '0.3rem',
      animation: 'blinkError 0.4s ease-in-out',
    },
    passwordWrapper: {
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
    },
    togglePassword: {
      position: 'absolute',
      padding: '0.5rem',
      right: '10px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      color: '#007bff',
      fontWeight: 'bold',
    },
  };

  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [otpTimer, setOtpTimer] = useState(30);
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [fieldsLocked, setFieldsLocked] = useState(false);
  const [message, setMessage] = useState('');

  const otpRefs = useRef([]);


  const showMessage = (msg) => {
  setMessage('');
  setTimeout(() => setMessage(msg), 10);
  setTimeout(() => setMessage(''), 5000); // clears after 5s
  };



  const resetForm = () => {
    setEmail('');
    setMobile('');
    setPassword('');
    setOtp(['', '', '', '']);
    setOtpSent(false);
    setOtpVerified(false);
    setOtpExpired(false);
    setOtpTimer(30);
    setError('');
  };

  useEffect(() => {
    resetForm();
  }, []);

  useEffect(() => {
    resetForm();
  }, [isSignUp]);

  useEffect(() => {
    let timer;
    if (otpSent && !otpVerified && !otpExpired) {
      timer = setInterval(() => {
        setOtpTimer((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setOtpExpired(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpVerified, otpExpired]);

  const showError = (msg) => {
    setError('');
    setTimeout(() => {
      setError(msg);
    }, 10);
    setTimeout(() => setError(''), 3000);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }

    if (updatedOtp.every((digit) => digit !== '')) {
      autoVerifyOtp(updatedOtp.join(''));
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleSendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/send-otp', { phone: `+91${mobile}` });
      setOtpSent(true);
      setOtpExpired(false);
      setOtpTimer(30);
      setOtp(['', '', '', '']);
      alert('OTP sent via SMS and WhatsApp!');
    } catch (err) {
      console.error(err);
      showError('Failed to send OTP. Try again.');
    }
  };

  const autoVerifyOtp = async (otpString) => {
    if (otpExpired) {
      showError('OTP expired. Please resend.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/verify-otp', {
        phone: `+91${mobile}`,
        otp: otpString,
      });

      if (res.data.success) {
        setOtpVerified(true);
        setFieldsLocked(true);
        alert('OTP Verified. You can now create your account.');
      } else {
        showError('Invalid OTP');
      }
    } catch (err) {
      console.error(err);
      showError('OTP verification failed.');
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp && !otpVerified) {
      alert('Please verify OTP first.');
      return;
    }

    const endpoint = isSignUp ? 'signUp' : 'login';

    try {
      const res = await axios.post(`http://localhost:5000/${endpoint}`, {
        email,
        password,
        phone: `+91${mobile}`,
      });

      if (!isSignUp) {
        alert('Login successful!');
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        resetForm();
        setIsModalOpen();
        if (onSuccessLogin) onSuccessLogin();
      } else {
        setIsSignUp(false);
        resetForm();
        setFieldsLocked(false);
        showMessage('Account created successfully! Please login.');
      }

      setError('');
    } catch (err) {
      console.error(err);
      const message =
        err.response?.data?.error === 'User already exists'
          ? 'User already exists'
          : err.response?.data?.error || 'Something went wrong!';
      showError(message);
    }
  };

  return (
    
    <form style={styles.form} onSubmit={handleOnSubmit} autoComplete="off">
      <label style={styles.label}>Email</label>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
        disabled={fieldsLocked}
        required
      />


      {isSignUp && (
        <>            
          <label style={styles.label}>Mobile Number</label>
          <input
            type="tel"
            placeholder="Enter valid mobile no"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            style={styles.input}
            disabled={fieldsLocked}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !otpSent) {
                e.preventDefault();
                handleSendOtp();
              }
            }}
            required
          />
          {!otpSent && (
            <button
              type="button"
              style={{ ...styles.button, backgroundColor: '#2196f3' }}
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          ) }
        </>
      )}

      {isSignUp && otpSent && !otpVerified && (
        <>
          <label style={styles.label}>Enter OTP</label>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                ref={(el) => (otpRefs.current[idx] = el)}
                style={styles.otpInput}
              />
            ))}
          </div>

          
          {!otpVerified && (
            <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
              {otpExpired ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  style={{
                    ...styles.button,
                    backgroundColor: '#f44336',
                    padding: '0.5rem 1rem',
                    fontSize: '0.9rem',
                  }}
                >
                  Resend OTP
                </button>
              ) : (
                <p style={{ color: 'red', fontSize: '0.85rem' }}>
                  OTP valid for <strong>{otpTimer}</strong> seconds
                </p>
              )}
            </div>
          )}
        </>
      )}

      <label style={styles.label}>Password</label>
      <div style={styles.passwordWrapper}>
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ ...styles.input, paddingRight: '3rem' }}
          autoComplete="new-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          style={styles.togglePassword}
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      <button type="submit" style={styles.button}>
        {isSignUp ? 'Signup' : 'Login'}
      </button>

      {/* {error && <h6 style={styles.errorText}>{error}</h6>}
 */}
      {message && <h6 style={{ color: 'green', fontSize: '0.9rem', marginTop: '0.3rem' }}>{message}</h6>}

      <p
        onClick={() => {
          setIsSignUp((prev) => !prev);
          setError('');
          setMessage('');
          setFieldsLocked(false);
          resetForm();
        }}
        style={styles.registerText}
      >
        {isSignUp ? 'Already have an account?' : 'Create new account'}
      </p>

      <style>{`
        @keyframes blinkError {
          0% { opacity: 1; }
          50% { opacity: 0.2; }
          100% { opacity: 1; }
        }
      `}</style>
    </form>
    
  );
};





