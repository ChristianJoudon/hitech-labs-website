import { render, screen } from '@testing-library/react'
import App from './App'

describe('<App />', () => {
  it('renders the updated homepage', () => {
    const { container } = render(<App />)

    expect(
      screen.getByRole('heading', {
        name: /Kauaʻi web design and small-business tech\./i,
        level: 1
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: /Book Your Free 30-min Tech Check/i
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('heading', { name: /Services/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Request your free consult/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /Contact HiTech Labs/i })
    ).toBeInTheDocument()

    expect(container.firstChild).toBeInTheDocument()
  })
})
