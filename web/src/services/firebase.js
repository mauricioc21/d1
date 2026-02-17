/**
 * Firebase initialization for Su Todero D1 web app (compat API for shared data layer)
 */

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

import { firebaseConfig } from '@shared/config/firebase.config'

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export const firebaseApp = firebase.app()
export const auth = firebaseApp.auth()
export const firestore = firebaseApp.firestore()
export const storage = firebaseApp.storage()
export const FieldValue = firebase.firestore.FieldValue

export default firebaseApp
