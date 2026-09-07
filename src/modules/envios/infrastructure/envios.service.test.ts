import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockFrom = vi.hoisted(() => vi.fn())

vi.mock('@/infrastructure/supabase/client', () => ({
  supabase: {
    from: mockFrom,
  },
}))

import { getEnviosByUser, createEnvio, getEnvioById } from './envios.service'

beforeEach(() => {
  vi.clearAllMocks()
})

function createMockQuery(returnValue: unknown) {
  const chain: Record<string, ReturnType<typeof vi.fn>> = {}
  chain.select = vi.fn(() => chain)
  chain.eq = vi.fn(() => chain)
  chain.order = vi.fn(() => Promise.resolve(returnValue))
  chain.single = vi.fn(() => Promise.resolve(returnValue))
  chain.insert = vi.fn(() => ({
    select: vi.fn(() => ({
      single: vi.fn(() => Promise.resolve(returnValue)),
    })),
  }))
  return chain
}

describe('envios.service', () => {
  describe('getEnviosByUser', () => {
    it('retorna envíos de un usuario', async () => {
      const mockEnvios = [
        {
          id: 'env-1',
          asesor_id: 'user-123',
          fecha_envio: '2024-01-15',
          sucursal: 'Lima',
          cantidad_muestras: 5,
          observacion: null,
          archivo_nombre: 'datos.xlsx',
          archivo_path: 'user-123/123.xlsx',
          estado: 'registrado',
          created_at: '2024-01-15',
          updated_at: '2024-01-15',
        },
      ]

      mockFrom.mockReturnValue(createMockQuery({ data: mockEnvios, error: null }))

      const result = await getEnviosByUser('user-123')

      expect(result).toEqual(mockEnvios)
      expect(mockFrom).toHaveBeenCalledWith('envios_muestras')
    })

    it('retorna array vacío cuando no hay envíos', async () => {
      mockFrom.mockReturnValue(createMockQuery({ data: [], error: null }))

      const result = await getEnviosByUser('user-123')

      expect(result).toEqual([])
    })
  })

  describe('getEnvioById', () => {
    it('retorna un envío por ID', async () => {
      const mockEnvio = {
        id: 'env-1',
        asesor_id: 'user-123',
        fecha_envio: '2024-01-15',
        sucursal: 'Lima',
        cantidad_muestras: 5,
        observacion: null,
        archivo_nombre: 'datos.xlsx',
        archivo_path: 'user-123/123.xlsx',
        estado: 'registrado',
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
      }

      mockFrom.mockReturnValue(createMockQuery({ data: mockEnvio, error: null }))

      const result = await getEnvioById('env-1')

      expect(result).toEqual(mockEnvio)
    })

    it('retorna null cuando no existe', async () => {
      mockFrom.mockReturnValue(
        createMockQuery({ data: null, error: { code: 'PGRST116' } })
      )

      const result = await getEnvioById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('createEnvio', () => {
    it('crea un envío correctamente', async () => {
      const newEnvio = {
        asesor_id: 'user-123',
        fecha_envio: '2024-01-15',
        sucursal: 'Lima',
        cantidad_muestras: 5,
        observacion: null,
        archivo_nombre: 'datos.xlsx',
        archivo_path: 'user-123/123.xlsx',
        estado: 'registrado' as const,
      }

      const createdEnvio = {
        ...newEnvio,
        id: 'env-new',
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
      }

      mockFrom.mockReturnValue(createMockQuery({ data: createdEnvio, error: null }))

      const result = await createEnvio(newEnvio)

      expect(result).toEqual(createdEnvio)
    })
  })
})
