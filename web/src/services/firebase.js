/**
 * Firebase initialization for Su Todero D1 web app
 */

import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

import { firebaseConfig } from '@shared/config/firebase.config'

let firebaseAppInstance = null

const getFirebaseApp = () => {
  if (!firebaseAppInstance) {
    firebaseAppInstance = getApps().length
      ? getApps()[0]
      : initializeApp(firebaseConfig)
  }

  return firebaseAppInstance
}

export const firebaseApp = getFirebaseApp()
export const auth = getAuth(firebaseApp)
export const firestore = getFirestore(firebaseApp)
export const storage = getStorage(firebaseApp)

export default firebaseApp
