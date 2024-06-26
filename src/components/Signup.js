import React, { useRef, useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import firebase from 'firebase/compat/app';

export default function SignUp() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const displayNameRef = useRef();
  const phoneNumberRef = useRef();
  const roleRef = useRef();
  const otpRef = useRef();
  const { signUp, verifyOTP } = useAuth();
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved - allow user to proceed
        },
        'expired-callback': () => {
          // Response expired - ask user to solve reCAPTCHA again
        }
      });
    }
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await signUp(
        emailRef.current.value,
        passwordRef.current.value,
        displayNameRef.current.value,
        phoneNumberRef.current.value,
        roleRef.current.value
      );
      setOtpSent(true);
    } catch (error) {
      console.error('Error signing up:', error.message);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await verifyOTP(otpRef.current.value);
      navigate('/home');
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input type="text" ref={displayNameRef} placeholder="Display Name" required />
        <input type="email" ref={emailRef} placeholder="Email" required />
        <input type="password" ref={passwordRef} placeholder="Password" required />
        <input type="text" ref={phoneNumberRef} placeholder="Phone Number" required />
        <select ref={roleRef} required>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
        </select>
        <div id="recaptcha-container"></div>
        <button type="submit">Sign Up</button>
      </form>
      {otpSent && (
        <form onSubmit={handleVerifyOTP}>
          <input type="text" ref={otpRef} placeholder="Enter OTP" required />
          <button type="submit">Verify OTP</button>
        </form>
      )}
    </div>
  );
}
