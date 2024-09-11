import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, googleProvider, db } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const createUserDocument = async (user) => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { email, uid, displayName } = user;
      const username = displayName || email.split('@')[0]; // Use display name or part of email as username
      
      try {
        await setDoc(userRef, {
          email,
          uid,
          username,
          hasAccess: false,
        });
      } catch (error) {
        console.error("Error creating user document:", error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await createUserDocument(user);
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await createUserDocument(result.user);
      return result.user;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);