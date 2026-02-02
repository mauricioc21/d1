import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'
import { doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore'

import { auth, firestore } from '../services/firebase'
import { firestoreCollections } from '@shared/config/firebase.config'

const USERS_COLLECTION = firestoreCollections?.users || 'users'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)

      if (firebaseUser) {
        try {
          const userDocRef = doc(firestore, USERS_COLLECTION, firebaseUser.uid)
          await setDoc(
            userDocRef,
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
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return credential.user
  }

  const register = async ({ email, password, displayName }) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password)

    if (displayName) {
      await updateProfile(credential.user, { displayName })
    }

    const userDocRef = doc(firestore, USERS_COLLECTION, credential.user.uid)
    await setDoc(
      userDocRef,
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
      await updateProfile(auth.currentUser, { displayName: updates.displayName })
    }

    const userDocRef = doc(firestore, USERS_COLLECTION, auth.currentUser.uid)
    await updateDoc(userDocRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    })

    return auth.currentUser
  }

  const logout = () => signOut(auth)

  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

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
