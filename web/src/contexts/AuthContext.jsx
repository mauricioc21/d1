import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import firebase from 'firebase/compat/app'

import { auth, firestore } from '../services/firebase'
import { firestoreCollections } from '@shared/config/firebase.config'

const USERS_COLLECTION = firestoreCollections?.users || 'users'
const serverTimestamp = () => firebase.firestore.FieldValue.serverTimestamp()

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      if (firebaseUser) {
        try {
          await firestore
            .collection(USERS_COLLECTION)
            .doc(firebaseUser.uid)
            .set(
              {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || '',
                photoURL: firebaseUser.photoURL || '',
                lastLoginAt: serverTimestamp(),
              },
              { merge: true }
            )
        } catch (error) {
          console.error('Error syncing user profile in Firestore', error)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    const credential = await auth.signInWithEmailAndPassword(email, password)
    return credential.user
  }

  const register = async ({ email, password, displayName }) => {
    const credential = await auth.createUserWithEmailAndPassword(email, password)

    if (displayName) {
      await credential.user.updateProfile({ displayName })
    }

    await firestore
      .collection(USERS_COLLECTION)
      .doc(credential.user.uid)
      .set(
        {
          email,
          displayName: displayName || '',
          createdAt: serverTimestamp(),
        },
        { merge: true }
      )

    return credential.user
  }

  const updateUserProfile = async (updates = {}) => {
    if (!auth.currentUser) return null

    if (updates.displayName) {
      await auth.currentUser.updateProfile({ displayName: updates.displayName })
    }

    await firestore
      .collection(USERS_COLLECTION)
      .doc(auth.currentUser.uid)
      .set(
        {
          ...updates,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      )

    return auth.currentUser
  }

  const logout = () => auth.signOut()

  const resetPassword = (email) => auth.sendPasswordResetEmail(email)

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      resetPassword,
      updateUserProfile,
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
