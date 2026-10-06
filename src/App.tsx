import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity, Atom, Award, BookOpen, Check, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Clock3, Dices, Flame, FlaskConical, GraduationCap,
  Lightbulb, Moon, RotateCcw, Search, Sparkles, Sun, Target, Trophy, X,
} from 'lucide-react'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts'
import { configurations, flashcards, molecules, orbitalOrder, questionBank, topics, trendComparisons } from './data'
import { awardStudy, loadProgress, saveProgress } from './storage'
import type { ProgressState, Question, TopicId } from './types'

const nav = [
  { to: '/', label: 'Overview', icon: Activity, end: true },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Target },
  { to: '/flashcards', label: 'Flashcards', icon: LayersIcon },
  { to: '/exam', label: 'Mock exam', icon: ClipboardCheck },
]

function LayersIcon({ size = 18 }: { size?: number }) {
  return <span className="layer-icon" style={{ width: size, height: size }}>▱</span>
}

const titleForPath = (path: string) => nav.find((item) => item.to === path)?.label ?? 'Study studio'
const shuffle = <T,>(items: T[]) => [...items].sort(() => Math.random() - 0.5)

function App() {
  const [progress, setProgress] = useState<ProgressState>(loadProgress)
  const location = useLocation()
  const pageTitle = titleForPath(location.pathname)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => saveProgress(progress), [progress])
  useEffect(() => { document.documentElement.dataset.theme = progress.theme }, [progress.theme])
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', handleShortcut)
    return () => window.removeEventListener('keydown', handleShortcut)
  }, [])

  const award = (xp: number, topic?: TopicId) => setProgress((current) => awardStudy(current, xp, topic))
  const toggleTheme = () => setProgress((current) => ({ ...current, theme: current.theme === 'light' ? 'dark' : 'light' }))

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link to="/" className="brand-lockup">
          <span className="brand-mark"><Atom size={22} strokeWidth={1.7} /></span>
          <span><b>element</b><small>STUDY STUDIO</small></span>
        </Link>
        <div className="course-tag"><span className="course-dot" /> HONORS CHEMISTRY <span>UNIT 03—04</span></div>
        <nav className="side-nav" aria-label="Main navigation">
          <p className="nav-caption">YOUR DESK</p>
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              <Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Mock exam' && <span className="nav-new">50</span>}
            </NavLink>
          ))}
          <p className="nav-caption unit-caption">THE SYLLABUS</p>
          <NavLink to="/learn" className="nav-link subnav-link"><span className="subnav-dot aqua" />Atomic structure</NavLink>
          <NavLink to="/learn?topic=vsepr" className="nav-link subnav-link"><span className="subnav-dot lilac" />Molecular geometry</NavLink>
          <NavLink to="/learn?topic=trends" className="nav-link subnav-link"><span className="subnav-dot coral" />Periodic patterns</NavLink>
        </nav>
        <div className="sidebar-bottom">
          <div className="streak-card"><div className="streak-icon"><Flame size={17} /></div><div><b>{progress.streak} day streak</b><small>Little by little adds up.</small></div><span>✦</span></div>
          <div className="student-row"><div className="avatar">J</div><div><b>My study space</b><small>Local profile</small></div><button className="icon-button tiny" title="Toggle color theme" onClick={toggleTheme}>{progress.theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}</button></div>
        </div>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div className="crumb"><span>CHEMISTRY</span><span className="crumb-slash">/</span><b>{pageTitle.toUpperCase()}</b></div>
          <div className="top-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)}><Search size={15} /><span>Find a topic</span><kbd>⌘ K</kbd></button>
            <div className="xp-pill"><Sparkles size={15} /><b>{progress.xp.toLocaleString()}</b><span>XP</span></div>
            <button className="icon-button theme-button" title="Toggle light or dark mode" onClick={toggleTheme}>{progress.theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}</button>
          </div>
        </header>
        <main className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard progress={progress} />} />
            <Route path="/learn" element={<LearnPage award={award} />} />
            <Route path="/practice" element={<PracticePage award={award} />} />
            <Route path="/flashcards" element={<FlashcardPage award={award} />} />
            <Route path="/exam" element={<ExamPage award={award} />} />
            <Route path="*" element={<Dashboard progress={progress} />} />
          </Routes>
        </main>
      </div>
      <AnimatePresence>
        {searchOpen && <SearchPalette close={() => setSearchOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}

function Dashboard({ progress }: { progress: ProgressState }) {
  const level = Math.floor(progress.xp / 250) + 1
  const levelProgress = Math.round((progress.xp % 250) / 250 * 100)
  const chartData = [{ day: 'M', score: 26 }, { day: 'T', score: 41 }, { day: 'W', score: 34 }, { day: 'T', score: 62 }, { day: 'F', score: 49 }, { day: 'S', score: 78 }, { day: 'S', score: 68 }]
  const today = new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).format(new Date()).toUpperCase()
  const badges = [
    { name: 'Bohr Master', earned: progress.masteredTopics.includes('bohr') },
    { name: 'Electron Wizard', earned: progress.masteredTopics.includes('configuration') && progress.masteredTopics.includes('filling') },
    { name: 'Spectra Expert', earned: progress.masteredTopics.includes('pes') },
    { name: 'Trend Tracker', earned: progress.masteredTopics.includes('trends') },
    { name: 'Chemistry Champion', earned: progress.masteredTopics.length === topics.length },
  ]
  return (
    <motion.div className="dashboard-page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <section className="welcome-row">
        <div><div className="eyebrow"><span className="eyebrow-line" /> {today} <span className="eyebrow-sun">✳</span></div><h1>Good afternoon,<br /><em>future chemist.</em></h1><p>One good question at a time. Pick up where you left off.</p></div>
        <Link to="/practice" className="primary-button"><span>Start a study session</span><ChevronRight size={17} /></Link>
        <div className="welcome-orbit orbit-one" /><div className="welcome-orbit orbit-two" />
      </section>

      <div className="dashboard-grid">
        <div className="dashboard-main">
          <section className="section-heading"><div><span className="section-kicker">YOUR PROGRESS</span><h2>The big picture</h2></div><button className="text-button">This week <ChevronDown size={14} /></button></section>
          <div className="metric-grid">
            <MetricCard label="Unit mastery" value={`${Math.round(progress.masteredTopics.length / topics.length * 100)}%`} detail={`${progress.masteredTopics.length} of ${topics.length} topics`} color="mint" icon={<Target size={16} />} />
            <MetricCard label="Questions answered" value={String(progress.completedQuestions).padStart(2, '0')} detail="Keep the momentum" color="lilac" icon={<CircleHelp size={16} />} />
            <MetricCard label="Study streak" value={`${progress.streak} days`} detail="Your longest is 7 days" color="peach" icon={<Flame size={16} />} />
          </div>

          <section className="continue-section">
            <div className="section-heading"><div><span className="section-kicker">BACK INTO THE FLOW</span><h2>Pick up where you left off</h2></div><Link to="/learn" className="text-button">All lessons <ChevronRight size={14} /></Link></div>
            <Link to="/learn?topic=configuration" className="continue-card">
              <div className="continue-art"><span className="orbit-glow" /><span className="atom-core">Na</span><span className="atom-ring ring-a" /><span className="atom-ring ring-b" /><span className="atom-electron electron-a" /><span className="atom-electron electron-b" /></div>
              <div className="continue-copy"><div className="card-overline"><span>LESSON 06</span><span className="duration"><Clock3 size={12} /> 8 MIN</span></div><h3>Electron configurations</h3><p>Map electrons into orbitals, one step at a time.</p><div className="lesson-progress"><span><i style={{ width: '38%' }} /></span><small>38% complete</small></div></div>
              <div className="continue-arrow"><ChevronRight size={19} /></div>
            </Link>
          </section>

          <section className="topics-section">
            <div className="section-heading"><div><span className="section-kicker">THE ROADMAP</span><h2>Units 3 & 4</h2></div><span className="topic-count">09 TOPICS</span></div>
            <div className="topic-list">{topics.map((topic, index) => <Link to={`/learn?topic=${topic.id}`} key={topic.id} className="topic-row"><span className={`topic-icon ${topic.color}`}>{topic.icon}</span><span className="topic-row-name"><b>{topic.title}</b><small>{topic.summary}</small></span><span className="topic-status">{progress.masteredTopics.includes(topic.id) ? <><span className="mastered-check"><Check size={11} /></span> Mastered</> : `${index + 1} / 9`}</span><ChevronRight size={15} className="topic-chevron" /></Link>)}</div>
          </section>
        </div>

        <aside className="dashboard-aside">
          <section className="level-card"><div className="level-top"><div><span className="section-kicker">YOUR LEVEL</span><h3>Curious mind</h3></div><div className="level-badge"><span>{level}</span><small>LVL</small></div></div><div className="level-track"><span style={{ width: `${levelProgress}%` }} /></div><div className="level-foot"><span>{progress.xp % 250} / 250 XP</span><span>Level {level + 1} <ChevronRight size={12} /></span></div><div className="level-stars">✳ <span>✳</span> ✳ <span>✳</span> ✳</div></section>

          <section className="activity-card"><div className="aside-heading"><div><span className="section-kicker">STUDY RHYTHM</span><h3>Your activity</h3></div><span className="chart-dot" /></div><div className="activity-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 10, right: 0, left: -24, bottom: 0 }}><defs><linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#59c6a0" stopOpacity={0.23} /><stop offset="100%" stopColor="#59c6a0" stopOpacity={0} /></linearGradient></defs><CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 5" /><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} dy={8} /><YAxis hide domain={[0, 90]} /><Tooltip contentStyle={{ background: 'var(--surface)', border: '1px solid var(--line)', borderRadius: 8, fontSize: 12 }} /><Area type="monotone" dataKey="score" stroke="#49b991" strokeWidth={2} fill="url(#activityFill)" /></AreaChart></ResponsiveContainer></div><div className="chart-caption"><span>Less</span><i /><i /><i /><i /><i /><span>More</span><b>+18% this week</b></div></section>

          <section className="achievement-card"><div className="achievement-top"><span className="award-icon"><Award size={16} /></span><span className="section-kicker">MILESTONE BADGES</span><span className="achievement-dots">···</span></div><div className="achievement-medal"><span>✦</span></div><h3>First principles</h3><p>Master your first two chemistry concepts.</p><div className="achievement-earned"><Check size={12} /> EARNED <span>+50 XP</span></div><div className="achievement-badges">{badges.map((badge) => <span className={badge.earned ? 'earned' : ''} key={badge.name} title={badge.name}><i>{badge.earned ? '✦' : '·'}</i>{badge.name}</span>)}</div></section>

          <Link to="/exam" className="exam-nudge"><div className="nudge-icon"><GraduationCap size={18} /></div><div><b>Ready for the real thing?</b><small>Take the 50-question mock exam</small></div><ChevronRight size={16} /></Link>
        </aside>
      </div>
    </motion.div>
  )
}

function MetricCard({ label, value, detail, color, icon }: { label: string; value: string; detail: string; color: string; icon: React.ReactNode }) {
  return <div className={`metric-card ${color}`}><div className="metric-head"><span>{label}</span><i>{icon}</i></div><b className="metric-value">{value}</b><small>{detail}</small></div>
}

function LearnPage({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const location = useLocation()
  const requestedTopic = new URLSearchParams(location.search).get('topic') as TopicId | null
  const [selected, setSelected] = useState<TopicId>(requestedTopic && topics.some((topic) => topic.id === requestedTopic) ? requestedTopic : 'bohr')
  const [openNote, setOpenNote] = useState(0)
  const topic = topics.find((item) => item.id === selected)!
  const notes = lessonNotes[selected]
  useEffect(() => { if (requestedTopic && topics.some((item) => item.id === requestedTopic)) setSelected(requestedTopic) }, [requestedTopic])
  return (
    <motion.div className="study-page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <PageHeading eyebrow="THE FIELD GUIDE · 9 SHORT LESSONS" title="Learn the language." intro="Clear explanations, visual models, and small wins that stick." />
      <div className="learn-layout">
        <div className="lesson-rail"><span className="section-kicker">UNIT MAP</span>{topics.map((item, index) => <button key={item.id} className={`lesson-select${selected === item.id ? ' chosen' : ''}`} onClick={() => { setSelected(item.id); setOpenNote(0) }}><span className={`lesson-index ${item.color}`}>{String(index + 1).padStart(2, '0')}</span><span>{item.title}</span>{selected === item.id && <ChevronRight size={14} />}</button>)}</div>
        <div className="lesson-main"><div className={`lesson-hero ${topic.color}`}><div><span className="lesson-number">LESSON {String(topics.findIndex((item) => item.id === selected) + 1).padStart(2, '0')} <span>·</span> 6 MIN READ</span><h2>{topic.title}</h2><p>{topic.summary}</p></div><div className="lesson-visual" aria-hidden="true"><LessonVisual topic={selected} /></div></div>
          <div className="lesson-note-list">{notes.map((note, index) => <div key={note.title} className={`lesson-note${openNote === index ? ' expanded' : ''}`}><button onClick={() => setOpenNote(openNote === index ? -1 : index)}><span className="note-index">{String(index + 1).padStart(2, '0')}</span><b>{note.title}</b><ChevronDown size={16} /></button>{openNote === index && <div className="note-body">{note.body}<ul>{note.points.map((point) => <li key={point}>{point}</li>)}</ul>{note.callout && <div className="note-callout"><Lightbulb size={15} />{note.callout}</div>}</div>}</div>)}</div>
          {selected === 'pes' && <PESLab award={award} />}
          <div className="lesson-footer"><div><span className="section-kicker">READY TO CHECK IN?</span><p>See what you remember from this lesson.</p></div><Link to="/practice" className="primary-button">Try a practice set <ChevronRight size={16} /></Link></div>
        </div>
      </div>
    </motion.div>
  )
}

type Note = { title: string; body: string; points: string[]; callout?: string }
const lessonNotes: Record<TopicId, Note[]> = {
  bohr: [
    { title: 'An atom with rungs', body: 'Picture electron energy as a ladder, not a ramp. Electrons can occupy certain allowed levels, but not the spaces between them.', points: ['The nucleus sits at the center.', 'The first three shell capacities in this simplified model are 2, 8, and 8.', 'The lowest available arrangement is the ground state.'], callout: 'Shell diagrams are a useful model, but electrons do not travel in literal planet-like circles.' },
    { title: 'The jump and the glow', body: 'An electron absorbs a specific amount of energy to move up a rung. As it falls back down, the energy leaves as a photon.', points: ['Absorption moves an electron to a higher energy level.', 'Emission releases a photon as the electron returns lower.', 'The photon energy matches the difference between levels.'] },
  ],
  light: [
    { title: 'Light is a wave', body: 'Wavelength and frequency are linked through the speed of light. Shorter wavelengths mean higher frequencies.', points: ['c = λν', 'c = 3.00 × 10⁸ m/s', 'Use ν = c/λ or λ = c/ν; convert units before substituting.'], callout: 'A wavelength of 600 nm is 6.00 × 10⁻⁷ m, not 600 m.' },
    { title: 'Read the lines', body: 'Each element has its own allowed energy gaps, so the emitted wavelengths form a unique spectral fingerprint.', points: ['Absorb energy → electron rises.', 'Electron falls → photon is emitted.', 'A line spectrum is evidence of quantized energy levels.'] },
  ],
  quantum: [
    { title: 'From paths to probability', body: 'The modern quantum model does not give electrons fixed tracks. It predicts where an electron is likely to be detected.', points: ['An electron cloud is a probability distribution.', 'An orbital is a region of high probability.', 'Quantum numbers describe properties of an electron’s state.'], callout: 'A cloud boundary is not a hard edge; it is a convenient way to show probability.' },
    { title: 'What an orbital tells you', body: 'Orbitals come in families with characteristic shapes, orientations, and energies. Each orbital can contain at most two electrons.', points: ['s orbitals are spherical.', 'p orbitals are dumbbell-shaped.', 'Subshells contain one or more orbitals.'] },
  ],
  orbitals: [
    { title: 'Four subshells to know', body: 'Every orbital holds at most two electrons. Count the orbitals in a subshell, then double to get its capacity.', points: ['s: 1 orbital × 2 = 2 electrons.', 'p: 3 orbitals × 2 = 6 electrons.', 'd: 5 orbitals × 2 = 10; f: 7 orbitals × 2 = 14.'], callout: 'Remember: 1, 3, 5, 7 orbitals; 2, 6, 10, 14 electrons.' },
    { title: 'Shapes show probability', body: 'The shape is a map of likely electron location, not a boundary or a path.', points: ['s is spherical.', 'p has three orientations, often drawn as dumbbells.', 'd and f have more complex probability shapes.'] },
  ],
  filling: [
    { title: 'Build in energy order', body: 'The Aufbau principle gives the order. For the first 20 elements, follow 1s, 2s, 2p, 3s, 3p, 4s.', points: ['Aufbau: fill lowest energy first.', 'Pauli: max two per orbital with opposite spins.', 'Hund: fill equal-energy orbitals singly before pairing.'], callout: 'In a p subshell, place one arrow in each of the three boxes before you pair any.' },
    { title: 'Check the arrows', body: 'An orbital diagram turns electron configurations into boxes and arrows. Each arrow represents one electron and its spin.', points: ['↑↓ is a valid pair.', '↑↑ in one box breaks Pauli.', 'Pairing one p box while another is empty breaks Hund.'] },
  ],
  configuration: [
    { title: 'Write the full configuration', body: 'Count the electrons, then fill orbitals in increasing energy order. Superscripts show the number in each subshell.', points: ['Oxygen has 8 electrons: 1s² 2s² 2p⁴.', 'Sodium has 11 electrons: 1s² 2s² 2p⁶ 3s¹.', 'Check that superscripts sum to the neutral atom’s atomic number.'], callout: 'For neutral atoms, electron count equals atomic number.' },
    { title: 'Compress with a noble gas', body: 'Replace the core electrons with the preceding noble gas in brackets, then write the remaining subshells.', points: ['Na: [Ne] 3s¹.', 'Fe: [Ar] 4s² 3d⁶.', 'The bracketed noble gas represents a filled inner-shell core.'] },
  ],
  pes: [
    { title: 'A fingerprint of electrons', body: 'Photoelectron spectroscopy measures how much energy it takes to remove electrons. Peaks group electrons with similar binding energies.', points: ['Peak position corresponds to binding energy.', 'Peak height or area represents relative electron count.', 'High binding energy means electrons are held tightly.'], callout: 'Many textbook graphs put high binding energy on the left, so always check the axis.' },
    { title: 'Find the valence electrons', body: 'The least tightly bound electrons are easiest to remove and appear at the lowest binding-energy end of the spectrum.', points: ['The lowest-binding-energy peaks represent valence electrons.', 'Peak ratios can reveal subshell electron counts.', 'Compare peak patterns to infer electron configurations.'] },
  ],
  vsepr: [
    { title: 'Count electron domains', body: 'Electron groups around a central atom repel and spread as far apart as they can. Lone pairs count as domains and push more strongly than bonds.', points: ['2 bonds, 0 lone pairs: linear.', '3 bonds, 0 lone pairs: trigonal planar.', '4 bonds, 0 lone pairs: tetrahedral.', '3 bonds + 1 lone pair: trigonal pyramidal; 2 bonds + 2 lone pairs: bent.'], callout: 'Molecular shape names describe atom positions, not lone-pair positions.' },
    { title: 'Try the model', body: 'Use the challenge below to connect a formula to its geometry and ideal bond angle.', points: ['CO₂ is linear at 180°.', 'NH₃ is trigonal pyramidal at about 107°.', 'H₂O is bent at about 104.5°.'] },
  ],
  trends: [
    { title: 'Across and down', body: 'Effective nuclear charge and shielding explain the big patterns. Across a period, the nucleus pulls more strongly on electrons in the same shell.', points: ['Electronegativity generally increases across and up; F is highest.', 'Ionization energy generally increases across and up.', 'Atomic radius generally decreases across and increases down.'], callout: 'Trend questions often compare a direction: sketch the arrow before choosing.' },
    { title: 'Ions change size', body: 'Changing the electron count changes electron-electron repulsion and sometimes removes an entire outer shell.', points: ['Cations lose electrons and are smaller than their parent atom.', 'Anions gain electrons and are larger than their parent atom.', 'The octet rule is a useful tendency, not an unbreakable law.'] },
  ],
}

const pesAtoms = {
  Na: [{ orbital: '1s', bindingEnergy: 1041, electrons: 2 }, { orbital: '2s', bindingEnergy: 63, electrons: 2 }, { orbital: '2p', bindingEnergy: 31, electrons: 6 }, { orbital: '3s', bindingEnergy: 5.1, electrons: 1 }],
  Mg: [{ orbital: '1s', bindingEnergy: 1303, electrons: 2 }, { orbital: '2s', bindingEnergy: 89, electrons: 2 }, { orbital: '2p', bindingEnergy: 50, electrons: 6 }, { orbital: '3s', bindingEnergy: 7.6, electrons: 2 }],
  Cl: [{ orbital: '1s', bindingEnergy: 2822, electrons: 2 }, { orbital: '2s', bindingEnergy: 270, electrons: 2 }, { orbital: '2p', bindingEnergy: 200, electrons: 6 }, { orbital: '3s', bindingEnergy: 18, electrons: 2 }, { orbital: '3p', bindingEnergy: 6, electrons: 5 }],
}

function PESLab({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const [element, setElement] = useState<keyof typeof pesAtoms>('Na')
  const [selectedPeak, setSelectedPeak] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const data = pesAtoms[element]
  const valenceOrbital = data[data.length - 1].orbital
  const correct = selectedPeak === valenceOrbital
  return <section className="pes-lab"><div className="pes-lab-head"><div><span className="section-kicker">INTERACTIVE SPECTRUM</span><h3>Read the peaks</h3><p>Click the lowest-binding-energy peak: where are the valence electrons?</p></div><div className="pes-atom-picker">{(Object.keys(pesAtoms) as (keyof typeof pesAtoms)[]).map((symbol) => <button className={element === symbol ? 'active' : ''} key={symbol} onClick={() => { setElement(symbol); setSelectedPeak(null); setChecked(false) }}>{symbol}</button>)}</div></div><div className="pes-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 20, right: 10, left: -25, bottom: 4 }} onClick={(event) => { if (event?.activePayload?.[0]) { setSelectedPeak(String(event.activePayload[0].payload.orbital)); setChecked(false) } }}><CartesianGrid vertical={false} stroke="var(--line)" strokeDasharray="3 5" /><XAxis dataKey="orbital" axisLine={{ stroke: 'var(--line-strong)' }} tickLine={false} tick={{ fill: 'var(--muted)', fontSize: 10 }} label={{ value: 'Subshell · binding energy decreases →', position: 'insideBottom', offset: -1, fill: 'var(--muted)', fontSize: 9 }} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: 'var(--muted)', fontSize: 9 }} label={{ value: 'Electrons', angle: -90, position: 'insideLeft', fill: 'var(--muted)', fontSize: 9 }} /><Tooltip cursor={{ fill: 'var(--green-pale)', opacity: .4 }} content={({ active, payload }) => active && payload?.[0] ? <div className="pes-tooltip"><b>{payload[0].payload.orbital}</b><span>{payload[0].payload.bindingEnergy} eV binding energy</span><span>{payload[0].payload.electrons} electrons</span></div> : null} /><Bar dataKey="electrons" fill="#66b78e" radius={[3, 3, 0, 0]} maxBarSize={39} /></BarChart></ResponsiveContainer></div><div className="pes-legend"><span><i /> Peak height = relative electron count</span><span>Peak label = binding energy (eV)</span></div>{checked && <div className={`feedback compact ${correct ? 'right' : 'wrong'}`}><b>{correct ? 'Valence peak found.' : `Try again: ${valenceOrbital} is the lowest-binding-energy peak.`}</b><span>Valence electrons are least tightly bound, so they appear at the lowest binding energy.</span></div>}<button className="primary-button" disabled={selectedPeak === null || checked} onClick={() => { setChecked(true); if (correct) award(12, 'pes') }}>{selectedPeak ? `Check ${selectedPeak} peak` : 'Select a peak'} <ChevronRight size={15} /></button></section>
}

function LessonVisual({ topic }: { topic: TopicId }) {
  if (topic === 'orbitals') return <div className="orbital-family"><div><i className="s-orbital-shape" />s</div><div><i className="p-orbital-shape" />p</div><div><i className="d-orbital-shape" />d</div></div>
  if (topic === 'quantum') return <div className="cloud-shape"><span /><i /><b /></div>
  if (topic === 'vsepr') return <MoleculeDrawing shape="Tetrahedral" />
  if (topic === 'light' || topic === 'pes') return <div className="spectrum-visual"><i /><i /><i /><i /><i /><i /><i /></div>
  return <div className="bohr-visual"><span className="bohr-nucleus">e⁺</span><i className="bohr-path one" /><i className="bohr-path two" /><b className="bohr-dot one" /><b className="bohr-dot two" /><b className="bohr-dot three" /></div>
}

function PageHeading({ eyebrow, title, intro, right }: { eyebrow: string; title: string; intro: string; right?: React.ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow"><span className="eyebrow-line" />{eyebrow}</div><h1>{title}</h1><p>{intro}</p></div>{right}</div>
}

function PracticePage({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const [mode, setMode] = useState<'quiz' | 'match' | 'formula' | 'config' | 'orbital' | 'shape' | 'trends' | 'rank'>('quiz')
  const modeItems = [
    { id: 'quiz', label: 'Quick quiz', icon: Dices }, { id: 'match', label: 'Match pairs', icon: LayersIcon }, { id: 'formula', label: 'Formula lab', icon: Activity },
    { id: 'config', label: 'Config trainer', icon: Atom }, { id: 'orbital', label: 'Orbital lab', icon: Sparkles },
    { id: 'shape', label: 'Shape challenge', icon: FlaskConical }, { id: 'trends', label: 'Trend duel', icon: ChevronRight }, { id: 'rank', label: 'Drag to rank', icon: Activity },
  ] as const
  return <motion.div className="study-page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><PageHeading eyebrow="ACTIVE RECALL · XP ON" title="Practice makes permanent." intro="Pick a training room. Fast feedback, no judgment." />
    <div className="practice-tabs">{modeItems.map(({ id, label, icon: Icon }) => <button key={id} className={mode === id ? 'selected' : ''} onClick={() => setMode(id)}><Icon size={15} />{label}</button>)}</div>
    <div className="practice-workspace">{mode === 'quiz' && <QuizLab award={award} />}{mode === 'match' && <MatchLab award={award} />}{mode === 'formula' && <FormulaLab award={award} />}{mode === 'config' && <ConfigurationLab award={award} />}{mode === 'orbital' && <OrbitalLab award={award} />}{mode === 'shape' && <ShapeChallenge award={award} />}{mode === 'trends' && <TrendDuel award={award} />}{mode === 'rank' && <RankLab award={award} />}</div>
  </motion.div>
}

const matchPairs = [
  { term: 'Aufbau', definition: 'Lowest-energy orbitals fill first.' },
  { term: 'Hund', definition: 'Equal-energy orbitals fill singly before pairing.' },
  { term: 'Pauli', definition: 'Two electrons per orbital, with opposite spins.' },
  { term: 'Peak height', definition: 'Relative number of electrons in a PES subshell.' },
  { term: 'Electron cloud', definition: 'A probability map of where an electron may be found.' },
]

function MatchLab({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const [definitions] = useState(() => shuffle(matchPairs.map((item, id) => ({ ...item, id }))))
  const [remaining, setRemaining] = useState(matchPairs.map((_, id) => id))
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null)
  const [message, setMessage] = useState('Choose a term, then its matching definition.')
  const [wrong, setWrong] = useState(false)
  const pair = (definitionId: number) => {
    if (selectedTerm === null) { setMessage('Choose a term on the left first.'); return }
    if (selectedTerm === definitionId) {
      setRemaining((current) => current.filter((id) => id !== definitionId))
      setMessage('Nice match. Keep going.')
      setWrong(false)
      setSelectedTerm(null)
      award(8)
    } else {
      setMessage('Not that one. Read both sides and try another pair.')
      setWrong(true)
    }
  }
  return <section className="practice-card match-card"><div className="practice-card-top"><span className="section-kicker">CONCEPT MATCH · {remaining.length} PAIRS LEFT</span><span className="score-chip"><Check size={13} /> {matchPairs.length - remaining.length} matched</span></div><h2>Connect the chemistry.</h2><p className="match-intro">Tap a term, then tap its definition.</p><div className="match-columns"><div><span className="section-kicker">TERM</span>{remaining.map((id) => <button key={id} className={`match-tile${selectedTerm === id ? ' selected' : ''}`} onClick={() => { setSelectedTerm(id); setWrong(false) }}>{matchPairs[id].term}</button>)}</div><div><span className="section-kicker">DEFINITION</span>{definitions.filter((item) => remaining.includes(item.id)).map((item) => <button key={item.id} className="match-tile" onClick={() => pair(item.id)}>{item.definition}</button>)}</div></div><div className={`match-message${wrong ? ' error' : ''}${remaining.length === 0 ? ' complete' : ''}`}>{remaining.length === 0 ? 'All matched. Beautifully done.' : message}</div>{remaining.length === 0 && <button className="text-button" onClick={() => { setRemaining(matchPairs.map((_, id) => id)); setSelectedTerm(null); setMessage('Choose a term, then its matching definition.') }}>Play again <RotateCcw size={14} /></button>}</section>
}

function RankLab({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const correctOrder = ['Li', 'Na', 'K']
  const [order, setOrder] = useState(['Na', 'K', 'Li'])
  const [dragged, setDragged] = useState<number | null>(null)
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const move = (from: number, to: number) => { if (to < 0 || to >= order.length || from === to) return; const next = [...order]; const [item] = next.splice(from, 1); next.splice(to, 0, item); setOrder(next); setChecked(false) }
  const isCorrect = order.every((element, index) => element === correctOrder[index])
  return <section className="practice-card rank-card"><div className="practice-card-top"><span className="section-kicker">PERIODIC TREND GAME · ATOMIC RADIUS</span><span className="score-chip"><Activity size={13} /> Rank the atoms</span></div><div className="rank-prompt"><h2>Smallest to largest.</h2><p>Drag the elements into order by atomic radius. Down a group, each step adds an electron shell.</p></div><div className="rank-list">{order.map((element, index) => <div className="rank-item" key={element} draggable onDragStart={() => setDragged(index)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (dragged !== null) move(dragged, index); setDragged(null) }} onDragEnd={() => setDragged(null)}><span className="drag-grip" aria-label="Drag to reorder">⠿</span><span className="rank-number">{index + 1}</span><span className="rank-element">{element}</span><span className="rank-size" style={{ width: `${element === 'Li' ? 13 : element === 'Na' ? 21 : 31}px` }} /><div className="rank-arrows"><button title="Move up" disabled={index === 0} onClick={() => move(index, index - 1)}>↑</button><button title="Move down" disabled={index === order.length - 1} onClick={() => move(index, index + 1)}>↓</button></div></div>)}</div>{checked && <div className={`feedback compact ${correct ? 'right' : 'wrong'}`}><b>{correct ? 'That order is right.' : 'Take another look at the group trend.'}</b><span>Atomic radius increases down a group: Li &lt; Na &lt; K.</span></div>}<button className="primary-button" disabled={checked && correct} onClick={() => { setCorrect(isCorrect); setChecked(true); if (isCorrect && !checked) award(15, 'trends') }}>Check my ranking <ChevronRight size={15} /></button></section>
}

function QuizLab({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const [question, setQuestion] = useState<Question>(() => shuffle(questionBank)[0])
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(0)
  const next = () => { setQuestion(shuffle(questionBank)[0]); setSelected(null) }
  const check = () => { if (selected === null) return; award(selected === question.answer ? 12 : 4, selected === question.answer ? question.topic : undefined); setAnswered((value) => value + 1) }
  const topic = topics.find((item) => item.id === question.topic)!
  return <section className="practice-card quiz-card"><div className="practice-card-top"><div><span className="section-kicker">MIXED TOPIC · QUESTION {String(answered + 1).padStart(2, '0')}</span><span className={`question-topic ${topic.color}`}>{topic.short}</span></div><button className="icon-button" title="Skip question" onClick={next}><RotateCcw size={16} /></button></div><h2>{question.prompt}</h2><div className="answer-list">{question.options.map((option, index) => { const chosen = selected === index; const correct = question.answer === index; const show = selected !== null; return <button key={option} disabled={show} onClick={() => setSelected(index)} className={`answer-option${chosen ? ' picked' : ''}${show && correct ? ' correct' : ''}${show && chosen && !correct ? ' incorrect' : ''}`}><span className="answer-letter">{String.fromCharCode(65 + index)}</span>{option}{show && correct && <Check size={16} className="answer-check" />}{show && chosen && !correct && <X size={16} />}</button> })}</div>{selected === null ? <button disabled={selected === null} onClick={check} className="primary-button disabled-button">Choose an answer</button> : <div className={`feedback ${selected === question.answer ? 'right' : 'wrong'}`}><b>{selected === question.answer ? 'That’s it.' : 'Not quite.'}</b><span>{question.explanation}</span><button onClick={next}>Next question <ChevronRight size={15} /></button></div>}<div className="practice-foot"><span><Sparkles size={13} /> +12 XP for a correct answer</span><span>{answered} answered</span></div></section>
}

function FormulaLab({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const [wavelength, setWavelength] = useState(500)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const [frequencyMode, setFrequencyMode] = useState(true)
  const [seed, setSeed] = useState(0)
  const wavelengthMeters = wavelength * 1e-9
  const frequency = 3e8 / wavelengthMeters
  const expected = frequencyMode ? frequency : wavelengthMeters
  const targetDisplay = frequencyMode ? (frequency / 1e14).toFixed(2) : `${(wavelengthMeters / 1e-9).toFixed(0)} nm`
  const isRight = Math.abs(Number(answer) - expected) / expected < 0.02 || Math.abs(Number(answer) - (frequencyMode ? frequency / 1e14 : wavelength)) / (frequencyMode ? frequency / 1e14 : wavelength) < 0.02
  const makeNew = () => { setSeed((value) => value + 1); setWavelength([420, 480, 520, 600, 680][Math.floor(Math.random() * 5)]); setAnswer(''); setChecked(false) }
  return <section className="practice-card lab-card"><div className="practice-card-top"><span className="section-kicker">FORMULA LAB · PROBLEM {seed + 1}</span><button className="icon-button" title="New problem" onClick={makeNew}><Dices size={17} /></button></div><div className="formula-header"><div><span className="formula-label">LIGHT RELATIONSHIP</span><h2>c = λν</h2><p>Speed of light is wavelength times frequency.</p></div><div className="formula-equation">c <span>=</span> λν</div></div><div className="segmented-control"><button className={frequencyMode ? 'active' : ''} onClick={() => { setFrequencyMode(true); setAnswer(''); setChecked(false) }}>Find frequency</button><button className={!frequencyMode ? 'active' : ''} onClick={() => { setFrequencyMode(false); setAnswer(''); setChecked(false) }}>Find wavelength</button></div><div className="given-box"><span>GIVEN {frequencyMode ? 'WAVELENGTH' : 'FREQUENCY'}</span><b>{frequencyMode ? `${wavelength} nm` : `${(frequency / 1e14).toFixed(2)} × 10¹⁴ Hz`}</b><small>c = 3.00 × 10⁸ m/s</small></div><label className="answer-input-label">{frequencyMode ? 'Frequency in units of 10¹⁴ Hz' : 'Wavelength in nm'}<div className="input-unit"><input type="number" value={answer} onChange={(event) => { setAnswer(event.target.value); setChecked(false) }} placeholder={frequencyMode ? 'e.g. 6.00' : 'e.g. 500'} /><span>{frequencyMode ? '× 10¹⁴ Hz' : 'nm'}</span></div></label>{checked && <div className={`feedback compact ${isRight ? 'right' : 'wrong'}`}><b>{isRight ? 'Correct!' : `Close. The answer is ${targetDisplay}${frequencyMode ? ' × 10¹⁴ Hz' : ''}.`}</b><span>{frequencyMode ? 'ν = c/λ = 3.00 × 10⁸ ÷ ' + wavelengthMeters.toExponential(2) + ' m.' : 'λ = c/ν, then convert meters to nanometers.'}</span></div>}<button className="primary-button" disabled={!answer || checked} onClick={() => { setChecked(true); if (isRight) award(15, 'light') }}>Check calculation <ChevronRight size={16} /></button></section>
}

function ConfigurationLab({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [checked, setChecked] = useState(false)
  const config = configurations[index % configurations.length]
  const normalize = (value: string) => value.toLowerCase().replace(/\s/g, '').replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (digit) => '⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(digit).toString())
  const right = [config.answer, config.shorthand].some((value) => normalize(answer) === normalize(value))
  return <section className="practice-card lab-card"><div className="practice-card-top"><span className="section-kicker">CONFIGURATION TRAINER · ATOM {index + 1}</span><button className="icon-button" title="Try another atom" onClick={() => { setIndex((value) => value + 1); setAnswer(''); setChecked(false) }}><Dices size={17} /></button></div><div className="element-prompt"><span className="element-symbol">{config.symbol}</span><div><span className="section-kicker">NEUTRAL ATOM</span><h2>{config.element}</h2><p>Write the full electron configuration.</p></div></div><label className="answer-input-label">Your answer<div className="input-unit"><input value={answer} onChange={(event) => { setAnswer(event.target.value); setChecked(false) }} placeholder="1s2 2s2 2p..." /><span>SUBSHELLS</span></div></label>{checked && <div className={`feedback compact ${right ? 'right' : 'wrong'}`}><b>{right ? 'Configuration checks out.' : 'Check the subshell order and electron count.'}</b><span>Full: {config.answer.replace(/(\d+)/g, '$1')} · Shorthand: {config.shorthand}</span></div>}<button disabled={!answer || checked} className="primary-button" onClick={() => { setChecked(true); if (right) award(18, 'configuration') }}>Check configuration <ChevronRight size={16} /></button><div className="hint-strip"><Lightbulb size={15} /><span>Start with the lowest-energy orbital; total superscripts should equal {config.symbol}’s atomic number.</span></div></section>
}

type OrbitalMap = Record<string, number[][]>
const orbitalSlots: Record<string, number> = { '1s': 1, '2s': 1, '2p': 3, '3s': 1, '3p': 3 }
function OrbitalLab({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const [electrons, setElectrons] = useState<OrbitalMap>({ '1s': [[]], '2s': [[]], '2p': [[], [], []], '3s': [[]], '3p': [[], [], []] })
  const [spin, setSpin] = useState<1 | -1>(1)
  const [message, setMessage] = useState('Choose an orbital box, then add an electron.')
  const [checked, setChecked] = useState(false)
  const used = Object.values(electrons).flat(2).length
  const addElectron = (orbital: string, slot: number) => {
    const activeOrbital = orbitalOrder.find((key) => electrons[key].flat().length < orbitalSlots[key] * 2)
    if (orbital !== activeOrbital) { setMessage(`Aufbau principle: fill ${activeOrbital} before ${orbital}.`); return }
    const boxes = electrons[orbital].map((box) => [...box])
    const emptyBox = boxes.findIndex((box) => box.length === 0)
    if (orbital.endsWith('p') && emptyBox !== -1) {
      if (slot !== emptyBox || spin !== 1) { setMessage('Hund’s rule: add one spin-up electron to each p orbital before pairing.'); return }
      boxes[slot] = [spin]
    } else {
      if (boxes[slot].length === 2) { setMessage('Pauli exclusion: this orbital already holds two electrons.'); return }
      if (boxes[slot].includes(spin)) { setMessage('Pauli exclusion: paired electrons must have opposite spins.'); return }
      boxes[slot].push(spin)
    }
    setElectrons({ ...electrons, [orbital]: boxes })
    setChecked(false)
    setMessage('Nice: that electron follows the filling rules.')
  }
  const reset = () => { setElectrons({ '1s': [[]], '2s': [[]], '2p': [[], [], []], '3s': [[]], '3p': [[], [], []] }); setChecked(false); setMessage('Choose an orbital box, then add an electron.') }
  const check = () => { if (used >= 10) { setMessage(`Great work: ${used} electrons filled while following the rules.`); if (!checked) award(15, 'filling'); setChecked(true) } else setMessage(`Keep filling: you have ${used} electron${used === 1 ? '' : 's'} so far. Try building neon (10).`) }
  return <section className="practice-card orbital-lab"><div className="practice-card-top"><div><span className="section-kicker">ORBITAL FILLING SIMULATOR</span><h2>Build an atom</h2></div><button className="icon-button" title="Reset diagram" onClick={reset}><RotateCcw size={16} /></button></div><div className="orbital-instruction"><b>{used} <span>/ 18 electrons</span></b><div><button className={spin === 1 ? 'spin-active' : ''} onClick={() => setSpin(1)}>↑ add spin up</button><button className={spin === -1 ? 'spin-active' : ''} onClick={() => setSpin(-1)}>↓ add spin down</button></div></div><div className="orbital-order">{orbitalOrder.map((key) => <div className="orbital-group" key={key}><span className="orbital-label">{key}</span><div>{Array.from({ length: orbitalSlots[key] }, (_, slot) => { const box = electrons[key]?.[slot] ?? []; return <button className="orbital-box" title={`Add electron to ${key}`} key={slot} onClick={() => addElectron(key, slot)}><span>{box.includes(1) ? '↑' : ''}</span><span>{box.includes(-1) ? '↓' : ''}</span></button> })}</div></div>)}</div><div className="filling-order-note"><span>FILLING ORDER</span><b>1s → 2s → 2p → 3s → 3p</b></div><div className="feedback compact right orbital-message"><b><Lightbulb size={15} /> Rule check</b><span>{message}</span></div><button className="primary-button" onClick={check}>Check my atom <Check size={16} /></button><div className="rules-legend"><span><i className="legend-a" />Aufbau</span><span><i className="legend-b" />Hund</span><span><i className="legend-c" />Pauli</span></div></section>
}

function ShapeChallenge({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const molecule = molecules[index % molecules.length]
  const options = ['Linear', 'Bent', 'Trigonal planar', 'Trigonal pyramidal', 'Tetrahedral']
  const choose = (shape: string) => { if (answer !== null) return; setAnswer(shape); if (shape === molecule.shape) { setScore((value) => value + 1); award(12, 'vsepr') } }
  return <section className="practice-card shape-card"><div className="practice-card-top"><span className="section-kicker">MOLECULE VIEWER · {index + 1} OF 5</span><span className="score-chip"><Trophy size={13} /> {score} correct</span></div><div className="molecule-stage"><MoleculeDrawing shape={molecule.shape} /><div className="molecule-name"><b>{molecule.formula}</b><span>{molecule.name}</span><small>{molecule.domains} · {molecule.angle}</small></div></div><h2>What is the molecular shape?</h2><div className="shape-options">{options.map((shape) => <button className={`${answer === shape ? (shape === molecule.shape ? 'correct' : 'incorrect') : ''}${answer && shape === molecule.shape ? ' correct' : ''}`} key={shape} onClick={() => choose(shape)}>{shape}</button>)}</div>{answer && <div className={`feedback compact ${answer === molecule.shape ? 'right' : 'wrong'}`}><b>{answer === molecule.shape ? 'You got it!' : `The shape is ${molecule.shape}.`}</b><span>{molecule.domains} around the central atom. Bond angle ≈ {molecule.angle}.</span></div>}<button className="text-button next-shape" onClick={() => { setIndex((value) => value + 1); setAnswer(null) }}>Next molecule <ChevronRight size={15} /></button></section>
}

function MoleculeDrawing({ shape }: { shape: string }) {
  const placements: Record<string, { x: number; y: number }[]> = {
    Linear: [{ x: 24, y: 50 }, { x: 50, y: 50 }, { x: 76, y: 50 }],
    Bent: [{ x: 30, y: 34 }, { x: 50, y: 52 }, { x: 70, y: 34 }],
    'Trigonal planar': [{ x: 50, y: 50 }, { x: 50, y: 18 }, { x: 22, y: 67 }, { x: 78, y: 67 }],
    'Trigonal pyramidal': [{ x: 50, y: 44 }, { x: 22, y: 69 }, { x: 78, y: 69 }, { x: 50, y: 16 }],
    Tetrahedral: [{ x: 50, y: 48 }, { x: 22, y: 28 }, { x: 78, y: 28 }, { x: 28, y: 75 }, { x: 76, y: 73 }],
  }
  const atoms = placements[shape] ?? placements.Tetrahedral
  const labels: Record<string, string[]> = { Linear: ['C', 'O', 'O'], Bent: ['O', 'H', 'H'], 'Trigonal planar': ['B', 'F', 'F', 'F'], 'Trigonal pyramidal': ['N', 'H', 'H', 'H'], Tetrahedral: ['C', 'H', 'H', 'H', 'H'] }
  return <div className={`molecule-drawing ${shape.toLowerCase().replace(/ /g, '-')}`}><svg viewBox="0 0 100 100" aria-label={`${shape} molecule diagram`}>{atoms.slice(1).map((atom, index) => <line key={index} x1={atoms[0].x} y1={atoms[0].y} x2={atom.x} y2={atom.y} />)}{atoms.map((atom, index) => <g key={index}><circle cx={atom.x} cy={atom.y} r={index === 0 ? 8 : 6} className={index === 0 ? 'center-atom' : 'outer-atom'} /><text x={atom.x} y={atom.y + 1}>{labels[shape]?.[index] ?? 'X'}</text></g>)}</svg></div>
}

function TrendDuel({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const [index, setIndex] = useState(0)
  const [answer, setAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const item = trendComparisons[index % trendComparisons.length]
  const choose = (element: string) => { if (answer) return; setAnswer(element); if (element === item.answer) { setScore((value) => value + 1); award(10, 'trends') } }
  return <section className="practice-card trend-card"><div className="practice-card-top"><span className="section-kicker">PERIODIC TREND DUEL</span><span className="score-chip"><Trophy size={13} /> {score} points</span></div><div className="trend-question"><span className="trend-tag">{item.property.toUpperCase()}</span><h2>{item.prompt}</h2></div><div className="duel-options">{[item.a, item.b].map((element) => <button key={element} className={`${answer === element ? (element === item.answer ? 'correct' : 'incorrect') : ''}${answer && element === item.answer ? ' correct' : ''}`} onClick={() => choose(element)}><span>{element}</span><ChevronRight size={16} /></button>)}</div>{answer && <div className={`feedback compact ${answer === item.answer ? 'right' : 'wrong'}`}><b>{answer === item.answer ? 'Good instinct.' : `${item.answer} is the better answer.`}</b><span>{trendExplanation[item.property]}</span></div>}<button className="primary-button" onClick={() => { setIndex((value) => value + 1); setAnswer(null) }}>Next comparison <ChevronRight size={16} /></button></section>
}

const trendExplanation: Record<string, string> = {
  'Atomic radius': 'Radius decreases across a period; sodium is much farther left than chlorine.',
  'Ionization energy': 'Ionization energy generally decreases down a group; magnesium is above barium.',
  Electronegativity: 'Electronegativity increases up a group; oxygen is above sulfur.',
  'Ionic radius': 'A cation loses electrons and becomes smaller than its parent atom.',
}

function FlashcardPage({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const [deck, setDeck] = useState(() => {
    try {
      const schedule = JSON.parse(localStorage.getItem('chemistry-flashcard-schedule-v1') ?? '{}') as Record<string, number>
      const due = flashcards.filter((item) => (schedule[item.id] ?? 0) <= Date.now())
      const later = flashcards.filter((item) => (schedule[item.id] ?? 0) > Date.now())
      return [...shuffle(due), ...shuffle(later)]
    } catch { return shuffle(flashcards) }
  })
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [rated, setRated] = useState<string[]>([])
  const card = deck[index]
  const next = (rating: 'easy' | 'medium' | 'hard') => {
    const intervals = { hard: 60 * 60 * 1000, medium: 24 * 60 * 60 * 1000, easy: 3 * 24 * 60 * 60 * 1000 }
    try {
      const schedule = JSON.parse(localStorage.getItem('chemistry-flashcard-schedule-v1') ?? '{}') as Record<string, number>
      localStorage.setItem('chemistry-flashcard-schedule-v1', JSON.stringify({ ...schedule, [card.id]: Date.now() + intervals[rating] }))
    } catch {}
    setDeck((currentDeck) => {
      const nextDeck = [...currentDeck]
      const [reviewed] = nextDeck.splice(index, 1)
      const delay = rating === 'hard' ? 1 : rating === 'medium' ? 3 : nextDeck.length
      nextDeck.splice(Math.min(index + delay, nextDeck.length), 0, reviewed)
      return nextDeck
    })
    setRated((current) => [...current, rating])
    award(rating === 'easy' ? 8 : 5)
    setFlipped(false)
    setIndex((current) => current >= deck.length - 1 ? 0 : current)
  }
  return <motion.div className="study-page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><PageHeading eyebrow="RETRIEVAL PRACTICE · SPACED REVIEW" title="Make it stick." intro="Flip, recall, rate. Tough cards come around more often." right={<span className="deck-count"><LayersIcon size={15} /> {index + 1} <i>/</i> {deck.length}</span>} /><div className="flashcard-layout"><div className="flashcard-side"><span className="section-kicker">YOUR DECK</span><h3>Unit 3 + 4 essentials</h3><p>20 cards · due now</p><div className="deck-progress"><span style={{ width: `${(index + 1) / deck.length * 100}%` }} /></div><div className="deck-topics">{topics.slice(0, 6).map((topic) => <span key={topic.id} className="deck-topic"><i className={topic.color} />{topic.short}</span>)}</div><div className="spaced-note"><Clock3 size={15} /><span><b>Spaced repetition</b><small>Rate honestly. Hard cards return sooner.</small></span></div></div><div className="flashcard-workarea"><div className="flashcard-topline"><span className="flashcard-topic">{topics.find((topic) => topic.id === card.topic)?.title.toUpperCase()}</span><span>{rated.length} reviewed today</span></div><button className={`flashcard${flipped ? ' flipped' : ''}`} onClick={() => setFlipped((value) => !value)} aria-label="Flip flashcard"><AnimatePresence mode="wait"><motion.div key={flipped ? 'back' : 'front'} initial={{ opacity: 0, rotateY: flipped ? -10 : 10 }} animate={{ opacity: 1, rotateY: 0 }} exit={{ opacity: 0, rotateY: flipped ? 10 : -10 }} transition={{ duration: 0.2 }}><span className="flashcard-decoration">✳</span><small>{flipped ? 'ANSWER' : 'PROMPT'}</small><b>{flipped ? card.back : card.front}</b><span className="flip-hint">Click to {flipped ? 'see prompt' : 'reveal answer'} <RotateCcw size={13} /></span></motion.div></AnimatePresence></button><div className="card-controls"><button className="icon-button" title="Previous card" onClick={() => { setIndex((value) => (value - 1 + deck.length) % deck.length); setFlipped(false) }}><ChevronLeft size={18} /></button>{flipped ? <div className="rating-buttons"><button className="rate-hard" onClick={() => next('hard')}>Hard</button><button className="rate-medium" onClick={() => next('medium')}>Medium</button><button className="rate-easy" onClick={() => next('easy')}>Easy <Check size={13} /></button></div> : <button className="reveal-button" onClick={() => setFlipped(true)}>Reveal answer <ChevronDown size={15} /></button>}<button className="icon-button" title="Next card" onClick={() => { setIndex((value) => (value + 1) % deck.length); setFlipped(false) }}><ChevronRight size={18} /></button></div></div></div></motion.div>
}

function ExamPage({ award }: { award: (xp: number, topic?: TopicId) => void }) {
  const [started, setStarted] = useState(false)
  const [timed, setTimed] = useState(true)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [current, setCurrent] = useState(0)
  const [finished, setFinished] = useState(false)
  const [seconds, setSeconds] = useState(45 * 60)
  const [reviewOnly, setReviewOnly] = useState(false)
  useEffect(() => { if (!started || finished || !timed) return; const timer = window.setInterval(() => setSeconds((value) => { if (value <= 1) { window.clearInterval(timer); setFinished(true); return 0 } return value - 1 }), 1000); return () => window.clearInterval(timer) }, [started, finished, timed])
  const start = () => { const selected = shuffle(questionBank).slice(0, 50); setQuestions(selected); setAnswers({}); setCurrent(0); setSeconds(45 * 60); setFinished(false); setReviewOnly(false); setStarted(true) }
  const score = questions.reduce((sum, question) => sum + (answers[question.id] === question.answer ? 1 : 0), 0)
  const missed = questions.filter((question) => answers[question.id] !== question.answer)
  const displayQuestions = reviewOnly ? missed : questions
  const activeQuestion = displayQuestions[current]
  const submit = () => { setFinished(true); const correctCount = score; for (let count = 0; count < Math.min(correctCount, 10); count++) award(10) }
  const formatTime = (value: number) => `${Math.floor(value / 60).toString().padStart(2, '0')}:${(value % 60).toString().padStart(2, '0')}`
  if (!started) return <motion.div className="study-page" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><PageHeading eyebrow="SIMULATE THE EXAM · 100-QUESTION BANK" title="Put it all together." intro="A 50-question mixed review across every Unit 3 & 4 topic." /><div className="exam-intro-grid"><section className="exam-intro"><span className="exam-stamp"><GraduationCap size={22} /> HONORS CHEMISTRY</span><h2>The practice exam</h2><p>Fifty randomized questions. Instant score and a clear review of anything you want to revisit.</p><div className="exam-facts"><span><CircleHelp size={15} /> 50 questions</span><span><Clock3 size={15} /> 45 minutes</span><span><Dices size={15} /> Shuffled every time</span></div><label className="toggle-row"><span><b>Timed mode</b><small>45 minutes on the clock</small></span><button role="switch" aria-checked={timed} className={`toggle-switch${timed ? ' on' : ''}`} onClick={() => setTimed((value) => !value)}><i /></button></label><button className="primary-button exam-start" onClick={start}>Start the exam <ChevronRight size={17} /></button></section><aside className="exam-side"><div className="exam-side-graphic"><span className="exam-ring r1" /><span className="exam-ring r2" /><span className="exam-center"><Atom size={31} /></span><span className="exam-orbit-label label-a">9 TOPICS</span><span className="exam-orbit-label label-b">50 Qs</span></div><div className="exam-side-foot"><b>Everything you’ve studied,</b><span>all in one place.</span></div><div className="exam-bank-row"><span><BookOpen size={15} /> Final exam review bank</span><b>100 questions</b></div></aside></div></motion.div>
  if (finished) return <motion.div className="study-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><PageHeading eyebrow="EXAM COMPLETE" title={score >= 35 ? 'Look at you go.' : 'Good work showing up.'} intro="Your score is only the start. Use your misses to steer the next study session." /><section className="result-card"><div className="result-score"><span>YOUR SCORE</span><b>{score}<i>/50</i></b><div className="result-ring" style={{ '--score': `${score / 50 * 100}%` } as React.CSSProperties}><Trophy size={24} /></div></div><div className="result-details"><div className="result-stat"><b>{Math.round(score / 50 * 100)}%</b><span>overall score</span></div><div className="result-stat"><b>{missed.length}</b><span>to review</span></div><div className="result-stat"><b>{formatTime(45 * 60 - seconds)}</b><span>time elapsed</span></div><div className="result-actions"><button disabled={missed.length === 0} className="primary-button" onClick={() => { setReviewOnly(true); setCurrent(0); setFinished(false) }}>Review missed questions <ChevronRight size={16} /></button><button className="text-button" onClick={() => setStarted(false)}>Back to exam setup</button></div></div></section>{reviewOnly && missed.length > 0 && <section className="missed-review"><h2>Missed question review</h2>{missed.map((question) => <div key={question.id}><b>{question.prompt}</b><p>Your answer: {question.options[answers[question.id]] ?? 'No answer'} · Correct: {question.options[question.answer]}</p><small>{question.explanation}</small></div>)}</section>}</motion.div>
  return <motion.div className="study-page exam-taking" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div className="exam-progress-head"><div><span className="section-kicker">MOCK EXAM · MIXED REVIEW</span><h1>Question <em>{current + 1}</em> <span>/ {displayQuestions.length}</span></h1></div><div className={`timer-chip${seconds < 300 ? ' urgent' : ''}`}><Clock3 size={16} />{timed ? formatTime(seconds) : 'No timer'}</div></div><div className="exam-progress"><span style={{ width: `${(current + 1) / displayQuestions.length * 100}%` }} /></div><section className="exam-question-card"><div className="practice-card-top"><span className={`question-topic ${topics.find((topic) => topic.id === activeQuestion.topic)?.color}`}>{topics.find((topic) => topic.id === activeQuestion.topic)?.short}</span><span>{Object.keys(answers).length} answered</span></div><h2>{activeQuestion.prompt}</h2><div className="answer-list">{activeQuestion.options.map((option, index) => <button key={option} className={`answer-option${answers[activeQuestion.id] === index ? ' picked' : ''}`} onClick={() => setAnswers((currentAnswers) => ({ ...currentAnswers, [activeQuestion.id]: index }))}><span className="answer-letter">{String.fromCharCode(65 + index)}</span>{option}</button>)}</div></section><div className="exam-bottom"><div className="exam-question-nav">{displayQuestions.slice(Math.max(0, current - 2), current + 8).map((question) => <button key={question.id} className={`${displayQuestions.indexOf(question) === current ? 'current' : ''}${answers[question.id] !== undefined ? ' answered' : ''}`} onClick={() => setCurrent(displayQuestions.indexOf(question))}>{displayQuestions.indexOf(question) + 1}</button>)}</div><div className="exam-controls"><button className="secondary-button" onClick={() => setCurrent((value) => Math.max(0, value - 1))}><ChevronLeft size={15} /> Previous</button>{current < displayQuestions.length - 1 ? <button className="primary-button" onClick={() => setCurrent((value) => value + 1)}>Next question <ChevronRight size={15} /></button> : <button className="primary-button" onClick={submit}>Finish exam <Check size={15} /></button>}</div></div></motion.div>
}

export default App

function SearchPalette({ close }: { close: () => void }) {
  const [value, setValue] = useState('')
  const filtered = topics.filter((topic) => `${topic.title} ${topic.summary}`.toLowerCase().includes(value.toLowerCase()))
  useEffect(() => { const handleKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close() }; window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey) }, [close])
  return <motion.div className="search-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) close() }}><motion.div className="search-dialog" initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }}><div className="search-input-row"><Search size={18} /><input autoFocus value={value} onChange={(event) => setValue(event.target.value)} placeholder="Search topics, concepts, lessons..." /><kbd>ESC</kbd></div><span className="search-label">TOPICS</span><div className="search-results">{filtered.map((topic) => <Link onClick={close} to={`/learn?topic=${topic.id}`} key={topic.id}><span className={`topic-icon ${topic.color}`}>{topic.icon}</span><span><b>{topic.title}</b><small>{topic.summary}</small></span><ChevronRight size={15} /></Link>)}{filtered.length === 0 && <p>No topics match “{value}”. Try a different search.</p>}</div><div className="search-hint"><span><kbd>↵</kbd> Open lesson</span><span><kbd>ESC</kbd> Close</span></div></motion.div></motion.div>
}
