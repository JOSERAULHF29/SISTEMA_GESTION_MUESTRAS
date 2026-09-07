import { describe, it, expect } from 'vitest'
import { getRoleFromEmail } from './getRoleFromEmail'

describe('getRoleFromEmail', () => {
  it('retorna admin para jhuamanif@ipesa.com.pe', () => {
    expect(getRoleFromEmail('jhuamanif@ipesa.com.pe')).toBe('admin')
  })

  it('retorna tribologo para aquintero@ipesa.com.pe', () => {
    expect(getRoleFromEmail('aquintero@ipesa.com.pe')).toBe('tribologo')
  })

  it('retorna almacenero para correos que empiezan con almacen', () => {
    expect(getRoleFromEmail('almacen1@ipesa.com.pe')).toBe('almacenero')
    expect(getRoleFromEmail('almacencentral@ipesa.com.pe')).toBe('almacenero')
    expect(getRoleFromEmail('almacen Norte@ipesa.com.pe')).toBe('almacenero')
  })

  it('retorna asesor para cualquier otro correo @ipesa.com.pe', () => {
    expect(getRoleFromEmail('juan@ipesa.com.pe')).toBe('asesor')
    expect(getRoleFromEmail('maria@ipesa.com.pe')).toBe('asesor')
  })
})
