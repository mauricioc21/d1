/**
 * useProjects - Hook to retrieve projects from Firestore (shared data layer)
 */

import { useEffect, useState } from 'react'

import { listProjectsByUser, listenProjectsByUser } from '../services/data'

export const useProjects = (options = {}) => {
  const { userId = null, enabled = true, limit = 50 } = options
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let isMounted = true
    let unsubscribe = null

    if (!enabled || !userId) {
      setProjects([])
      setLoading(false)
      setError(null)
      return () => {}
    }

    const loadProjects = async () => {
      setLoading(true)
      setError(null)

      try {
        const items = await listProjectsByUser(userId, { limit })
        if (isMounted) {
          setProjects(items)
        }
      } catch (err) {
        console.error('Error fetching projects', err)
        if (isMounted) {
          setError(err)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadProjects()

    try {
      unsubscribe = listenProjectsByUser(
        userId,
        (items) => {
          if (isMounted) {
            setProjects(items)
          }
        },
        {
          limit,
          onError: (err) => {
            console.error('Error listening to projects', err)
            if (isMounted) {
              setError(err)
            }
          },
        }
      )
    } catch (err) {
      console.error('Error subscribing to projects listener', err)
      if (isMounted) {
        setError(err)
      }
    }

    return () => {
      isMounted = false
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [userId, enabled, limit])

  return { projects, loading, error }
}

export default useProjects
