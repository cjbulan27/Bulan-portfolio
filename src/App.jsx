import { useEffect, useRef, useState } from 'react'
import { BrowserRouter, NavLink, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import attendifyLogo from './assets/Attendify.jfif'
import profilePhoto from './assets/profile-optimized.jpg'
import rsevenLogo from './assets/R7.jpg'
import Lanyard from './components/Lanyard'
import './App.css'

const achievements = [
  {
    number: '01',
    title: 'National Certificate III in Visual Graphics Design',
    category: 'Certificate',
    description: 'A foundation in visual communication, layout, and creative problem-solving.',
  },
  {
    number: '02',
    title: 'National Certificate II in Computer Systems Servicing',
    category: 'Certificate',
    description: 'Hands-on training in computer hardware, maintenance, and technical support.',
  },
]

const systemsCreated = [
  {
    number: '01',
    title: 'Attendify',
    category: 'System',
    logoImage: attendifyLogo,
    logoAlt: 'Attendify logo',
    description: 'An attendance experience designed to make every check-in feel effortless.',
  },
  {
    number: '02',
    title: 'Rseven Management System',
    category: 'System',
    logoImage: rsevenLogo,
    logoAlt: 'Rseven logo',
    logoClass: 'system-logo-r7',
    description: 'A practical management system built around everyday workflow needs.',
  },
]

const navigation = [
  { label: 'Home', to: '/', end: true },
  { label: 'About', to: '/about' },
  { label: 'Achievements', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]

function Layout() {
  const [loading, setLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [scrolled, setScrolled] = useState(false)
  const [headerHidden, setHeaderHidden] = useState(false)
  const location = useLocation()
  const previousScroll = useRef(0)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = window.setTimeout(() => setLoading(false), reducedMotion ? 0 : 1050)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    let frame = 0
    const updateScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight
        const currentScroll = window.scrollY
        setScrollProgress(scrollable > 0 ? currentScroll / scrollable : 0)
        setScrolled(currentScroll > 24)
        setHeaderHidden(currentScroll > previousScroll.current && currentScroll > 150)
        previousScroll.current = currentScroll
        frame = 0
      })
    }

    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()
    return () => {
      window.removeEventListener('scroll', updateScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [location.pathname])

  useEffect(() => {
    window.scrollTo(0, 0)
    const items = document.querySelectorAll('[data-reveal]')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !('IntersectionObserver' in window)) {
      items.forEach(item => item.classList.add('is-visible'))
      return undefined
    }
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -35px 0px' },
    )
    items.forEach(item => observer.observe(item))
    return () => observer.disconnect()
  }, [location.pathname])

  useEffect(() => {
    const buttons = document.querySelectorAll('.magnetic-button')
    const move = event => {
      const bounds = event.currentTarget.getBoundingClientRect()
      const x = Math.max(-7, Math.min(7, (event.clientX - bounds.left - bounds.width / 2) * 0.12))
      const y = Math.max(-6, Math.min(6, (event.clientY - bounds.top - bounds.height / 2) * 0.12))
      event.currentTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const reset = event => {
      event.currentTarget.style.transform = ''
    }
    buttons.forEach(button => {
      button.addEventListener('pointermove', move)
      button.addEventListener('pointerleave', reset)
    })
    return () => buttons.forEach(button => {
      button.removeEventListener('pointermove', move)
      button.removeEventListener('pointerleave', reset)
    })
  }, [location.pathname])

  useEffect(() => {
    let frame = 0
    const moveSpotlight = event => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${event.clientX}px`)
        document.documentElement.style.setProperty('--pointer-y', `${event.clientY}px`)
        frame = 0
      })
    }
    window.addEventListener('pointermove', moveSpotlight, { passive: true })
    return () => {
      window.removeEventListener('pointermove', moveSpotlight)
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="site-shell">
      {loading && <SiteLoader />}
      <div className="scroll-progress" style={{ transform: `scaleX(${scrollProgress})` }} aria-hidden="true" />
      <header className={`site-header${scrolled ? ' is-scrolled' : ''}${headerHidden ? ' is-hidden' : ''}`}>
        <NavLink className="wordmark" to="/" aria-label="Christian Jacob E. Bulan, home" data-cursor="Home">
          <img className="wordmark-photo" src={profilePhoto} alt="" />
          <span>Christian Jacob E. Bulan</span>
        </NavLink>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map(({ label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              data-cursor="Open"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <span className="header-availability">
          <span className="availability-dot" /> BS Information Technology Student
        </span>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <span className="footer-outline" aria-hidden="true">Christian Jacob E. Bulan</span>
        <NavLink className="footer-mark" to="/" aria-label="Back to home" data-cursor="Home">
          <span>.</span>
        </NavLink>
        <p>Full Send.</p>
        <NavLink to="/contact" data-cursor="Open">Contact <span aria-hidden="true">↗</span></NavLink>
        <span className="footer-year">© 2026 Christian Jacob E. Bulan</span>
      </footer>
      <CustomCursor />
    </div>
  )
}

function Home() {
  return (
    <>
      <section className="home-hero page-width">
        <div className="hero-copy">
          <p className="eyebrow"><span /> BS Information Technology Student</p>
          <h1 aria-label="Hi, I’m Christian Jacob E. Bulan.">
            <span className="headline-line"><span>Hi, I’m Christian</span></span>
            <span className="headline-line"><span className="highlight-word">Jacob E. Bulan.</span></span>
          </h1>
          <p className="hero-description">
            I’m studying Information Technology and exploring web development, software,
            and creative problem-solving. This is where I share what I’m learning and building.
          </p>
          <div className="hero-actions">
            <NavLink className="button button-dark magnetic-button" to="/projects" data-cursor="View">Explore achievements <span aria-hidden="true">↗</span></NavLink>
            <NavLink className="text-link" to="/about" data-cursor="Open">A bit about me <span aria-hidden="true">→</span></NavLink>
          </div>
          <div className="hero-note"><span></span> Learning, building, and growing in tech</div>
        </div>
        <div className="hero-lanyard">
          <Lanyard
            frontImage={profilePhoto}
            backImage={profilePhoto}
            strapColor="#4DB8FF"
            bio="I’m studying Information Technology and exploring web development, software, and creative problem-solving."
          />
        </div>
      </section>

      <section className="featured-section">
        <div className="page-width section-heading-row" data-reveal>
          <div>
            <p className="eyebrow">Certificates and milestones</p>
            <h2>Achievements<span className="accent-period">.</span></h2>
          </div>
          <NavLink className="text-link" to="/projects" data-cursor="View">All achievements <span aria-hidden="true">↗</span></NavLink>
        </div>
        <div className="page-width project-grid">
          {achievements.map((achievement) => <AchievementCard key={achievement.number} achievement={achievement} />)}
        </div>
      </section>
      <section className="systems-section page-width">
        <p className="eyebrow" data-reveal>Projects</p>
        <h2 data-reveal>Systems I’ve created<span className="accent-period">.</span></h2>
        <div className="project-grid">
          {systemsCreated.map((system) => <AchievementCard key={system.number} achievement={system} />)}
        </div>
      </section>
      <ContactStrip />
    </>
  )
}

function AchievementCard({ achievement }) {
  const dialogRef = useRef(null)

  const openDialog = () => {
    dialogRef.current?.showModal()
  }

  const moveSpotlight = event => {
    const bounds = event.currentTarget.getBoundingClientRect()
    event.currentTarget.style.setProperty('--spot-x', `${event.clientX - bounds.left}px`)
    event.currentTarget.style.setProperty('--spot-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <>
      <article
        className="achievement-card"
        data-reveal
        tabIndex="0"
        role="button"
        aria-haspopup="dialog"
        onClick={openDialog}
        onPointerMove={moveSpotlight}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openDialog()
          }
        }}
        data-cursor="View"
      >
        {achievement.logoImage && (
          <div className={`system-logo ${achievement.logoClass || ''}`}>
            <img src={achievement.logoImage} alt={achievement.logoAlt} loading="lazy" decoding="async" />
          </div>
        )}
        <div className="achievement-meta">
          <span className="achievement-number">{achievement.number}</span>
          <p className="project-category">{achievement.category}</p>
        </div>
        <h3>{achievement.title}</h3>
        <p className="project-description">{achievement.description}</p>
        <span className="card-arrow" aria-hidden="true">↗</span>
      </article>
      <dialog className="achievement-dialog" ref={dialogRef} aria-labelledby={`dialog-${achievement.category}-${achievement.number}`}>
        <div className="dialog-content">
          <button className="dialog-close" type="button" aria-label="Close details" onClick={() => dialogRef.current?.close()}>×</button>
          <p className="eyebrow">{achievement.category} / {achievement.number}</p>
          <h2 id={`dialog-${achievement.category}-${achievement.number}`}>{achievement.title}</h2>
          <p>{achievement.description}</p>
        </div>
      </dialog>
    </>
  )
}

function About() {
  const skills = ['HTML & CSS', 'JavaScript', 'React', 'Responsive web design', 'Git & GitHub', 'Problem solving']

  return (
    <section className="inner-page page-width about-page">
      <p className="eyebrow"><span /> A little introduction</p>
      <h1><span className="headline-line"><span>Learning the craft.</span></span><span className="headline-line"><span className="highlight-word">Building what’s next.</span></span></h1>
      <div className="about-columns">
        <div className="about-story" data-reveal>
          <p className="lead-copy">I’m Christian Jacob E. Bulan, a Bachelor of Science in Information Technology student building a foundation in web development and software.</p>
          <p>I enjoy learning how technology works and using it to turn ideas into practical digital experiences. This portfolio is a place to share my achievements, classwork, and progress as I grow in the field of IT.</p>
        </div>
        <aside className="skills-panel" data-reveal>
          <p className="eyebrow">Skills I’m developing</p>
          <ul>{skills.map((skill, index) => <li key={skill}><span>0{index + 1}</span>{skill}</li>)}</ul>
        </aside>
      </div>
      <div className="about-note" data-reveal><span></span><p>Good work happens when the details and the big picture get equal care.</p></div>
    </section>
  )
}

function Achievements() {
  return (
    <section className="inner-page page-width projects-page">
      <p className="eyebrow"><span /> Certificates and milestones</p>
      <div className="projects-title-row">
        <h1>Achievements<span className="accent-period">.</span></h1>
        <p>Certificates I’ve earned along my Information Technology journey.</p>
      </div>
      <div className="project-grid project-grid-all">
        {achievements.map((achievement) => <AchievementCard key={achievement.number} achievement={achievement} />)}
      </div>
      <div className="systems-list">
        <p className="eyebrow">Projects</p>
        <h2>Systems I’ve created<span className="accent-period">.</span></h2>
        <div className="project-grid project-grid-all">
          {systemsCreated.map((system) => <AchievementCard key={system.number} achievement={system} />)}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact-page page-width">
      <p className="eyebrow"><span /> Thanks for stopping by</p>
      <h1><span className="headline-line"><span>Let’s keep</span></span><span className="headline-line"><span className="highlight-word">in touch.</span></span></h1>
      <p className="contact-copy">I’m a BS Information Technology student, always learning and building. I’m glad you took a look at my portfolio.</p>
      <NavLink className="button button-dark contact-button magnetic-button" to="/projects" data-cursor="View">See my achievements <span aria-hidden="true">↗</span></NavLink>
      <p className="contact-location"><span className="availability-dot" /> Christian Jacob E. Bulan · Information Technology Student</p>
      <span className="contact-spark" aria-hidden="true"></span>
    </section>
  )
}

function ContactStrip() {
  return (
    <section className="contact-strip page-width" data-reveal>
      <div><p className="eyebrow">Have a good one in mind?</p><h2>Let’s make it real<span>.</span></h2></div>
      <NavLink className="button button-light magnetic-button" to="/contact" data-cursor="Open">Get in touch <span aria-hidden="true">↗</span></NavLink>
    </section>
  )
}

function NotFound() {
  return (
    <section className="inner-page page-width not-found">
      <p className="eyebrow">Lost your place?</p>
      <h1>This page took<br />the scenic route.</h1>
      <NavLink className="button button-dark" to="/">Back home <span aria-hidden="true">↗</span></NavLink>
    </section>
  )
}

function SiteLoader() {
  return (
    <div className="site-loader" role="status" aria-label="Loading portfolio">
      <div className="loader-mark"><span>C</span><i /></div>
      <p>CHRISTIAN JACOB BULAN</p>
      <div className="loader-track"><span /></div>
      <small>PORTFOLIO / 2026</small>
    </div>
  )
}

function CustomCursor() {
  const cursorRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return undefined
    document.body.classList.add('has-custom-cursor')
    let frame = 0
    const move = event => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        const position = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`
        if (cursorRef.current) cursorRef.current.style.transform = position
        if (ringRef.current) ringRef.current.style.transform = position
        frame = 0
      })
    }
    const hover = event => {
      const target = event.target.closest('a, button, [role="button"], input, textarea')
      if (!target) return
      const label = target.getAttribute('data-cursor') || (target.matches('a') ? 'Open' : 'View')
      if (labelRef.current) labelRef.current.textContent = label
      ringRef.current?.classList.add('is-active')
    }
    const leave = event => {
      if (!event.relatedTarget?.closest('a, button, [role="button"], input, textarea')) {
        ringRef.current?.classList.remove('is-active')
      }
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', hover)
    document.addEventListener('pointerout', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', hover)
      document.removeEventListener('pointerout', leave)
      window.cancelAnimationFrame(frame)
      document.body.classList.remove('has-custom-cursor')
    }
  }, [])

  return (
    <div className="custom-cursor" aria-hidden="true">
      <span className="cursor-dot" ref={cursorRef} />
      <span className="cursor-ring" ref={ringRef}><span ref={labelRef}>View</span></span>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Achievements />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
