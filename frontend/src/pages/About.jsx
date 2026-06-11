import {useState,useEffect} from 'react';
import {MapPin,Calendar,Award,Code2} from 'lucide-react';
import api from '../utils/api';
import './About.css';

const TIMELINE=[
  {year:'2025',title:'AI Portfolio Launch',desc:'Built and launched this portfolio with integrated AI chatbot'},
  {year:'2024',title:'Nyabera Secondary School','desc':'Built full school management system for 2,400+ students'},
  {year:'2023',title:'AWS Certification','desc':'Earned AWS Certified Developer – Associate certification'},
  {year:'2022',title:'Started Freelancing','desc':'Launched freelance career, building production apps for East African clients'},
  {year:'2021',title:'First Flask API','desc':'Built first production REST API powering a mobile app with 10k+ users'},
  {year:'2020',title:'Started Coding','desc':'Discovered programming through Python. Built first web app in 3 months'},
];

export default function About(){
  const [experience,setExperience]=useState([]);const [certs,setCerts]=useState([]);
  useEffect(()=>{
    api.get('/portfolio/experience').then(r=>setExperience(r.data.data)).catch(()=>{});
    api.get('/portfolio/certifications').then(r=>setCerts(r.data.data)).catch(()=>{});
  },[]);

  return(
    <div className="about-page" style={{paddingTop:68}}>
      <section className="about-hero">
        <div className="container about-hero-grid">
          <div>
            <span className="section-tag">About Me</span>
            <h1 style={{color:'var(--text)',margin:'16px 0'}}>Building the web,<br/><span className="gradient-text">one commit at a time</span></h1>
            <p style={{color:'var(--text2)',fontSize:'1.05rem',lineHeight:1.8,maxWidth:520,marginBottom:20}}>I'm a Full Stack Developer from Nairobi, Kenya with a passion for building production-ready applications that solve real problems. I specialize in the React + Flask + PostgreSQL stack with deep expertise in M-Pesa payment integrations.</p>
            <p style={{color:'var(--text2)',lineHeight:1.8,maxWidth:520,marginBottom:28}}>When I'm not building apps, I'm writing about web development, contributing to open source, or mentoring junior developers in the Nairobi tech community.</p>
            <div className="about-tags">
              {['🚀 Fast Learner','🔍 Detail-Oriented','📱 Mobile-First','⚡ Performance Obsessed','🤝 Collaborative','☕ Coffee Addict'].map(t=><span key={t} className="skill-tag">{t}</span>)}
            </div>
          </div>
          <div className="about-img-wrap">
            <img src="/Myimage.jpeg" alt="David Wege" className="about-img"/>
            <div className="about-info-card card">
              <div className="info-item"><MapPin size={16} color="var(--accent2)"/><span>Nairobi, Kenya</span></div>
              <div className="info-item"><Calendar size={16} color="var(--green)"/><span>3+ Years Experience</span></div>
              <div className="info-item"><Award size={16} color="var(--gold)"/><span>4 Certifications</span></div>
              <div className="info-item"><Code2 size={16} color="var(--accent2)"/><span>5+ Production Apps</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section" style={{background:'var(--bg2)'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:56}}><span className="section-tag">Journey</span><h2 className="section-title">My Story</h2></div>
          <div className="timeline">
            {TIMELINE.map((t,i)=>(
              <div key={i} className="timeline-item">
                <div className="timeline-year">{t.year}</div>
                <div className="timeline-dot"/>
                <div className="timeline-content card"><h3>{t.title}</h3><p>{t.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="section">
        <div className="container">
          <div style={{textAlign:'center',marginBottom:56}}><span className="section-tag">Work History</span><h2 className="section-title">Experience</h2></div>
          <div className="exp-list">
            {experience.map(e=>(
              <div key={e.id} className="exp-card card">
                <div className="exp-header">
                  <div className="exp-company-wrap">
                    <div className="exp-logo">{e.company[0]}</div>
                    <div><h3>{e.position}</h3><div className="exp-company">{e.company} · {e.location}</div></div>
                  </div>
                  <div className="exp-dates">
                    {new Date(e.start_date).getFullYear()} — {e.current?'Present':new Date(e.end_date).getFullYear()}
                    {e.current&&<span className="current-badge">Current</span>}
                  </div>
                </div>
                {e.description&&<p className="exp-desc">{e.description}</p>}
                {(e.achievements||[]).length>0&&<ul className="exp-achievements">{e.achievements.map((a,i)=><li key={i}>{a}</li>)}</ul>}
                {(e.technologies||[]).length>0&&<div className="exp-techs">{e.technologies.map(t=><span key={t} className="badge">{t}</span>)}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section" style={{background:'var(--bg2)'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:48}}><span className="section-tag">Credentials</span><h2 className="section-title">Certifications</h2></div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:20}}>
            {certs.map(c=>(
              <div key={c.id} className="cert-card card">
                <div className="cert-icon">🏆</div>
                <h3 className="cert-title">{c.title}</h3>
                <div className="cert-issuer">{c.issuer}</div>
                {c.issue_date&&<div className="cert-date">{new Date(c.issue_date).getFullYear()}</div>}
                {c.credential_url&&<a href={c.credential_url} target="_blank" rel="noreferrer" className="cert-link">Verify ↗</a>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
