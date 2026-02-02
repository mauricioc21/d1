/**
 * useProjects - Hook to retrieve projects from Firestore
 */

import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore'

import { firestore } from '../services/firebase'
import { firestoreCollections } from '@shared/config/firebase.config'

const PROJECTS_COLLECTION = firestoreCollections.projects || 'projects'

const mapProjectDocument = (doc) => {
  const data = doc.data()

  return {
    id: doc.id,
    name: data?.name ?? 'Proyecto sin nombre',
    date: data?.date?.toDate ? data.date.toDate() : data?.date ?? null,
    images: data?.images ?? 0,
    scans: data?.scans ?? 0,
    status: data?.status ?? 'active',
    storage: data?.storageLocation ?? 'firebase',
    captureType: data?.captureType ?? 'photo',
    userId: data?.userId ?? null,
    raw: data,
  }
}

export const useProjects = (options = {}) => {
  const { userId = null, enabled = true } = options
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchProjects = async () => {
      if (!enabled) {
        setProjects([])
        setLoading(false)
        return
      }

      if (!userId) {
        setProjects([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const projectsRef = collection(firestore, PROJECTS_COLLECTION)
        const constraints = [where('userId', '==', userId), orderBy('date', 'desc')]
        const projectsQuery = query(projectsRef, ...constraints)
        const snapshot = await getDocs(projectsQuery)
        const fetchedProjects = snapshot.docs.map(mapProjectDocument)

        if (isMounted) {
          setProjects(fetchedProjects)
        }
      } catch (err) {
        console.error('Error fetching projects from Firestore', err)
        if (isMounted) {
          setError(err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProjects()

    return () => {
      isMounted = false
    }
  }, [userId, enabled])

  return { projects, loading, error }
}

export default useProjects
