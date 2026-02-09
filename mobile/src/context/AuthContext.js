import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { firestoreCollections } from '../../../shared/config/firebase.config';

const USERS_COLLECTION = firestoreCollections?.users || 'users';

const AuthContext = createContext({
  user: null,
  initializing: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
});

const mapUserProfile = (firebaseUser, profileDoc) => {
  const profileData = profileDoc?.data?.() || profileDoc || {};

  return {
    uid: firebaseUser?.uid,
    email: firebaseUser?.email,
    displayName: firebaseUser?.displayName || profileData?.displayName || 'Usuario',
    photoURL: firebaseUser?.photoURL || profileData?.photoURL || null,
    phoneNumber: firebaseUser?.phoneNumber || profileData?.phoneNumber || null,
    providerId: firebaseUser?.providerId,
    metadata: firebaseUser?.metadata,
    profile: profileData,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userDoc = await firestore()
            .collection(USERS_COLLECTION)
            .doc(firebaseUser.uid)
            .get();

          setUser(mapUserProfile(firebaseUser, userDoc));
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Error cargando perfil de usuario:', err);
        setError(err);
        setUser({ uid: firebaseUser?.uid, email: firebaseUser?.email });
      } finally {
        setInitializing(false);
      }
    });

    return subscriber;
  }, []);

  const login = async (email, password) => {
    setError(null);
    return auth().signInWithEmailAndPassword(email.trim(), password);
  };

  const register = async ({ name, email, password }) => {
    setError(null);

    const credential = await auth().createUserWithEmailAndPassword(email.trim(), password);
    await credential.user.updateProfile({ displayName: name });

    await firestore().collection(USERS_COLLECTION).doc(credential.user.uid).set(
      {
        displayName: name,
        email: email.trim(),
        createdAt: firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    setUser(mapUserProfile(credential.user, { data: () => ({ displayName: name, email: email.trim() }) }));

    return credential.user;
  };

  const logout = async () => {
    setError(null);
    await auth().signOut();
    setUser(null);
  };

  const resetPassword = async (email) => {
    setError(null);
    await auth().sendPasswordResetEmail(email.trim());
  };

  const value = useMemo(
    () => ({
      user,
      initializing,
      login,
      register,
      logout,
      resetPassword,
      authError: error,
    }),
    [user, initializing, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
