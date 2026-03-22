const metrics = [
  { value: '24/7', label: 'Onlayn kuzatuv', detail: 'Murojaatlar real vaqt rejimida navbatlanadi va tasdiqlanadi.' },
  { value: '98%', label: 'Shaffoflik darajasi', detail: 'Har bir bosqich audit log va status tarixi bilan birga ko‘rinadi.' },
  { value: '12+', label: 'Hududiy panel', detail: 'Viloyatlar bo‘yicha analitik ko‘rsatkichlar bitta joyda jamlangan.' },
];

const features = [
  {
    title: 'Smart monitoring',
    text: 'Sun’iy intellekt yordamida takroriy murojaatlar, xavf darajasi va ustuvor yo‘nalishlar avtomatik ajratiladi.',
  },
  {
    title: 'Citizen journey',
    text: 'Foydalanuvchi murojaat yuborishdan tortib yakuniy javobgacha bo‘lgan butun jarayonni bitta interfeysda ko‘radi.',
  },
  {
    title: 'Executive analytics',
    text: 'Rahbariyat uchun KPI, trend va tezkor hisobot kartalari animatsion ko‘rinishda taqdim etiladi.',
  },
];

const workflow = [
  'Murojaat yuboriladi va geolokatsiya bilan birga tizimga tushadi.',
  'Tizim muammo turini avtomatik kategoriyalab, mas’ul bo‘limga yo‘naltiradi.',
  'Ijro jarayoni, media fayllar va izohlar timeline formatida yangilanadi.',
  'Foydalanuvchi yakuniy natija va xizmat sifati bo‘yicha baho qoldiradi.',
];

export const metadata = {
  title: 'Nigoh | Next.js platformasi',
  description: 'Nigoh uchun qayta ishlangan premium Next.js landing page.',
};

export default function HomePage() {
  return (
    <main className="page-shell landing-shell">
      <section className="hero-section section-frame">
        <div className="animated-grid" />
        <div className="aurora aurora-one" />
        <div className="aurora aurora-two" />

        <header className="topbar glass-panel">
          <div className="brand-mark">
            <span className="brand-dot" />
            <div>
              <p className="eyebrow">Nigoh platform</p>
              <h1>Nigoh</h1>
            </div>
          </div>

          <nav className="nav-links">
            <a href="#imkoniyatlar">Imkoniyatlar</a>
            <a href="#jarayon">Jarayon</a>
            <a href="#dashboard">Dashboard</a>
            <a href="/login" className="nav-cta">
              Kirish
            </a>
          </nav>
        </header>

        <div className="hero-layout">
          <div className="hero-copy reveal-up">
            <span className="hero-chip">Next.js asosida qayta yaratilgan premium tajriba</span>
            <h2>
              Jamoatchilik nazoratini <span>zamonaviy</span>, animatsion va ishonchli mahsulotga aylantiring.
            </h2>
            <p>
              Nigoh endi oddiy HTML maket emas. Ushbu versiya shaffoflik platformasini professional product landing,
              kuchli vizual ritm va premium motion design bilan taqdim etadi.
            </p>

            <div className="hero-actions">
              <a className="primary-btn" href="/register">
                Boshlash
              </a>
              <a className="secondary-btn" href="#dashboard">
                Demo ko‘rish
              </a>
            </div>

            <div className="metric-row">
              {metrics.map((item) => (
                <article key={item.label} className="metric-card glass-panel float-card">
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-visual reveal-scale" id="dashboard">
            <div className="command-center glass-panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Live command center</p>
                  <h3>Milliy monitoring dashboard</h3>
                </div>
                <span className="status-pill">● Active stream</span>
              </div>

              <div className="dashboard-preview">
                <div className="preview-sidebar">
                  <span className="sidebar-pill active">Overview</span>
                  <span className="sidebar-pill">Alerts</span>
                  <span className="sidebar-pill">Regions</span>
                  <span className="sidebar-pill">Reports</span>
                </div>

                <div className="preview-content">
                  <div className="preview-chart">
                    <div className="chart-line chart-line-one" />
                    <div className="chart-line chart-line-two" />
                    <div className="chart-glow" />
                  </div>

                  <div className="preview-cards">
                    <div className="mini-card pulse-card">
                      <span>Tezkor hal bo‘ldi</span>
                      <strong>1,284</strong>
                    </div>
                    <div className="mini-card delay-card">
                      <span>Yangi murojaatlar</span>
                      <strong>342</strong>
                    </div>
                    <div className="mini-card success-card">
                      <span>Ishonch reytingi</span>
                      <strong>4.9/5</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section" id="imkoniyatlar">
        <div className="section-heading reveal-up">
          <span className="eyebrow">Platform architecture</span>
          <h2>Kuchli product dizayn va tabiiy animatsiya uyg‘unligi</h2>
          <p>
            Har bir blok kontrast, depth, micro-interaction va ma’lumot yetkazish samaradorligi asosida qayta tuzildi.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <article key={feature.title} className={`feature-card glass-panel feature-${index + 1}`}>
              <div className="feature-icon">0{index + 1}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section split-section" id="jarayon">
        <div className="workflow-panel glass-panel reveal-up">
          <span className="eyebrow">Journey map</span>
          <h2>Foydalanuvchi yo‘li silliq, tushunarli va ishonch uyg‘otuvchi</h2>
          <div className="timeline-list">
            {workflow.map((step, index) => (
              <div key={step} className="timeline-item">
                <span>{index + 1}</span>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="spotlight-panel reveal-scale">
          <div className="spotlight-card glass-panel tilt-card">
            <span className="eyebrow">Immersive UI</span>
            <h3>Depth, glow va premium motion</h3>
            <p>
              Gradient yoritish, floating layers va response hover effektlari sahifaga yuqori darajali product hissini beradi.
            </p>
          </div>
          <div className="spotlight-orb" />
        </div>
      </section>

      <section className="cta-section content-section">
        <div className="cta-card glass-panel reveal-up">
          <div>
            <span className="eyebrow">Ready for launch</span>
            <h2>Endi bu loyiha haqiqiy startup darajasidagi ko‘rinishga ega.</h2>
          </div>
          <div className="hero-actions">
            <a className="primary-btn" href="/signup">
              Ro‘yxatdan o‘tish
            </a>
            <a className="secondary-btn" href="/profile">
              Kabinetni ko‘rish
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
