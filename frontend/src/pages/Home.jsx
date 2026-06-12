import {useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,Download,ExternalLink,Code2,Server,Database,Cloud} from 'lucide-react';
import api from '../utils/api';
import './Home.css';


const SKILLS={
  Frontend:['React','JavaScript','TypeScript','HTML5','CSS3','Tailwind','Framer Motion'],
  Backend:['Flask','Python','Node.js','Express','REST APIs'],
  Database:['PostgreSQL','MySQL','MongoDB','Redis'],
  'Cloud & DevOps':['AWS','Google Cloud','Docker','Git','CI/CD'],
  Payments:['M-Pesa Daraja','Stripe','PayPal'],
};
const SKILL_ICONS={Frontend:<Code2 size={18}/>,Backend:<Server size={18}/>,Database:<Database size={18}/>,'Cloud & DevOps':<Cloud size={18}/>,Payments:<span>💳</span>};

const FEATURED_PROJECTS = [
  {
    id: 1,
    title: 'Nyabera Secondary School',
    category: 'Education',
    description: 'A full-featured school management web platform for Nyabera Secondary School, handling student records, timetables, announcements, and staff administration.',
    image_url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
    technologies: ['React', 'Flask', 'PostgreSQL', 'Tailwind'],
    demo_url: null,
    slug: 'nyabera-secondary-school',
  },
  {
    id: 2,
    title: 'Davis Restaurant',
    category: 'Hospitality',
    description: 'A modern restaurant website for Davis Restaurant featuring an online menu, table reservations, M-Pesa payment integration, and an admin dashboard for order management.',
    image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    technologies: ['React', 'Node.js', 'MongoDB', 'M-Pesa Daraja'],
    demo_url: null,
    slug: 'davis-restaurant',
  },
  {
    id: 3,
    title: "Danis Choice",
    category: 'E-Commerce',
    description: "An elegant e-commerce platform for Danis Choice, a ladies' fashion store selling clothes, shoes, and bags — complete with product listings, a shopping cart, and M-Pesa checkout.",
    image_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    technologies: ['React', 'Flask', 'PostgreSQL', 'Stripe'],
    demo_url: null,
    slug: 'danis-choice',
  },
  {
    id: 4,
    title: 'Mkopo',
    category: 'Fintech',
    description: 'A loan management platform for Mkopo, an institution offering personal and business loans — featuring loan applications, repayment tracking, and M-Pesa disbursement integration.',
    image_url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    technologies: ['React', 'Flask', 'PostgreSQL', 'M-Pesa Daraja'],
    demo_url: null,
    slug: 'mkopo',
  },
];

export default function Home(){
  const [testimonials,setTestimonials]=useState([]);const [stats,setStats]=useState(null);
  useEffect(()=>{
    api.get('/portfolio/testimonials').then(r=>setTestimonials(r.data.data)).catch(()=>{});
    api.get('/portfolio/stats').then(r=>setStats(r.data.data)).catch(()=>{});
  },[]);

  return(
    <div className="home-page">
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-bg"><div className="hero-orb orb1"/><div className="hero-orb orb2"/><div className="hero-grid"/></div>
        <div className="container hero-content">
          <div className="hero-left">
            <div className="hero-badge"><span className="badge-dot"/>Available for work</div>
            <h1>Hi, I'm<br/><span className="gradient-text">David Wege</span></h1>
            <div className="hero-title">Full Stack Developer</div>
            <p className="hero-desc">I build production-ready web applications with <strong>React</strong>, <strong>Flask</strong>, and <strong>PostgreSQL</strong>. Specializing in M-Pesa integrations and scalable backend architecture.</p>
            <div className="hero-loc">📍 Nairobi, Kenya · Remote Available</div>
            <div className="hero-actions">
              <Link to="/projects" className="btn btn-primary">View Projects <ArrowRight size={16}/></Link>
              <Link to="/resume" className="btn btn-outline">Download Resume <Download size={16}/></Link>
              <Link to="/contact" className="btn btn-outline">Contact Me </Link>
            </div>
            
          </div>
          <div className="hero-right">
            <div className="hero-avatar-wrap">
              <div className="hero-avatar">
                <img src="/Myimage.jpeg" alt="David Wege"/>
              </div>
              <div className="avatar-ring"/>
              <div className="avatar-float card1"><Code2 size={16}/> React Dev</div>
              <div className="avatar-float card2">🇰🇪 Nairobi</div>
              <div className="avatar-float card3">⚡ Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats&&(
        <section className="stats-section">
          <div className="container">
            <div className="stats-row">
              {[['Projects Built',stats.projects+'+'],['Clients Served',stats.clients+'+'],['Years Experience',stats.years_experience+'+'],['Coffee Cups',stats.coffee_cups+'+']].map(([l,v])=>(
                <div key={l} className="stat-box"><div className="stat-val gradient-text">{v}</div><div className="stat-label">{l}</div></div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Skills */}
      <section className="section skills-section">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:56}}>
            <span className="section-tag">Technical Skills</span>
            <h2 className="section-title">What I Work With</h2>
            <p className="section-sub" style={{margin:'0 auto'}}>Technologies I use to build fast, scalable, and beautiful applications.</p>
          </div>
          <div className="skills-grid">
            {Object.entries(SKILLS).map(([cat,skills])=>(
              <div key={cat} className="skill-card card">
                <div className="skill-cat-header">
                  <div className="skill-icon">{SKILL_ICONS[cat]||<Code2 size={18}/>}</div>
                  <h3>{cat}</h3>
                </div>
                <div className="skill-tags">
                  {skills.map(s=><span key={s} className="skill-tag">{s}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="section projects-section">
        <div className="container">
          <div className="section-header-row">
            <div><span className="section-tag">Portfolio</span><h2 className="section-title">Featured Projects</h2></div>
            <Link to="/projects" className="btn btn-outline btn-sm">All Projects <ArrowRight size={14}/></Link>
          </div>
          <div className="projects-grid">
            {FEATURED_PROJECTS.map(p=>(
              <div key={p.id} className="project-card card">
                <div className="proj-img-wrap">
                  {p.image_url
                    ? <img src={p.image_url} alt={p.title} className="proj-img"/>
                    : <div className="proj-img-placeholder"><Code2 size={32}/></div>
                  }
                  <div className="proj-overlay">
                    {p.demo_url&&<a href={p.demo_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary"><ExternalLink size={14}/>Demo</a>}
                  </div>
                </div>
                <div className="proj-body">
                  <div className="proj-cat">{p.category}</div>
                  <h3 className="proj-title">{p.title}</h3>
                  <p className="proj-desc">{p.description?.slice(0,120)}…</p>
                  <div className="proj-techs">
                    {(p.technologies||[]).slice(0,4).map(t=><span key={t} className="badge">{t}</span>)}
                  </div>
                  <Link to={`/projects/${p.slug}`} className="proj-link">View Case Study <ArrowRight size={14}/></Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length>0&&(
        <section className="section testimonials-section">
          <div className="container">
            <div style={{textAlign:'center',marginBottom:56}}>
              <span className="section-tag">Testimonials</span>
              <h2 className="section-title">What Clients Say</h2>
            </div>
            <div className="testimonials-grid">
              {testimonials.map(t=>(
                <div key={t.id} className="testimonial-card card">
                  <div className="stars">{'★'.repeat(t.rating)}</div>
                  <p className="testimonial-text">"{t.content}"</p>
                  <div className="testimonial-author">
                    <div className="author-avatar">{t.name[0]}</div>
                    <div><div className="author-name">{t.name}</div><div className="author-role">{t.role} · {t.company}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-orb"/>
          <span className="section-tag">Let's Work Together</span>
          <h2>Ready to Build Something<br/><span className="gradient-text">Amazing?</span></h2>
          <p>I'm available for freelance projects and full-time roles. Let's discuss how I can help bring your vision to life.</p>
        </div>
      </section>
    </div>
  );
}