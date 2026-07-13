import type { ReactNode } from 'react'

export type Service = {
  id: string
  title: string
  tagline: string
  why: string
  bullets: string[]
  overview: string
  price: string
  icon?: ReactNode
  image?: string
}
