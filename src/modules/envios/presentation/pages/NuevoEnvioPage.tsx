import { EnvioForm } from '@/modules/envios/presentation/components/EnvioForm'

export function NuevoEnvioPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Registrar envío</h1>
        <p className="mt-1 text-sm text-slate-400">Registra un nuevo envío de muestras de aceite</p>
      </div>

      <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
        <EnvioForm />
      </div>
    </div>
  )
}
