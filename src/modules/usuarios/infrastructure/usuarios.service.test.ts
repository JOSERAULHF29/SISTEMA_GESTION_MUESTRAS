import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockOrder = vi.fn()
const mockEq = vi.fn()

vi.mock('@/infrastructure/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: mockOrder,
      update: vi.fn().mockReturnThis(),
      eq: mockEq,
    })),
  },
}))

import { getAllProfiles, toggleUserActive, updateUserRole } from './usuarios.service'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('usuarios.service', () => {
  describe('getAllProfiles', () => {
    it('retorna todos los perfiles', async () => {
      const mockProfiles = [
        {
          id: 'user-1',
          email: 'admin@ipesa.com.pe',
          nombre: 'Admin',
          apellido: 'User',
          rol: 'admin',
          activo: true,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
        {
          id: 'user-2',
          email: 'asesor@ipesa.com.pe',
          nombre: 'Asesor',
          apellido: 'User',
          rol: 'asesor',
          activo: true,
          created_at: '2024-01-02',
          updated_at: '2024-01-02',
        },
      ]

      mockOrder.mockResolvedValue({ data: mockProfiles, error: null })

      const result = await getAllProfiles()

      expect(result).toEqual(mockProfiles)
      expect(result).toHaveLength(2)
    })

    it('retorna array vacío cuando no hay perfiles', async () => {
      mockOrder.mockResolvedValue({ data: [], error: null })

      const result = await getAllProfiles()

      expect(result).toEqual([])
    })
  })

  describe('toggleUserActive', () => {
    it('cambia el estado activo del usuario', async () => {
      mockEq.mockResolvedValue({ error: null })

      await toggleUserActive('user-1', true)

      expect(mockEq).toHaveBeenCalled()
    })
  })

  describe('updateUserRole', () => {
    it('actualiza el rol del usuario', async () => {
      mockEq.mockResolvedValue({ error: null })

      await updateUserRole('user-1', 'tribologo')

      expect(mockEq).toHaveBeenCalled()
    })
  })
})
