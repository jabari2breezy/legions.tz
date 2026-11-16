import { useEffect, useRef, useState } from 'react'
import type { Project } from './project-data'
import './ProofOfWork.css'

const host='https://legions-one.vercel.app/projects/'
const clamp=(n:number,a=0,b=1)=>Math.min(b,Math.max(a,n))
const ease=(n:number)=>1-(1-n)**3

export function ProofOfWork({projects}:{projects:Project[]}){
  const track=useRef<HTMLDivElement>(null)
  const [p,setP]=useState(0)
  const [active,setActive]=useState<string|null>(null)
  useEffect(()=>{
    let target=0,shown=0,frame=0
    const update=()=>{const el=track.current;if(el){const range=el.offsetHeight-innerHeight;target=clamp(-el.getBoundingClientRect().top/range)}cancelAnimationFrame(frame);frame=requestAnimationFrame(tick)}
    const tick=()=>{shown+=(target-shown)*.09;setP(shown);if(Math.abs(target-shown)>.0002)frame=requestAnimationFrame(tick)}
    update();addEventListener('scroll',update,{passive:true});addEventListener('resize',update)
    return()=>{cancelAnimationFrame(frame);removeEventListener('scroll',update);removeEventListener('resize',update)}
  },[])
  const intro=clamp(p/.12), travel=clamp((p-.14)/.49), grid=clamp((p-.51)/.29)
  return <main className="proof-page"><div className="proof-track" ref={track}><section className="proof-stage" aria-label="Proof of work projects">
    <div className="proof-glow"/><div className="proof-cross"><i>+</i></div>
    <a className="proof-back" href="/" aria-label="Back to Legions home">LEGIONS<span>●</span></a>
    <span className="proof-kicker">DAR ES SALAAM · 2022 — NOW</span>
    <div className="proof-title proof-title--one" style={{transform:`translate3d(${(-50+126*travel)}vw, ${34*(1-intro)}vh, 0)`}}>Proof of</div>
    <div className="proof-title proof-title--two" style={{transform:`translate3d(${(50-126*travel)}vw, ${34*(1-intro)}vh, 0)`}}>Work</div>
    <p className="proof-caption" style={{opacity:1-clamp((p-.52)/.05)}}>Five projects. Real conditions. <em>Visible action.</em></p>
    <div className="proof-rail" aria-hidden="true">
      {projects.map((project,index)=>{
        const count=projects.length
        const phase=travel*(count+1)-index
        const u=clamp(phase)
        const angle=-1.05+u*2.1
        const x=Math.sin(angle)*45
        const y=(index-(count-1)/2)*8 + Math.sin(angle)*3
        const z=-24+Math.cos(angle)*20
        const leave=clamp((grid-index*.085)/.22)
        const column=index%3, row=Math.floor(index/3)
        const gx=(column-1)*29+(row===1?14.5:0), gy=(row-.5)*31
        const cardStyle={transform:`translate3d(${x+(gx-x)*ease(leave)}vw,${y+(gy-y)*ease(leave)}vh,${z+(8-z)*ease(leave)}vw) rotateY(${angle*.58*(1-leave)}rad) rotateZ(${(index%2?-.06:.06)*(1-leave)}rad)`,opacity:Math.max(.15,Math.min(1,phase+.15))}
        return <a href={`/projects/${project.slug}`} className="proof-card" style={cardStyle} key={project.slug}><img src={host+project.images[0]} alt=""/><span>{project.id}</span></a>
      })}
    </div>
    <div className="proof-grid-label" style={{opacity:clamp((p-.77)/.12)}}>SELECT A PROJECT <b>↘</b></div>
    <div className="proof-rule" style={{transform:`scaleX(${clamp((p-.72)/.14)})`}}/>
    <div className="proof-projects" style={{opacity:clamp((p-.72)/.12),pointerEvents:p>.78?'auto':'none'}}>
      {projects.map(project=><a href={`/projects/${project.slug}`} onPointerMove={()=>setActive(project.name)} onPointerLeave={()=>setActive(null)} key={project.slug}>{project.kicker}<strong>{project.name}</strong><span>Open story ↗</span></a>)}
    </div>
    {active&&<div className="proof-name">{active}</div>}
    <div className="proof-progress"><span style={{transform:`scaleX(${p})`}}/></div><p className="proof-scroll">SCROLL TO EXPLORE ↓</p>
  </section></div></main>
}
