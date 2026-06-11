import {Download,ExternalLink} from 'lucide-react';
import {useToast} from '../context/ToastContext';
export default function Resume(){
  const toast=useToast();
  return(
    <div style={{paddingTop:68}}>
      <div style={{background:'linear-gradient(135deg,var(--bg),var(--bg2))',padding:'80px 0 40px',borderBottom:'1px solid var(--border)'}}>
        <div className="container">
          <span className="section-tag">Resume</span>
          <h1 style={{color:'var(--text)',margin:'14px 0'}}>My Resume</h1>
          <p style={{color:'var(--text2)',marginBottom:28}}>Full Stack Developer with 3+ years building production web applications.</p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <button className="btn btn-primary" onClick={()=>toast('Resume download coming soon — contact me directly!','info')}><Download size={16}/>Download PDF</button>
            <a href="mailto:david@davidwege.dev" className="btn btn-outline"><ExternalLink size={16}/>Contact Me</a>
          </div>
        </div>
      </div>
      <div className="container" style={{padding:'60px 24px 80px',maxWidth:900}}>
        {/* Summary */}
        <div className="resume-section card" style={{padding:32,marginBottom:24}}>
          <h2 style={{marginBottom:16}}>Professional Summary</h2>
          <p style={{color:'var(--text2)',lineHeight:1.8}}>Full Stack Developer with 3+ years building production web applications for clients across East Africa and globally. Expert in React, Flask/Python, and PostgreSQL. Deep experience with M-Pesa Daraja API integrations, JWT authentication, role-based access control, and RESTful API design. Passionate about clean code, performance, and exceptional user experiences.</p>
        </div>
        {/* Skills */}
        <div className="resume-section card" style={{padding:32,marginBottom:24}}>
          <h2 style={{marginBottom:24}}>Technical Skills</h2>
          {[['Frontend','React · JavaScript (ES6+)  · HTML5 · CSS3 · Tailwind CSS '],
            ['Backend','Flask · Python · REST APIs · JWT Auth '],
            ['Database','PostgreSQL · MySQL  · Database Design · SQL · Migrations'],
            ['Cloud & DevOps','AWS · Google Cloud · Docker · Git · GitHub Actions · CI/CD · Linux'],
            ['Payments','M-Pesa Daraja API · Stripe · PayPal · Payment Architecture'],
            ['Tools','VS Code · Postman  '],
          ].map(([cat,skills])=>(
            <div key={cat} style={{display:'grid',gridTemplateColumns:'160px 1fr',gap:16,padding:'12px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{font:'600 .85rem var(--font)',color:'var(--text2)'}}>{cat}</span>
              <span style={{fontSize:'.9rem',color:'var(--text)'}}>{skills}</span>
            </div>
          ))}
        </div>
        {/* Experience */}
        <div className="resume-section card" style={{padding:32,marginBottom:24}}>
          <h2 style={{marginBottom:24}}>Work Experience</h2>
          {[{company:'Freelance / Self-Employed',role:'Full Stack Developer',period:'November 2025 – Present',points:['Built 5+ production applications serving real users across East Africa','Integrated M-Pesa payment processing handling KES 10M+ in transactions','Delivered projects 20% ahead of schedule on average','Maintained 99.9% uptime across all deployed applications']},
            {company:'Tech Community Nairobi',role:'Open Source Contributor & Mentor',period:'March 2026 – Present',points:['Mentored 15+ junior developers through pair programming and code reviews','Contributed to 3 open source projects with 500+ GitHub stars','Organized 12 monthly meetups with 50+ attendees each']}
          ].map(exp=>(
            <div key={exp.company} style={{marginBottom:28}}>
              <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8,marginBottom:6}}>
                <div><h3 style={{fontSize:'1.05rem',marginBottom:2}}>{exp.role}</h3><div style={{color:'var(--accent2)',fontSize:'.875rem',fontWeight:600}}>{exp.company}</div></div>
                <span style={{fontFamily:'var(--font-mono)',fontSize:'.8rem',color:'var(--text3)'}}>{exp.period}</span>
              </div>
              <ul style={{listStyle:'none',marginTop:10}}>
                {exp.points.map((p,i)=><li key={i} style={{display:'flex',gap:8,fontSize:'.875rem',color:'var(--text2)',padding:'3px 0'}}><span style={{color:'var(--accent2)',flexShrink:0}}>▸</span>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
        {/* Education */}
        <div className="resume-section card" style={{padding:32,marginBottom:24}}>
          <h2 style={{marginBottom:20}}>Education</h2>
          <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
            <div><h3 style={{fontSize:'1.05rem',marginBottom:4}}>Bachelor of Arts(Economics)</h3><div style={{color:'var(--accent2)',fontWeight:600}}>University of Nairobi</div><div style={{fontSize:'.85rem',color:'var(--text2)',marginTop:4}}>Focus: Used python in statistics</div></div>
            <div><h3 style={{fontSize:'1.05rem',marginBottom:4}}>Software Engineering Bootcamp</h3><div style={{color:'var(--accent2)',fontWeight:600}}>Moringa School</div><div style={{fontSize:'.85rem',color:'var(--text2)',marginTop:4}}>Focus: Software Engineering, Databases, Algorithms</div></div>
            <span style={{fontFamily:'var(--font-mono)',fontSize:'.8rem',color:'var(--text3)'}}>2020 – 2026</span>
          </div>
        </div>
        {/* Certs */}
        <div className="resume-section card" style={{padding:32}}>
          <h2 style={{marginBottom:20}}>Certifications</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:14}}>
            {[['Full Stack Software Engineer ','Moringa School','2026'],
              ['Bachelor Of Arts','University Of Nairobi','2026'],
              
              ].map(([t,i,y])=>(
              <div key={t} style={{padding:'14px',background:'var(--surface2)',borderRadius:10,border:'1px solid var(--border)'}}>
                <div style={{fontWeight:600,fontSize:'.875rem',marginBottom:4}}>{t}</div>
                <div style={{fontSize:'.78rem',color:'var(--text2)'}}>{i} · {y}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
