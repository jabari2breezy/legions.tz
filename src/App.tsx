import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const photos = {
  hero: 'https://legions-one.vercel.app/_next/image?url=%2Fhero.jpg&w=1920&q=75',
  ramadhan: 'https://legions-one.vercel.app/projects/ramadhan-project/ramadhan-project-1.jpg',
  ujasiriBefore: 'https://legions-one.vercel.app/projects/ujasiri-house/before.jpg',
  ujasiriAfter: 'https://legions-one.vercel.app/projects/ujasiri-house/after.jpg',
  beach: 'https://legions-one.vercel.app/projects/beach-cleanup/beach-cleanup-1.jpg',
  trees: 'https://legions-one.vercel.app/projects/tree-planting/tree-planting-1.jpg',
  amsen: 'https://legions-one.vercel.app/projects/amsen-visits/amsen-visits-1.jpg',
}

const projects = [
  { id: '01', name: 'The Ramadhan Project', overline: 'Citywide food drive', image: photos.ramadhan, copy: <>For the 2026 Ramadhan Project, our goal was to provide 150 families with food packages, each large enough to feed a household of at least five. We set out to raise 11.7 million shillings to make that happen. We <em>surpassed</em> that goal, and the extra funds meant <em>more</em> families were reached than we&apos;d originally planned. Every <em>shilling</em> raised went back into the community. None of it stayed with us.</>, stats: [['11.7M', 'shillings raised past the goal'], ['150', 'family packages, each feeding five or more']] },
  { id: '02', name: 'Ujasiri House Renovation', overline: 'Tumaini La Maisha', image: photos.ujasiriAfter, before: photos.ujasiriBefore, copy: <>Interior and exterior were painted by hand, with murals added to soften the clinical feel of a medical stay. A renewed space for families navigating difficult days.</>, stats: [['30+', 'families served daily'], ['100%', 'volunteer labor']] },
  { id: '03', name: 'Coastal Beach Cleanups', overline: 'World Cleanup Day × Nipe Fagio', image: photos.beach, copy: <>3,729.7 kg cleared from the coast by 463 volunteers in one citywide morning. What we leave behind matters as much as what we pick up.</>, stats: [['463', 'volunteers on 22 Sep 2024'], ['302', 'bags filled']] },
  { id: '04', name: 'Tree Planting', overline: 'From Sea View to public schools', image: photos.trees, copy: <><em>170+</em> trees in the ground so far—rooting shade, cleaner air, and a longer view into schoolyards and the coast.</>, stats: [['100', 'coconut palms along Sea View'], ['70', 'trees at two city schools']] },
  { id: '05', name: 'AMSEN Special Needs Visits', overline: 'Al Muntazir Special Needs Center', image: photos.amsen, copy: <>A recurring series of visits, with each term built around the students themselves. Autism is a special ability rather than being a disability. The volunteers learned that from the students.</>, stats: [['3', 'events in the 2023 term'], ['2', 'consecutive years of visits']] },
]

function GlassObject() {
  return <div className="object-wrap" aria-hidden="true"><div className="crystal"><i /><i /><i /><b /><span /><svg viewBox="0 0 600 600"><path d="M67 278C139 186 177 89 284 95c94 5 71 113 167 139 83 22 98 123 33 183-74 68-122-11-200 41-89 60-182 17-190-59-6-53 14-88-27-121Z"/><path d="M176 107c46 96 146 108 203 11M92 327c104-9 140 49 181 136M335 116c-8 95 70 164 145 194"/></svg></div></div>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    let rafId = 0
    const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    const ctx = gsap.context(() => {
      gsap.from('.nav, .hero-copy > *', { y: 32, opacity: 0, duration: 1.05, stagger: 0.1, ease: 'power3.out', delay: 0.15 })
      gsap.to('.crystal', { scale: 2.4, rotate: 18, yPercent: -12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.1 } })
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => gsap.from(el, { y: 56, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%' } }))
      gsap.utils.toArray<HTMLElement>('.project').forEach((el) => { const media = el.querySelector('.project-media'); gsap.fromTo(media, { clipPath: 'inset(16% 8% 16% 8% round 20px)' }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 78%', end: 'top 28%', scrub: true } }) })
    }, root)
    return () => { cancelAnimationFrame(rafId); lenis.destroy(); ctx.revert() }
  }, [])
  return <div ref={root}>
    <header className="nav"><a href="#top" className="brand" aria-label="Legions home">LEGIONS<span>●</span></a><p>Dar es Salaam, Tanzania</p><button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>Menu <span>{menuOpen ? '×' : '↗'}</span></button></header>
    <nav className={`overlay-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation"><a href="#why" onClick={() => setMenuOpen(false)}>Why we move</a><a href="#work" onClick={() => setMenuOpen(false)}>Proof of work</a><a href="#join" onClick={() => setMenuOpen(false)}>Get involved</a></nav>
    <main id="top"><section className="hero"><div className="hero-ambient" /><GlassObject /><div className="hero-copy"><p className="label">For the youth who inspire.</p><h1>Good work<br /><i>travels.</i></h1><p className="hero-lede">A youth-led collective turning visible needs into direct action across Dar es Salaam.</p><a href="#work" className="round-link">See the receipts <span>↓</span></a></div><div className="scroll-note">Scroll to enter <b /></div></section>
      <section id="why" className="statement section"><div data-reveal><p className="label">Why this work exists</p><h2>Overflowing waste on public beaches.<br />Families missing meals during Ramadhan.<br /><em>Schools that need shade, trees, and care.</em></h2></div><p className="statement-copy" data-reveal>The five projects on this site answer those exact conditions, one piece of visible work at a time.</p></section>
      <section className="manifesto section"><div className="manifesto-image"><img src={photos.hero} alt="Legions volunteers together" /></div><div className="manifesto-copy" data-reveal><p className="label">Who we are</p><h2>Hands in.<br /><i>Overhead out.</i></h2><p>Legions moves where the need is visible: patched up walls, cleared shorelines, trees in the ground, families with one less thing to worry about. No hierarchy. No waiting on permission. Just students, graduates, and young professionals putting their hands where the problem is.</p></div></section>
      <section className="principles section"><p className="label" data-reveal>How we move</p><div className="principle-grid"><article data-reveal><span>01</span><h3>Direct labor</h3><p>If a wall needs painting or a beach needs clearing, you&apos;ll find Legions members doing it themselves.</p></article><article data-reveal><span>02</span><h3>No hierarchy</h3><p>People lead by showing up, not by title. No gatekeepers, no approval chains.</p></article><article data-reveal><span>03</span><h3>Peer fundraising</h3><p>Micro donations move through M-Pesa and Tigo Pesa in minutes, tracked in public, spent within days.</p></article></div></section>
      <section id="work" className="work"><div className="work-head section"><p className="label">No spin. Just receipts.</p><h2>Proof of <i>work.</i></h2></div>{projects.map((project, index) => <article className={`project project-${index + 1}`} key={project.id}><div className="project-media"><img src={project.image} alt={project.name} loading="lazy" />{project.before && <img className="before" src={project.before} alt="Ujasiri House before renovation" loading="lazy" />}</div><div className="project-info"><p className="project-index">{project.id} — {project.overline}</p><h3>{project.name}</h3><div className="project-copy">{project.copy}</div><div className="stats">{project.stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></div></article>)}</section>
      <section id="join" className="join"><div className="join-core"><p className="label">The next job needs hands</p><h2>Bring hands,<br /><i>not status.</i></h2><p>Want to volunteer, donate, or help document the work? Tell us what you&apos;ve got, we&apos;ll plug you into whatever&apos;s next.</p><a className="join-action" href="https://legions-one.vercel.app/get-involved/volunteer">Volunteer signup <span>→</span></a></div><div className="join-terms"><span>M-Pesa</span><span>Tigo Pesa</span><span>100% direct to projects</span><span>Zero admin overhead</span></div></section></main>
    <footer><a className="brand" href="#top">LEGIONS<span>●</span></a><p>Legions. Dar es Salaam, Tanzania.</p><a href="https://instagram.com/legions.tz">@legions.tz</a><p>© 2026 Legions Tz. All rights reserved.</p></footer>
  </div>
}
export default App
