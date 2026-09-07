import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'

export function ProtectedRoute() {
  const { profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (!profile) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
