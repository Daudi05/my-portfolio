import {useState,useEffect} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ExternalLink,ArrowLeft,ArrowRight,Code2} from 'lucide-react';
import api from '../utils/api';
import './Projects.css';

const CATS=['All','Full Stack','Web App','Mobile','AI/ML','Open Source'];

const ALL_PROJECTS=[
  {
    id:'nyabera',
    title:'Nyabera Secondary School',
    category:'Education',
    slug:'nyabera-secondary-school',
    description:'A full-featured school management web platform for Nyabera Secondary School, handling student records, timetables, announcements, and staff administration.',
    long_desc:'Built a comprehensive school management system for Nyabera Secondary School. The platform allows administrators to manage student enrollment, generate timetables, post announcements, and track academic performance across all classes.',
    challenges:'Designing a role-based access system for admins, teachers, and students while keeping the UI simple enough for non-technical staff to use daily.',
    results:'Reduced manual paperwork significantly and gave staff a centralized platform to manage all school operations efficiently.',
    image_url:'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&q=80',
    technologies:['React','Flask','PostgreSQL','Tailwind'],
    demo_url:null,
  },
  {
    id:'davis',
    title:'Davis Restaurant',
    category:'Hospitality',
    slug:'davis-restaurant',
    description:'A modern restaurant website for Davis Restaurant featuring an online menu, table reservations, M-Pesa payment integration, and an admin dashboard for order management.',
    long_desc:'Designed and developed a full restaurant web presence for Davis Restaurant. Customers can browse the menu, make table reservations, and pay online via M-Pesa. The admin dashboard gives staff real-time control over orders and bookings.',
    challenges:'Integrating M-Pesa Daraja STK Push for seamless in-browser payments and handling real-time order status updates for the kitchen dashboard.',
    results:'Enabled online ordering and reservations, reducing phone call volume and increasing weekend bookings.',
    image_url:'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
    technologies:['React','Node.js','MongoDB','M-Pesa Daraja'],
    demo_url:null,
  },
  {
    id:'danis',
    title:"Danis Choice",
    category:'E-Commerce',
    slug:'danis-choice',
    description:"An elegant e-commerce platform for Danis Choice, a ladies' fashion store selling clothes, shoes, and bags — with product listings, a shopping cart, and M-Pesa checkout.",
    long_desc:"Built a full e-commerce store for Danis Choice, a Nairobi-based ladies' fashion brand. Shoppers can browse products by category (clothes, shoes, bags), add to cart, and complete purchases via M-Pesa or card. Includes an admin panel for managing inventory and orders.",
    challenges:'Building a smooth mobile shopping experience optimized for low-bandwidth connections, and implementing M-Pesa STK push with reliable callback handling.',
    results:'Gave Danis Choice a professional online storefront, expanding their reach beyond walk-in customers to online shoppers across Kenya.',
    image_url:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    technologies:['React','Flask','PostgreSQL','Stripe'],
    demo_url:null,
  },
  {
    id:'mkopo',
    title:'Mkopo',
    category:'Fintech',
    slug:'mkopo',
    description:'A loan management platform for Mkopo, an institution offering personal and business loans — with loan applications, repayment tracking, and M-Pesa disbursement.',
    long_desc:'Developed Mkopo, a fintech platform that streamlines the loan lifecycle from application to repayment. Borrowers apply online, track their loan status, and receive disbursements via M-Pesa. Loan officers get a full dashboard to review applications, approve loans, and monitor repayments.',
    challenges:'Implementing secure M-Pesa B2C disbursement, building a reliable repayment scheduler, and ensuring sensitive financial data is handled safely end-to-end.',
    results:'Automated loan processing for the institution, cutting approval turnaround time and providing borrowers with a transparent, self-service experience.',
    image_url:'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80',
    technologies:['React','Flask','PostgreSQL','M-Pesa Daraja'],
    demo_url:null,
  },
];

export function ProjectDetail(){
  const {slug}=useParams();

  // Check hardcoded projects first, then fall back to API
  const local=ALL_PROJECTS.find(p=>p.slug===slug);
  const [project,setProject]=useState(local||null);

  useEffect(()=>{
    if(local){setProject(local);return;}
    api.get(`/projects/${slug}`).then(r=>setProject(r.data.data)).catch(()=>{});
  },[slug]);

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
                {!project.demo_url&&<p style={{color:'var(--text2)',fontSize:'0.9rem'}}>No live demo available.</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects(){
  const [apiProjects,setApiProjects]=useState([]);
  const [cat,setCat]=useState('All');
  const [search,setSearch]=useState('');
  const [loading,setLoading]=useState(true);

  useEffect(()=>{
    setLoading(true);
    const p={};if(cat!=='All') p.category=cat;if(search) p.search=search;
    api.get('/projects',{params:p}).then(r=>setApiProjects(r.data.data)).catch(()=>setApiProjects([])).finally(()=>setLoading(false));
  },[cat,search]);

  // Merge: hardcoded first, then any API projects not already in hardcoded list
  const hardcodedSlugs=ALL_PROJECTS.map(p=>p.slug);
  const merged=[...ALL_PROJECTS,...apiProjects.filter(p=>!hardcodedSlugs.includes(p.slug))];

  // Filter merged list client-side
  const filtered=merged.filter(p=>{
    const matchCat=cat==='All'||p.category===cat;
    const matchSearch=!search||p.title.toLowerCase().includes(search.toLowerCase())||p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat&&matchSearch;
  });

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
            {filtered.map(p=>(
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
            {filtered.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'var(--text2)'}}>No projects found</div>}
          </div>
        )}
      </div>
    </div>
  );
}