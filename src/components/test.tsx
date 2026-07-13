import { render, screen } from '@testing-library/react'
import App from './App'

describe('<App />', () => {
  it('renders the updated homepage', () => {
    const { container } = render(<App />)

    expect(
      screen.getByRole('heading', {
        name: /Small-business tech, beautifully handled/i,
        level: 1
      })
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: /Book Your Free 30-min Tech Check/i
      })
    ).toBeInTheDocument()

    expect(container.firstChild).toBeInTheDocument()
  })
})
