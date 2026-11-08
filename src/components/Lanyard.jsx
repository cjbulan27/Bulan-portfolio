import { useRef, useState } from 'react'
import './Lanyard.css'

// A lightweight portfolio version of the React Bits lanyard interaction.
// The card uses the supplied image on both faces and flips on click.
export default function Lanyard({ frontImage, backImage = frontImage, strapColor = '#55b8f2', className = '' }) {
  const [flipped, setFlipped] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const drag = useRef(null)

  const startDrag = event => {
    drag.current = { x: event.clientX, y: event.clientY, startX: position.x, startY: position.y, moved: false }
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const moveDrag = event => {
    if (!drag.current) return
    const x = drag.current.startX + event.clientX - drag.current.x
    const y = drag.current.startY + event.clientY - drag.current.y
    if (Math.abs(x - position.x) > 3 || Math.abs(y - position.y) > 3) drag.current.moved = true
    setPosition({ x, y })
  }

  const endDrag = event => {
    const didMove = drag.current?.moved
    drag.current = null
    event.currentTarget.releasePointerCapture?.(event.pointerId)
    if (!didMove) setFlipped(value => !value)
  }

  return (
    <div className={`lanyard ${className}`.trim()} style={{ '--drag-x': `${position.x}px`, '--drag-y': `${position.y}px` }}>
      <div className="lanyard-anchor" />
      <div className="lanyard-strap" style={{ '--strap-color': strapColor }} />
      <button
        className={`lanyard-card ${flipped ? 'is-flipped' : ''}`}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        aria-label="Flip Christian Jacob Bulan's ID card"
      >
        <span className="lanyard-card-inner">
          <span className="lanyard-card-face lanyard-card-front">
            <span className="lanyard-tag">PORTFOLIO / 2026</span>
            <img src={frontImage} alt="Christian Jacob E. Bulan" />
            <span className="lanyard-card-copy"><b>CHRISTIAN JACOB</b><small>IT STUDENT · BUILDER</small></span>
          </span>
          <span className="lanyard-card-face lanyard-card-back">
            <img src={backImage} alt="" />
            <span className="lanyard-card-copy"><b>FULL SEND.</b><small>CLICK TO FLIP BACK</small></span>
          </span>
        </span>
      </button>
      <p className="lanyard-hint">Drag / click to flip <span>↗</span></p>
    </div>
  )
}
