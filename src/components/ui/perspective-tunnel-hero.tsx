import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'

export interface TunnelImage {
  src: string
  title: string
}

interface PerspectiveTunnelHeroProps {
  images: TunnelImage[]
}

/**
 * Lightweight adaptation of the supplied perspective tunnel. It deliberately
 * avoids a second animation runtime: pointer parallax is a CSS custom property
 * and the depth sequence is compositor-only CSS, using the actual project work.
 */
export default function PerspectiveTunnelHero({ images }: PerspectiveTunnelHeroProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stage = ref.current
    if (!stage || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const update = (event: PointerEvent) => {
      const bounds = stage.getBoundingClientRect()
      stage.style.setProperty('--pointer-x', `${((event.clientX - bounds.left) / bounds.width - .5) * -22}px`)
      stage.style.setProperty('--pointer-y', `${((event.clientY - bounds.top) / bounds.height - .5) * -16}px`)
    }
    stage.addEventListener('pointermove', update, { passive: true })
    return () => stage.removeEventListener('pointermove', update)
  }, [])

  return <div className="tunnel" ref={ref} aria-hidden="true">
    <div className="tunnel-glow" />
    <div className="tunnel-ring tunnel-ring-one" />
    <div className="tunnel-ring tunnel-ring-two" />
    <div className="tunnel-plane">
      {images.map((image, index) => <figure className="tunnel-card" style={{ '--tunnel-index': index } as CSSProperties} key={image.title}>
        <img src={image.src} alt="" />
      </figure>)}
    </div>
  </div>
}
