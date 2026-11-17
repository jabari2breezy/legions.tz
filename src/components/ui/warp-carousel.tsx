import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

export type WarpCardDetail = 'slider' | 'ring' | 'wave' | 'cross' | 'none'

export interface WarpCard {
  title: string
  value: string
  unit?: string
  footer?: string
  image?: string
  mesh?: string[]
  numeral?: [string, string]
  glow?: string
  detail?: WarpCardDetail
  accent?: string
  labels?: string[]
  href?: string
}

export interface WarpCarouselProps {
  cards: WarpCard[]
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  autoplay?: boolean
  interval?: number
  ariaLabel?: string
  className?: string
}

const mod = (n: number, length: number) => ((n % length) + length) % length

/**
 * A responsive, image-led adaptation of the supplied Warp Carousel. It keeps
 * the same keyboard, touch and controlled-index contract but uses real project
 * photography instead of ornamental metrics.
 */
export default function WarpCarousel({
  cards,
  index,
  defaultIndex = 0,
  onIndexChange,
  autoplay = false,
  interval = 6500,
  ariaLabel = 'Project carousel',
  className = '',
}: WarpCarouselProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultIndex)
  const current = index ?? uncontrolled
  const startX = useRef<number | null>(null)
  const list = useMemo(() => cards.length ? cards : [], [cards])
  const select = (next: number) => {
    if (!list.length) return
    const resolved = mod(next, list.length)
    if (index === undefined) setUncontrolled(resolved)
    onIndexChange?.(resolved)
  }

  useEffect(() => {
    if (!autoplay || list.length < 2) return
    const timer = window.setInterval(() => select(current + 1), interval)
    return () => window.clearInterval(timer)
  }, [autoplay, current, interval, list.length])

  if (!list.length) return null
  const active = list[mod(current, list.length)]

  return <section className={`warp-carousel ${className}`} aria-label={ariaLabel}>
    <div className="warp-stage" tabIndex={0} role="region" aria-roledescription="carousel"
      onKeyDown={event => {
        if (event.key === 'ArrowRight') select(current + 1)
        if (event.key === 'ArrowLeft') select(current - 1)
      }}
      onPointerDown={event => { startX.current = event.clientX }}
      onPointerUp={event => {
        if (startX.current === null) return
        const delta = event.clientX - startX.current
        if (Math.abs(delta) > 36) select(current + (delta < 0 ? 1 : -1))
        startX.current = null
      }}>
      <div className="warp-sun" aria-hidden="true" />
      <div className="warp-track">
        {list.map((card, cardIndex) => {
          const offset = ((cardIndex - current + list.length + Math.floor(list.length / 2)) % list.length) - Math.floor(list.length / 2)
          const isActive = cardIndex === mod(current, list.length)
          return <article key={`${card.title}-${cardIndex}`} className={`warp-card ${isActive ? 'is-active' : ''}`}
            style={{ '--warp-offset': offset, '--warp-depth': Math.abs(offset), '--warp-glow': card.glow ?? '#62f0d3' } as CSSProperties}
            onClick={() => isActive ? card.href && (window.location.href = card.href) : select(cardIndex)}>
            <img src={card.image} alt="" />
            <div className="warp-veil" />
            <div className="warp-card-meta"><span>{card.value}{card.unit}</span><small>{card.title}</small></div>
            <p>{card.footer}</p>
          </article>
        })}
      </div>
      <div className="warp-controls" aria-label="Carousel controls">
        <button type="button" onClick={() => select(current - 1)} aria-label="Previous project">←</button>
        <span aria-live="polite">{String(mod(current, list.length) + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
        <button type="button" onClick={() => select(current + 1)} aria-label="Next project">→</button>
      </div>
    </div>
    <div className="warp-caption"><small>Selected field note</small><h2>{active.title}</h2><p>{active.footer}</p><a href={active.href}>Open the project <span aria-hidden="true">↗</span></a></div>
  </section>
}
