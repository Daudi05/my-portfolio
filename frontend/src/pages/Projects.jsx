import {useState,useEffect} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ExternalLink,ArrowLeft,ArrowRight,Code2} from 'lucide-react';
import api from '../utils/api';
import './Projects.css';

const CATS=['All','Full Stack','Web App','Mobile','AI/ML','Open Source'];

export function ProjectDetail(){
  const {slug}=useParams();const [project,setProject]=useState(null);
  useEffect(()=>{api.get(`/projects/${slug}`).then(r=>setProject(r.data.data)).catch(()=>{});},[slug]);
  if(!project) return <div className="page-loader"><div className="spinner"/></div>;
  return(
    <div className="project-detail-page">
      <div className="proj-detail-hero">
        <div className="container">
          <Link to="/projects" className="back-btn"><ArrowLeft size={16}/>All Projects</Link>
          <div className="proj-detail-meta"><span className="section-tag">{project.category}</span></div>
          <h1 style={{color:'white',maxWidth:700,margin:'16px 0'}}>{project.title}</h1>
          <p style={{color:'rgba(255,255,255,.75)',maxWidth:600,fontSize:'1.05rem',lineHeight:1.7}}>{project.description}</p>
          <div style={{display:'flex',gap:12,marginTop:28,flexWrap:'wrap'}}>
            {project.demo_url&&<a href={project.demo_url} target="_blank" rel="noreferrer" className="btn btn-primary"><ExternalLink size={16}/>Live Demo</a>}
            
          </div>
        </div>
      </div>
      {project.image_url&&<div className="proj-hero-img"><div className="container"><img src={project.image_url} alt={project.title} style={{width:'100%',borderRadius:16,maxHeight:480,objectFit:'cover',border:'1px solid var(--border)'}}/></div></div>}
      <div className="container proj-detail-body">
        <div className="proj-detail-grid">
          <div>
            {project.long_desc&&<><h2>About This Project</h2><p style={{color:'var(--text2)',lineHeight:1.8,marginBottom:32}}>{project.long_desc}</p></>}
            {project.challenges&&<><h2>Technical Challenges</h2><div className="challenge-box"><p style={{color:'var(--text2)',lineHeight:1.8}}>{project.challenges}</p></div></>}
            {project.results&&<><h2 style={{marginTop:32}}>Results & Impact</h2><div className="results-box"><p style={{color:'var(--text2)',lineHeight:1.8}}>{project.results}</p></div></>}
          </div>
          <div>
            <div className="proj-sidebar-card card">
              <h3>Technologies Used</h3>
              <div className="proj-techs" style={{marginTop:14}}>
                {(project.technologies||[]).map(t=><span key={t} className="badge">{t}</span>)}
              </div>
            </div>
            <div className="proj-sidebar-card card" style={{marginTop:16}}>
              <h3>Links</h3>
              <div style={{display:'flex',flexDirection:'column',gap:10,marginTop:14}}>
                {project.demo_url&&<a href={project.demo_url} target="_blank" rel="noreferrer" className="btn btn-primary" style={{justifyContent:'center'}}><ExternalLink size={15}/>Live Demo</a>}
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects(){
  const [projects,setProjects]=useState([]);const [cat,setCat]=useState('All');const [search,setSearch]=useState('');const [loading,setLoading]=useState(true);
  useEffect(()=>{
    setLoading(true);
    const p={};if(cat!=='All') p.category=cat;if(search) p.search=search;
    api.get('/projects',{params:p}).then(r=>setProjects(r.data.data)).finally(()=>setLoading(false));
  },[cat,search]);
  return(
    <div className="projects-page">
      <div className="page-hero"><div className="container"><span className="section-tag">Portfolio</span><h1>My Projects</h1><p style={{color:'rgba(255,255,255,.7)',marginTop:12,fontSize:'1.05rem',maxWidth:500}}>Production-ready applications I've designed, built, and shipped.</p></div></div>
      <div className="container" style={{padding:'48px 24px 80px'}}>
        <div className="projects-controls">
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            {CATS.map(c=><button key={c} className={`chip${cat===c?' active':''}`} onClick={()=>setCat(c)}>{c}</button>)}
          </div>
          <input className="form-input" style={{maxWidth:240}} placeholder="Search projects…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {loading?<div className="page-loader"><div className="spinner"/></div>:(
          <div className="all-projects-grid">
            {projects.map(p=>(
              <div key={p.id} className="project-card card" style={{overflow:'hidden'}}>
                <div className="proj-img-wrap" style={{height:200}}>
                  {p.image_url?<img src={p.image_url} alt={p.title} className="proj-img"/>:<div className="proj-img-placeholder"><Code2 size={32}/></div>}
                  <div className="proj-overlay">
                    {p.demo_url&&<a href={p.demo_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary"><ExternalLink size={14}/>Demo</a>}
                    
                  </div>
                </div>
                <div className="proj-body">
                  <div className="proj-cat">{p.category}</div>
                  <h3 className="proj-title">{p.title}</h3>
                  <p className="proj-desc">{p.description?.slice(0,100)}…</p>
                  <div className="proj-techs">{(p.technologies||[]).slice(0,4).map(t=><span key={t} className="badge">{t}</span>)}</div>
                  <Link to={`/projects/${p.slug}`} className="proj-link">Case Study <ArrowRight size={14}/></Link>
                </div>
              </div>
            ))}
            {projects.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'var(--text2)'}}>No projects found</div>}
          </div>
        )}
      </div>
    </div>
  );
}
