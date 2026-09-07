import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EstadoBadge } from './EstadoBadge'

describe('EstadoBadge', () => {
  it('renderiza "Pendiente" para estado pendiente', () => {
    render(<EstadoBadge estado="pendiente" />)
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.getByText('Pendiente')).toHaveClass('bg-yellow-500/15')
  })

  it('renderiza "Anulado" para estado anulado', () => {
    render(<EstadoBadge estado="anulado" />)
    expect(screen.getByText('Anulado')).toBeInTheDocument()
    expect(screen.getByText('Anulado')).toHaveClass('bg-red-500/15')
  })
})
