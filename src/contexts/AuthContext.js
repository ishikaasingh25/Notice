import React, { createContext, useContext, useState, useEffect } from 'react';
import firebase from 'firebase/compat/app';
import { auth, firestore } from '../firebaseConfig'; 
// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};


export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [verificationId, setVerificationId] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  // Function to sign up new users with role selection
  const signUp = async (email, password, displayName, phoneNumber) => {
    try {
      const { user } = await auth.createUserWithEmailAndPassword(email, password);
      await user.updateProfile({ displayName });

      // Add additional user data to firestore
      await firestore.collection('users').doc(user.uid).set({
        displayName,
        phoneNumber
      });
      const phoneAuthProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneAuthProvider.verifyPhoneNumber(
        phoneNumber,
        new firebase.auth.RecaptchaVerifier('recaptcha-container'), // Optional parameter for recaptcha
      );
      setVerificationId(verificationId);
      localStorage.setItem('authVerificationId', verificationId);

      return user;
    } 
    catch (error) {
      console.error('Error signing up:', error.message);
      throw error;
    }
  };
  const verifyOTP = async (otp) => {
    try {
      const verificationId = localStorage.getItem('authVerificationId');
      if (!verificationId) {
        throw new Error('No verification ID found');
      }
      const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
      await auth.signInWithCredential(credential);
      localStorage.removeItem('authVerificationId');
      return auth.currentUser;
    } catch (error) {
      console.error('Error verifying OTP:', error.message);
      throw error;
    }
  };

  // Function to log in existing users
  const logIn = async (email, password) => {
    try {
      const { user } = await auth.signInWithEmailAndPassword(email, password);
      return user;
    } catch (error) {
      console.error('Error logging in:', error.message);
      throw error;
    }
  };

  // Function to log out current user
  const logOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error.message);
      throw error;
    }
  };

  // Value to be provided by AuthContext
  const value = {
    currentUser,
    signUp,
    logIn,
    logOut,
    verifyOTP
  };

  // Render AuthContext.Provider with children and value
  return (
    <AuthContext.Provider value={value}>
      {!loading && children} {/* Render children once loading is complete */}
    </AuthContext.Provider>
  );
};
