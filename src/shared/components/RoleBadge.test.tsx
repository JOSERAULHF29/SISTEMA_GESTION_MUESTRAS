import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RoleBadge } from './RoleBadge'

describe('RoleBadge', () => {
  it('renderiza "Admin" para rol admin', () => {
    render(<RoleBadge rol="admin" />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toHaveClass('bg-purple-500/15')
  })

  it('renderiza "Tribólogo" para rol tribologo', () => {
    render(<RoleBadge rol="tribologo" />)
    expect(screen.getByText('Tribólogo')).toBeInTheDocument()
    expect(screen.getByText('Tribólogo')).toHaveClass('bg-orange-500/15')
  })

  it('renderiza "Asesor" para rol asesor', () => {
    render(<RoleBadge rol="asesor" />)
    expect(screen.getByText('Asesor')).toBeInTheDocument()
    expect(screen.getByText('Asesor')).toHaveClass('bg-blue-500/15')
  })
})
