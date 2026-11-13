import { useRef, useState } from 'react'
import './Lanyard.css'

export default function Lanyard({
  frontImage,
  backImage = frontImage,
  strapColor = '#4DB8FF',
  bio,
  className = '',
}) {
  const [flipped, setFlipped] = useState(false)
  const [interacted, setInteracted] = useState(false)
  const lanyardRef = useRef(null)
  const drag = useRef(null)
  const motion = useRef({ x: 0, y: 0, previousX: 0, previousY: 0 })
  const animation = useRef(0)
  const suppressClick = useRef(false)

  const paint = () => {
    const node = lanyardRef.current
    if (!node) return
    const { x, y, previousX } = motion.current
    const swing = Math.max(-17, Math.min(17, x * 0.06 + (x - previousX) * 0.12))
    node.style.setProperty('--drag-x', `${x}px`)
    node.style.setProperty('--drag-y', `${y}px`)
    node.style.setProperty('--lanyard-angle', `${swing}deg`)
  }

  const settle = () => {
    const state = motion.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      state.x = 0
      state.y = 0
      state.previousX = 0
      state.previousY = 0
      paint()
      return
    }
    const tick = () => {
      state.x += (state.x - state.previousX) * 0.91 - state.x * 0.052
      state.y += (state.y - state.previousY) * 0.83 - state.y * 0.085
      state.previousX = state.x
      state.previousY = state.y
      paint()
      if (Math.abs(state.x) + Math.abs(state.y) > 0.18) {
        animation.current = window.requestAnimationFrame(tick)
      } else {
        state.x = 0
        state.y = 0
        state.previousX = 0
        state.previousY = 0
        paint()
        animation.current = 0
      }
    }
    window.cancelAnimationFrame(animation.current)
    animation.current = window.requestAnimationFrame(tick)
  }

  const startDrag = event => {
    if (event.button !== 0) return
    window.cancelAnimationFrame(animation.current)
    animation.current = 0
    drag.current = {
      x: event.clientX,
      y: event.clientY,
      lastX: event.clientX,
      lastY: event.clientY,
      startX: motion.current.x,
      startY: motion.current.y,
      moved: false,
    }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const moveDrag = event => {
    if (!drag.current) {
      const bounds = event.currentTarget.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      event.currentTarget.style.setProperty('--tilt-x', `${x * 9}deg`)
      event.currentTarget.style.setProperty('--tilt-y', `${y * -9}deg`)
      event.currentTarget.style.setProperty('--glare-x', `${(x + 0.5) * 100}%`)
      event.currentTarget.style.setProperty('--glare-y', `${(y + 0.5) * 100}%`)
      return
    }

    const state = motion.current
    const dx = event.clientX - drag.current.x
    const dy = event.clientY - drag.current.y
    drag.current.moved ||= Math.abs(dx) + Math.abs(dy) > 5
    state.x = Math.max(-110, Math.min(110, drag.current.startX + dx))
    state.y = Math.max(-58, Math.min(58, drag.current.startY + dy))
    state.previousX = state.x - (event.clientX - drag.current.lastX)
    state.previousY = state.y - (event.clientY - drag.current.lastY)
    drag.current.lastX = event.clientX
    drag.current.lastY = event.clientY
    paint()
  }

  const endDrag = event => {
    if (!drag.current) return
    const didMove = drag.current.moved
    drag.current = null
    suppressClick.current = didMove
    setInteracted(true)
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    settle()
  }

  const cancelDrag = () => {
    if (!drag.current) return
    drag.current = null
    suppressClick.current = false
    settle()
  }

  const handleClick = event => {
    if (suppressClick.current) {
      suppressClick.current = false
      event.preventDefault()
      return
    }
    setFlipped(value => !value)
    setInteracted(true)
  }

  return (
    <div
      ref={lanyardRef}
      className={`lanyard${interacted ? ' has-interacted' : ''} ${className}`.trim()}
      style={{ '--strap-color': strapColor }}
    >
      <div className="lanyard-anchor" />
      <div className="lanyard-strap" aria-hidden="true" />
      <button
        className={`lanyard-card${flipped ? ' is-flipped' : ''}`}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={cancelDrag}
        onPointerLeave={event => {
          event.currentTarget.style.setProperty('--tilt-x', '0deg')
          event.currentTarget.style.setProperty('--tilt-y', '0deg')
        }}
        onClick={handleClick}
        aria-label={flipped ? 'Flip Christian Jacob Bulan’s ID card to the front' : 'Flip Christian Jacob Bulan’s ID card to the back'}
        aria-pressed={flipped}
        data-cursor="Drag"
      >
        <span className="lanyard-card-inner">
          <span className="lanyard-card-face lanyard-card-front">
            <span className="lanyard-tag">PORTFOLIO / 2026</span>
            <img src={frontImage} alt="Christian Jacob E. Bulan" />
            <span className="lanyard-card-copy"><b>CHRISTIAN JACOB</b><small>IT STUDENT · BUILDER</small></span>
          </span>
          <span className="lanyard-card-face lanyard-card-back">
            <img src={backImage} alt="" />
            <span className="lanyard-card-copy">
              <b>FULL SEND.</b>
              <small>BS INFORMATION TECHNOLOGY</small>
              <span className="lanyard-bio">{bio}</span>
              <span className="lanyard-skills">HTML & CSS · JavaScript · React</span>
            </span>
          </span>
        </span>
        <span className="lanyard-glare" aria-hidden="true" />
      </button>
      <p className="lanyard-hint" aria-hidden={interacted}>
        Drag / click to flip <span aria-hidden="true">↗</span>
      </p>
    </div>
  )
}
