import { useEffect, useState } from 'react'
import { BrowserRouter, NavLink, Outlet, Route, Routes } from 'react-router-dom'
import profilePhoto from './assets/ccbd2f41-6e93-4d5a-81b3-eb907c344cab.png'
import rsevenLogo from './assets/R7.jpg'
import attendifyLogo from './assets/Attendify.jfif'
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
    logo: 'Attendify',
    logoImage: attendifyLogo,
    slug: 'attendify',
    description: 'A simple attendance system designed to make daily check-ins quick, organized, and effortless.',
  },
  {
    number: '02',
    title: 'Rseven Management System',
    category: 'System',
    logo: 'R7',
    logoImage: rsevenLogo,
    slug: 'rseven',
    description: 'A practical management system that brings everyday records, tasks, and workflows into one place.',
  },
]

const navigation = [
  { label: 'Home', to: '/', end: true },
  { label: 'About', to: '/about' },
  { label: 'Achievements', to: '/projects' },
  { label: 'Contact', to: '/contact' },
]

function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink className="wordmark" to="/" aria-label="Christian Jacob E. Bulan, home">
          <img className="wordmark-photo" src={profilePhoto} alt="" />
          <span>Christian Jacob E. Bulan</span>
        </NavLink>
        <nav className="main-nav" aria-label="Main navigation">
          {navigation.map(({ label, to, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
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
        <NavLink className="footer-mark" to="/" aria-label="Back to home">
          <span>.</span>
        </NavLink>
        <p>Full Send.</p>
        <NavLink to="/contact">Contact <span aria-hidden="true">↗</span></NavLink>
        <span className="footer-year">© 2026 Christian Jacob E. Bulan</span>
      </footer>
    </div>
  )
}

function Home() {
  return (
    <>
      <section className="home-hero page-width">
        <div className="hero-copy">
        
          <p className="eyebrow"><span /> BS Information Technology Student</p>
          <h1>Hi, I’m Christian<br /><span className="highlight-word">Jacob E. Bulan.</span></h1>
          <p className="hero-description">
            I’m studying Information Technology and exploring web development, software,
            and creative problem-solving. This is where I share what I’m learning and building.
          </p>
          <div className="hero-actions">
            <NavLink className="button button-dark" to="/projects">Explore achievements <span aria-hidden="true">↗</span></NavLink>
            <NavLink className="text-link" to="/about">A bit about me <span aria-hidden="true">→</span></NavLink>
          </div>
          <div className="hero-note"><span></span> Learning, building, and growing in tech</div>
        </div>
        <div className="hero-lanyard">
          <Lanyard frontImage={profilePhoto} backImage={profilePhoto} strapColor="#55b8f2" />
        </div>
      </section>

      <section className="featured-section">
        <div className="page-width section-heading-row">
          <div>
            <p className="eyebrow">Certificates and milestones</p>
            <h2>Achievements<span className="accent-period">.</span></h2>
          </div>
          <NavLink className="text-link" to="/projects">All achievements <span aria-hidden="true">↗</span></NavLink>
        </div>
        <div className="page-width project-grid">
          {achievements.map((achievement) => <AchievementCard key={achievement.number} achievement={achievement} />)}
        </div>
      </section>
      <section className="systems-section page-width">
        <p className="eyebrow">Projects</p>
        <h2>Systems I’ve created<span className="accent-period">.</span></h2>
        <div className="project-grid">
          {systemsCreated.map((system) => <AchievementCard key={system.number} achievement={system} />)}
        </div>
      </section>
      <ContactStrip />
    </>
  )
}

function AchievementCard({ achievement }) {
  const content = <>
    {achievement.logo && <div className={`system-logo ${achievement.slug === 'rseven' ? 'system-logo-r7' : ''}`}>{achievement.logoImage ? <img src={achievement.logoImage} alt={`${achievement.logo} logo`} /> : achievement.logo}</div>}
    <div className="achievement-meta">
      <span className="achievement-number">{achievement.number}</span>
      <p className="project-category">{achievement.category}</p>
    </div>
    <h3>{achievement.title}</h3>
    <p className="project-description">{achievement.description}</p>
    <span className="card-arrow" aria-hidden="true">↗</span>
  </>

  if (achievement.slug) {
    return <NavLink className="achievement-card system-card" to={`/projects/${achievement.slug}`} aria-label={`View ${achievement.title}`}>{content}</NavLink>
  }
  return (
    <article className="achievement-card">
      {content}
    </article>
  )
}

function About() {
  const skills = ['HTML & CSS', 'JavaScript', 'React', 'Responsive web design', 'Git & GitHub', 'Problem solving']

  return (
    <section className="inner-page page-width about-page">
      <p className="eyebrow"><span /> A little introduction</p>
      <h1>Learning the craft.<br /><span className="highlight-word">Building what’s next.</span></h1>
      <div className="about-columns">
        <div className="about-story">
          <p className="lead-copy">I’m Christian Jacob E. Bulan, a Bachelor of Science in Information Technology student building a foundation in web development and software.</p>
          <p>I enjoy learning how technology works and using it to turn ideas into practical digital experiences. This portfolio is a place to share my achievements, classwork, and progress as I grow in the field of IT.</p>
        </div>
        <aside className="skills-panel">
          <p className="eyebrow">Skills I’m developing</p>
          <ul>{skills.map((skill, index) => <li key={skill}><span>0{index + 1}</span>{skill}</li>)}</ul>
        </aside>
      </div>
      <div className="about-note"><span>✳</span><p>Good work happens when the details and the big picture get equal care.</p></div>
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
      <h1>Let’s keep<br /><span className="highlight-word">in touch.</span></h1>
      <p className="contact-copy">I’m a BS Information Technology student, always learning and building. I’m glad you took a look at my portfolio.</p>
      <NavLink className="button button-dark contact-button" to="/projects">See my achievements <span aria-hidden="true">↗</span></NavLink>
      <div className="contact-links" aria-label="Contact details">
        <a href="mailto:christianjacob.bulan27@gmail.com"><span>Email</span>christianjacob.bulan27@gmail.com <b aria-hidden="true">↗</b></a>
        <a href="https://www.instagram.com/onlycobyyyy/" target="_blank" rel="noreferrer"><span>Instagram</span>@onlycobyyyy <b aria-hidden="true">↗</b></a>
      </div>
      <p className="contact-location"><span className="availability-dot" /> Christian Jacob E. Bulan · Information Technology Student</p>
      <span className="contact-spark" aria-hidden="true">✳</span>
    </section>
  )
}

function ContactStrip() {
  return (
    <section className="contact-strip page-width">
      <div><p className="eyebrow">Have a good one in mind?</p><h2>Let’s make it real<span>.</span></h2></div>
      <NavLink className="button button-light" to="/contact">Get in touch <span aria-hidden="true">↗</span></NavLink>
    </section>
  )
}

function SystemDetail({ system }) {
  return (
    <section className="inner-page page-width system-detail">
      <NavLink className="back-link" to="/projects">← Back to achievements</NavLink>
      <div className="system-detail-grid">
        <div className={`system-detail-logo ${system.slug === 'rseven' ? 'system-logo-r7' : ''}`}>{system.logoImage ? <img src={system.logoImage} alt={`${system.logo} logo`} /> : system.logo}</div>
        <div>
          <p className="eyebrow">System / {system.number}</p>
          <h1>{system.title}<span className="accent-period">.</span></h1>
          <p className="system-detail-copy">{system.description}</p>
          <p className="system-detail-note">A student-built project exploring how thoughtful software can simplify real-world work.</p>
        </div>
      </div>
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

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 1450)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <BrowserRouter>
      {loading && <SiteLoader />}
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="projects" element={<Achievements />} />
          <Route path="projects/attendify" element={<SystemDetail system={systemsCreated[0]} />} />
          <Route path="projects/rseven" element={<SystemDetail system={systemsCreated[1]} />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
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

export default App
