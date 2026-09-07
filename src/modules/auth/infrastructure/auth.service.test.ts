import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSelect = vi.fn()
const mockEq = vi.fn()
const mockSingle = vi.fn()
const mockOrder = vi.fn()

vi.mock('@/infrastructure/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: mockSelect.mockReturnThis(),
      eq: mockEq.mockReturnThis(),
      order: mockOrder.mockReturnThis(),
      single: mockSingle,
    })),
  },
}))

import { getProfile } from './auth.service'
import { supabase } from '@/infrastructure/supabase/client'

beforeEach(() => {
  vi.clearAllMocks()
})

describe('auth.service', () => {
  describe('getProfile', () => {
    it('retorna el perfil cuando existe', async () => {
      const mockProfile = {
        id: 'user-123',
        email: 'test@ipesa.com.pe',
        nombre: 'Test',
        apellido: 'User',
        rol: 'asesor',
        activo: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      }

      mockSingle.mockResolvedValue({ data: mockProfile, error: null })

      const result = await getProfile('user-123')

      expect(result).toEqual(mockProfile)
      expect(supabase.from).toHaveBeenCalledWith('profiles')
    })

    it('retorna null cuando el perfil no existe', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'PGRST116' },
      })

      const result = await getProfile('nonexistent')

      expect(result).toBeNull()
    })

    it('lanza error cuando hay un error de base de datos', async () => {
      mockSingle.mockResolvedValue({
        data: null,
        error: { code: 'ERROR', message: 'DB error' },
      })

      await expect(getProfile('user-123')).rejects.toThrow()
    })
  })
})
