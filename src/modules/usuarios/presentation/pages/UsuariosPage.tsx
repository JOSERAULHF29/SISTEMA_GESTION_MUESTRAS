import { useUsuarios } from '@/shared/hooks/useUsuarios'
import { RoleBadge } from '@/shared/components/RoleBadge'
import { Users, AlertCircle, UserCheck, UserX } from 'lucide-react'

export function UsuariosPage() {
  const { usuarios, loading, error, handleToggleActive } = useUsuarios()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Usuarios</h1>
        <p className="mt-1 text-sm text-slate-400">Gestión de usuarios del sistema</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total usuarios</p>
              <p className="text-xl font-bold text-white">{usuarios.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <UserCheck className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Activos</p>
              <p className="text-xl font-bold text-white">
                {usuarios.filter((u) => u.activo).length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
              <UserX className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Inactivos</p>
              <p className="text-xl font-bold text-white">
                {usuarios.filter((u) => !u.activo).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/20">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : usuarios.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-16">
          <Users className="mb-4 h-12 w-12 text-slate-600" />
          <p className="text-sm text-slate-500">No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700/50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-400">Nombre</th>
                <th className="px-4 py-3 font-medium text-slate-400">Email</th>
                <th className="px-4 py-3 font-medium text-slate-400">Rol</th>
                <th className="px-4 py-3 font-medium text-slate-400">Estado</th>
                <th className="px-4 py-3 font-medium text-slate-400">Registro</th>
                <th className="px-4 py-3 font-medium text-slate-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {usuarios.map((usuario) => (
                <tr key={usuario.id} className="transition-colors hover:bg-slate-700/30">
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-white">
                    {usuario.nombre} {usuario.apellido}
                  </td>
                  <td className="px-4 py-3 text-slate-300">{usuario.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge rol={usuario.rol} />
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        usuario.activo
                          ? 'bg-green-500/15 text-green-400 ring-1 ring-green-500/20'
                          : 'bg-slate-500/15 text-slate-400 ring-1 ring-slate-500/20'
                      }`}
                    >
                      {usuario.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-400">
                    {new Date(usuario.created_at).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(usuario.id, usuario.activo)}
                      className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                        usuario.activo
                          ? 'text-red-400 hover:bg-red-500/10'
                          : 'text-green-400 hover:bg-green-500/10'
                      }`}
                    >
                      {usuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
