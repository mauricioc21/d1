/**
 * useProjects - Hook to retrieve projects from Firestore
 */

import { useEffect, useState } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

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

export const useProjects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true

    const fetchProjects = async () => {
      setLoading(true)
      setError(null)

      try {
        const projectsRef = collection(firestore, PROJECTS_COLLECTION)
        const projectsQuery = query(projectsRef, orderBy('date', 'desc'))
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
  }, [])

  return { projects, loading, error }
}

export default useProjects
