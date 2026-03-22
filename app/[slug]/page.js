import { notFound } from 'next/navigation';

const pageContent = {
  login: {
    badge: 'Secure access',
    title: 'Platformaga xavfsiz kirish',
    text: 'Yangi dizayndagi kirish sahifasi foydalanuvchini tez, aniq va ishonchli oqim bilan kutib oladi.',
    action: 'Kirish',
    accent: 'Elektron identifikatsiya, 2 bosqichli xavfsizlik va premium auth tajriba.',
  },
  signup: {
    badge: 'Fast onboarding',
    title: 'Yangi foydalanuvchi oqimini kuchaytiring',
    text: 'Ro‘yxatdan o‘tish interfeysi qisqa qadamlar, progress hisi va motivatsion CTA bilan qayta ishlangan.',
    action: 'Hisob yaratish',
    accent: 'Minimal friction, yuqori konversiya va intuitiv onboarding bloklari.',
  },
  register: {
    badge: 'Conversion first',
    title: 'Premium registration experience',
    text: 'Bu sahifa mahsulotga kirishni emotsional darajada kuchaytiradigan chuqur gradient va motion bilan qurildi.',
    action: 'Davom etish',
    accent: 'Highlight kartalar, floating glass panel va action-focused layout.',
  },
  admin: {
    badge: 'Command center',
    title: 'Boshqaruv paneli endi haqiqiy dashboard hissini beradi',
    text: 'Admin uchun KPI kartalar, activity stream va dark glass layout bilan korporativ boshqaruv muhiti yaratildi.',
    action: 'Panelga o‘tish',
    accent: 'Decision-maker uchun kuchli vizual ierarxiya va data-first ko‘rinish.',
  },
  profile: {
    badge: 'Personal space',
    title: 'Shaxsiy kabinet soddalik va premium uslubda',
    text: 'Profil sahifasi murojaatlar tarixini, foydalanuvchi reytingini va shaxsiy progressni zamonaviy ko‘rsatadi.',
    action: 'Profilni boshqarish',
    accent: 'User-centric bloklar, trust signal va yumshoq mikroanimatsiyalar.',
  },
};

export function generateStaticParams() {
  return Object.keys(pageContent).map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const page = pageContent[params.slug];
  if (!page) return {};

  return {
    title: `Nigoh | ${page.title}`,
    description: page.text,
  };
}

export default function DetailPage({ params }) {
  const page = pageContent[params.slug];

  if (!page) {
    notFound();
  }

  return (
    <main className="page-shell inner-shell">
      <div className="animated-grid" />
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />

      <section className="inner-hero glass-panel reveal-up">
        <div className="inner-copy">
          <span className="hero-chip">{page.badge}</span>
          <h1>{page.title}</h1>
          <p>{page.text}</p>
          <div className="hero-actions">
            <a href="/" className="secondary-btn">
              Bosh sahifa
            </a>
            <a href="#details" className="primary-btn">
              {page.action}
            </a>
          </div>
        </div>

        <div className="inner-visual">
          <div className="showcase-card glass-panel float-card">
            <span className="eyebrow">Interface quality</span>
            <h2>{page.accent}</h2>
            <div className="showcase-stack">
              <div className="stack-line stack-line-a" />
              <div className="stack-line stack-line-b" />
              <div className="stack-line stack-line-c" />
            </div>
          </div>
        </div>
      </section>

      <section className="inner-grid" id="details">
        <article className="info-card glass-panel">
          <span className="eyebrow">Why it feels better</span>
          <h3>Vizual qatlamlar va premium kontrast</h3>
          <p>
            Shakl, rang va spacing qayta balanslandi. Natijada foydalanuvchi ko‘zi muhim CTA va data nuqtalariga tabiiy yo‘naltiriladi.
          </p>
        </article>
        <article className="info-card glass-panel">
          <span className="eyebrow">Motion system</span>
          <h3>Silliq va chalg‘itmaydigan animatsiyalar</h3>
          <p>
            Hover, glow, gradient drift va reveal effektlari sahifani jonlantiradi, lekin foydalanish tezligini pasaytirmaydi.
          </p>
        </article>
        <article className="info-card glass-panel">
          <span className="eyebrow">Next step</span>
          <h3>Bu sahifani keyin real forma yoki dashboard logikasi bilan to‘ldirish mumkin</h3>
          <p>
            Hozirgi versiya dizayn va tajribani kuchaytirishga qaratilgan bo‘lib, keyingi bosqichda backend funksiyalar bilan to‘ldirishga tayyor.
          </p>
        </article>
      </section>
    </main>
  );
}
