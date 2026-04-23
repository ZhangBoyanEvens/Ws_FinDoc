import { useId, useState } from 'react'
import './FinDocDashboard.css'

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const HIGHLIGHT_INDEX = 2 // Tuesday (second T in week display — design uses third slot as Tue in S M T W T F S)

const PROJECTS = [
  {
    id: 'web-dev',
    title: 'Web Development Project',
    paid: true,
    rate: '$10/hour',
    tags: ['Remote', 'Part-time'],
    description:
      'Build and maintain responsive web applications using modern frameworks, collaborate with design and QA teams, and deliver features on schedule.',
    meta: 'Germany · 2h ago',
    logo: 'wd',
    logoClass: 'finDocDash-projectLogo--warm',
  },
  {
    id: 'copyright',
    title: 'Copyright Project',
    paid: false,
    rate: '',
    tags: [],
    description: '',
    meta: 'Remote · 1d ago',
    logo: '©',
    logoClass: 'finDocDash-projectLogo--dark',
  },
  {
    id: 'web-design',
    title: 'Web Design Project',
    paid: true,
    rate: '',
    tags: [],
    description: '',
    meta: 'UK · 3d ago',
    logo: 'wd',
    logoClass: 'finDocDash-projectLogo--blue',
  },
]

const CONNECT_ROWS = [
  {
    name: 'Randy Gouse',
    tag: 'Senior',
    tagClass: 'finDocDash-connectTag--senior',
    role: 'Cybersecurity specialist',
    initials: 'RG',
  },
  {
    name: 'Mia Collins',
    tag: 'Middle',
    tagClass: 'finDocDash-connectTag--middle',
    role: 'Product designer',
    initials: 'MC',
  },
]

export function FinDocDashboard() {
  const weekMenuId = useId()
  const [weekOpen, setWeekOpen] = useState(false)

  return (
    <div className="finDocDash">
      <div className="finDocDash__grid">
        {/* Income Tracker */}
        <section className="finDocDash-card finDocDash-card--income" aria-labelledby="finDocDash-income-title">
          <div className="finDocDash-cardHead">
            <div className="finDocDash-cardHeadLeft">
              <span className="finDocDash-iconFile" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </span>
              <h2 id="finDocDash-income-title" className="finDocDash-cardTitle">
                Income Tracker
              </h2>
            </div>
            <div className="finDocDash-dropdown">
              <button
                type="button"
                className="finDocDash-dropdownBtn"
                aria-expanded={weekOpen}
                aria-controls={weekMenuId}
                onClick={() => setWeekOpen((v) => !v)}
              >
                Week
                <span className="finDocDash-dropdownChev" aria-hidden="true">
                  ▾
                </span>
              </button>
              {weekOpen ? (
                <ul id={weekMenuId} className="finDocDash-dropdownMenu" role="menu">
                  <li>
                    <button type="button" role="menuitem">
                      Week
                    </button>
                  </li>
                  <li>
                    <button type="button" role="menuitem">
                      Month
                    </button>
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
          <p className="finDocDash-cardDesc">
            Track changes in income over time and access detailed data on each project and payments received
          </p>
          <div className="finDocDash-incomeBody">
            <div className="finDocDash-incomeStat">
              <div className="finDocDash-incomePct">+20%</div>
              <p className="finDocDash-incomeCaption">
                This week&apos;s income is higher than last week&apos;s
              </p>
            </div>
            <div className="finDocDash-chart" aria-hidden="true">
              <div className="finDocDash-chartBars">
                {DAYS.map((d, i) => {
                  const active = i === HIGHLIGHT_INDEX
                  return (
                    <div key={`${d}-${i}`} className={`finDocDash-chartCol ${active ? 'finDocDash-chartCol--active' : ''}`}>
                      {active ? (
                        <>
                          <span className="finDocDash-chartTooltip">$2,567</span>
                          <span className="finDocDash-chartPillar" />
                        </>
                      ) : null}
                      <span className="finDocDash-chartLine" />
                      <span className="finDocDash-chartDot" />
                      <span className="finDocDash-chartDay">{d}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Recent Projects */}
        <section className="finDocDash-card finDocDash-card--projects" aria-labelledby="finDocDash-projects-title">
          <div className="finDocDash-cardHead finDocDash-cardHead--between">
            <h2 id="finDocDash-projects-title" className="finDocDash-cardTitle">
              Your Recent Projects
            </h2>
            <a href="#" className="finDocDash-linkAll">
              See all Project
            </a>
          </div>
          <ul className="finDocDash-projectList">
            {PROJECTS.map((p) => (
              <li key={p.id} className="finDocDash-projectItem finDocDash-projectItem--list">
                <div className="finDocDash-projectRow">
                  <span className={`finDocDash-projectLogo ${p.logoClass}`}>{p.logo}</span>
                  <div className="finDocDash-projectMain">
                    <div className="finDocDash-projectTitleRow">
                      <span className="finDocDash-projectTitle">{p.title}</span>
                      <span className={`finDocDash-paid ${p.paid ? 'finDocDash-paid--yes' : 'finDocDash-paid--no'}`}>
                        {p.paid ? 'Paid' : 'Not Paid'}
                      </span>
                    </div>
                    <div className="finDocDash-projectMetaLine">
                      {p.rate ? <span className="finDocDash-projectRate">{p.rate}</span> : null}
                      <span className="finDocDash-projectMeta">{p.meta}</span>
                    </div>
                  </div>
                  <span className="finDocDash-projectChev" aria-hidden="true">
                    ▾
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Let's Connect */}
        <section className="finDocDash-card finDocDash-card--connect" aria-labelledby="finDocDash-connect-title">
          <div className="finDocDash-cardHead finDocDash-cardHead--between">
            <h2 id="finDocDash-connect-title" className="finDocDash-cardTitle">
              Let&apos;s Connect
            </h2>
            <a href="#" className="finDocDash-linkAll">
              See all
            </a>
          </div>
          <ul className="finDocDash-connectList">
            {CONNECT_ROWS.map((row) => (
              <li key={row.name} className="finDocDash-connectRow">
                <div className="finDocDash-avatar" aria-hidden="true">
                  {row.initials}
                </div>
                <div className="finDocDash-connectInfo">
                  <div className="finDocDash-connectNameRow">
                    <span className="finDocDash-connectName">{row.name}</span>
                    <span className={`finDocDash-connectTag ${row.tagClass}`}>{row.tag}</span>
                  </div>
                  <div className="finDocDash-connectRole">{row.role}</div>
                </div>
                <button type="button" className="finDocDash-connectAdd" aria-label={`Connect with ${row.name}`}>
                  +
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Unlock Premium */}
        <section className="finDocDash-card finDocDash-card--premium" aria-labelledby="finDocDash-premium-title">
          <div className="finDocDash-premiumInner">
            <h2 id="finDocDash-premium-title" className="finDocDash-premiumTitle">
              Unlock Premium Features
            </h2>
            <p className="finDocDash-premiumDesc">
              Gain exclusive benefits, advanced analytics, and priority support tailored to your workflow.
            </p>
            <button type="button" className="finDocDash-premiumBtn">
              Upgrade now
              <span aria-hidden="true" className="finDocDash-premiumBtnIcon">
                →
              </span>
            </button>
          </div>
        </section>

        {/* Proposal Progress */}
        <section className="finDocDash-card finDocDash-card--proposal" aria-labelledby="finDocDash-proposal-title">
          <div className="finDocDash-cardHead finDocDash-cardHead--between">
            <h2 id="finDocDash-proposal-title" className="finDocDash-cardTitle">
              Proposal Progress
            </h2>
            <button type="button" className="finDocDash-dateBtn">
              April 11, 2024
              <span aria-hidden="true">▾</span>
            </button>
          </div>
          <div className="finDocDash-proposalStats">
            <div className="finDocDash-stat">
              <div className="finDocDash-statLabel">Proposals sent</div>
              <div className="finDocDash-statNum">64</div>
              <svg className="finDocDash-miniBars finDocDash-miniBars--grey" viewBox="0 0 80 28" preserveAspectRatio="none" aria-hidden="true">
                <rect x="4" y="18" width="6" height="8" rx="1" fill="currentColor" />
                <rect x="14" y="12" width="6" height="14" rx="1" fill="currentColor" />
                <rect x="24" y="16" width="6" height="10" rx="1" fill="currentColor" />
                <rect x="34" y="8" width="6" height="18" rx="1" fill="currentColor" />
                <rect x="44" y="14" width="6" height="12" rx="1" fill="currentColor" />
                <rect x="54" y="10" width="6" height="16" rx="1" fill="currentColor" />
                <rect x="64" y="6" width="6" height="20" rx="1" fill="currentColor" />
              </svg>
            </div>
            <div className="finDocDash-stat">
              <div className="finDocDash-statLabel">Interviews</div>
              <div className="finDocDash-statNum finDocDash-statNum--orange">12</div>
              <svg className="finDocDash-miniBars finDocDash-miniBars--orange" viewBox="0 0 80 28" preserveAspectRatio="none" aria-hidden="true">
                <rect x="4" y="14" width="6" height="12" rx="1" fill="currentColor" />
                <rect x="14" y="8" width="6" height="18" rx="1" fill="currentColor" />
                <rect x="24" y="12" width="6" height="14" rx="1" fill="currentColor" />
                <rect x="34" y="6" width="6" height="20" rx="1" fill="currentColor" />
                <rect x="44" y="10" width="6" height="16" rx="1" fill="currentColor" />
                <rect x="54" y="4" width="6" height="22" rx="1" fill="currentColor" />
                <rect x="64" y="16" width="6" height="10" rx="1" fill="currentColor" />
              </svg>
            </div>
            <div className="finDocDash-stat">
              <div className="finDocDash-statLabel">Hires</div>
              <div className="finDocDash-statNum finDocDash-statNum--dark">10</div>
              <svg className="finDocDash-miniBars finDocDash-miniBars--dark" viewBox="0 0 80 28" preserveAspectRatio="none" aria-hidden="true">
                <rect x="4" y="10" width="6" height="16" rx="1" fill="currentColor" />
                <rect x="14" y="6" width="6" height="20" rx="1" fill="currentColor" />
                <rect x="24" y="12" width="6" height="14" rx="1" fill="currentColor" />
                <rect x="34" y="4" width="6" height="22" rx="1" fill="currentColor" />
                <rect x="44" y="8" width="6" height="18" rx="1" fill="currentColor" />
                <rect x="54" y="14" width="6" height="12" rx="1" fill="currentColor" />
                <rect x="64" y="8" width="6" height="18" rx="1" fill="currentColor" />
              </svg>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
