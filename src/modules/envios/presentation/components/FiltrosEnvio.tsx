import { useState } from 'react'
import { Search, X } from 'lucide-react'

export interface FiltrosEnvio {
  busqueda: string
  sucursal: string
  estado: string
}

interface Props {
  filtros: FiltrosEnvio
  onFiltrosChange: (filtros: FiltrosEnvio) => void
  sucursales: string[]
}

export function FiltrosEnvio({ filtros, onFiltrosChange, sucursales }: Props) {
  const [busquedaLocal, setBusquedaLocal] = useState(filtros.busqueda)

  const handleBusquedaSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFiltrosChange({ ...filtros, busqueda: busquedaLocal })
  }

  const handleClear = () => {
    setBusquedaLocal('')
    onFiltrosChange({ busqueda: '', sucursal: '', estado: '' })
  }

  const hasFiltros = filtros.busqueda || filtros.sucursal || filtros.estado

  return (
    <div className="mb-6 space-y-4 rounded-xl border border-slate-700/50 bg-slate-800 p-4 shadow-lg">
      <form onSubmit={handleBusquedaSubmit} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar por sucursal..."
            value={busquedaLocal}
            onChange={(e) => setBusquedaLocal(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 py-2 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
        >
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap gap-3">
        <select
          value={filtros.sucursal}
          onChange={(e) => onFiltrosChange({ ...filtros, sucursal: e.target.value })}
          className="rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todas las sucursales</option>
          {sucursales.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={filtros.estado}
          onChange={(e) => onFiltrosChange({ ...filtros, estado: e.target.value })}
          className="rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Todos los estados</option>
          <option value="registrado">Registrado</option>
          <option value="anulado">Anulado</option>
        </select>

        {hasFiltros && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1 rounded-lg border border-slate-600 px-3 py-2 text-sm text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
            Limpiar
          </button>
        )}
      </div>
    </div>
  )
}
