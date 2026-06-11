import {useState,useEffect} from 'react';
import {Link,NavLink,Outlet,useNavigate} from 'react-router-dom';
import {LayoutDashboard,FolderOpen,FileText,MessageSquare,Star,LogOut,Plus} from 'lucide-react';
import api from '../../utils/api';
import {useAdmin} from '../../context/AuthContext';
import {useToast} from '../../context/ToastContext';

function AdminNav(){
  const {logout}=useAdmin();const navigate=useNavigate();
  const NAV=[{to:'/admin',icon:<LayoutDashboard size={16}/>,label:'Overview',end:true},
    {to:'/admin/projects',icon:<FolderOpen size={16}/>,label:'Projects'},{to:'/admin/blog',icon:<FileText size={16}/>,label:'Blog'},
    {to:'/admin/messages',icon:<MessageSquare size={16}/>,label:'Messages'},{to:'/admin/testimonials',icon:<Star size={16}/>,label:'Testimonials'}];
  return(
    <aside style={{width:220,background:'var(--bg2)',borderRight:'1px solid var(--border)',padding:'24px 12px',display:'flex',flexDirection:'column',position:'sticky',top:0,height:'100vh'}}>
      <Link to="/" style={{display:'flex',alignItems:'center',gap:8,padding:'0 8px',marginBottom:24,fontFamily:'var(--font-display)',fontSize:'1rem',color:'var(--text)'}}>
        <span style={{width:28,height:28,borderRadius:6,background:'var(--gradient)',display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'.8rem',fontWeight:700}}>DW</span>
        Portfolio CMS
      </Link>
      <nav style={{flex:1,display:'flex',flexDirection:'column',gap:2}}>
        {NAV.map(n=><NavLink key={n.to} to={n.to} end={n.end} style={({isActive})=>({display:'flex',alignItems:'center',gap:10,padding:'9px 14px',borderRadius:8,fontSize:'.875rem',fontWeight:500,color:isActive?'white':'var(--text2)',background:isActive?'var(--accent)':'transparent',transition:'all .2s'})}>{n.icon}{n.label}</NavLink>)}
      </nav>
      <button onClick={()=>{logout();navigate('/');}} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',color:'var(--text3)',fontSize:'.875rem',width:'100%',borderRadius:8}}><LogOut size={16}/>Logout</button>
    </aside>
  );
}

export function AdminOverview(){
  const [stats,setStats]=useState(null);const [messages,setMessages]=useState([]);
  useEffect(()=>{
    api.get('/portfolio/stats').then(r=>setStats(r.data.data)).catch(()=>{});
    api.get('/portfolio/messages').then(r=>setMessages(r.data.data.slice(0,5))).catch(()=>{});
  },[]);
  return(
    <div style={{padding:32}}>
      <h2 style={{marginBottom:28}}>Dashboard</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16,marginBottom:32}}>
        {[['Projects',stats?.projects,'🚀'],['Blog Posts',stats?.posts,'✍️'],['Messages',stats?.messages,'💬'],['Coffee ☕',stats?.coffee_cups,'☕']].map(([l,v,i])=>(
          <div key={l} className="card" style={{padding:20,textAlign:'center'}}>
            <div style={{fontSize:'1.8rem',marginBottom:8}}>{i}</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:'1.8rem',color:'var(--accent2)'}}>{v??'—'}</div>
            <div style={{fontSize:'.78rem',color:'var(--text3)',marginTop:4}}>{l}</div>
          </div>
        ))}
      </div>
      <div className="card" style={{padding:24}}>
        <h3 style={{marginBottom:16}}>Recent Messages</h3>
        {messages.map(m=>(
          <div key={m.id} style={{padding:'12px 0',borderBottom:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div><div style={{fontWeight:600,fontSize:'.9rem'}}>{m.name} <span style={{color:'var(--text3)',fontWeight:400}}>· {m.company||m.email}</span></div><div style={{fontSize:'.82rem',color:'var(--text2)',marginTop:2}}>{m.subject}</div></div>
            <span style={{fontSize:'.75rem',color:'var(--text3)'}}>{new Date(m.created_at).toLocaleDateString()}</span>
          </div>
        ))}
        {messages.length===0&&<p style={{color:'var(--text3)'}}>No messages yet</p>}
      </div>
    </div>
  );
}

export function AdminProjects(){
  const toast=useToast();
  const [projects,setProjects]=useState([]);
  const load=()=>api.get('/projects').then(r=>setProjects(r.data.data)).catch(()=>{});
  useEffect(()=>{load();},[]);
  const del=async id=>{if(!confirm('Delete?')) return;await api.delete(`/projects/${id}`);toast('Deleted','info');load();};
  return(
    <div style={{padding:32}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:24}}>
        <h2>Projects</h2>
        <Link to="/admin/projects/new" className="btn btn-primary btn-sm"><Plus size={14}/>Add Project</Link>
      </div>
      <div className="card" style={{overflow:'hidden'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:'.875rem'}}>
          <thead><tr style={{background:'var(--surface2)'}}>{['Title','Category','Featured','Actions'].map(h=><th key={h} style={{textAlign:'left',padding:'10px 16px',borderBottom:'1px solid var(--border)',fontSize:'.72rem',textTransform:'uppercase',color:'var(--text3)',letterSpacing:.5}}>{h}</th>)}</tr></thead>
          <tbody>{projects.map(p=>(
            <tr key={p.id} style={{borderBottom:'1px solid var(--border)'}}>
              <td style={{padding:'12px 16px',fontWeight:600}}>{p.title}</td>
              <td style={{padding:'12px 16px',color:'var(--text2)'}}>{p.category}</td>
              <td style={{padding:'12px 16px'}}>{p.featured?'⭐':'—'}</td>
              <td style={{padding:'12px 16px'}}><button className="btn btn-sm btn-outline" style={{marginRight:6,padding:'4px 10px',fontSize:'.78rem'}} onClick={()=>del(p.id)}>Delete</button></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

export function AdminMessages(){
  const toast=useToast();
  const [messages,setMessages]=useState([]);
  useEffect(()=>{api.get('/portfolio/messages').then(r=>setMessages(r.data.data)).catch(()=>{});},[]);
  const markRead=async id=>{await api.patch(`/portfolio/messages/${id}/read`);setMessages(m=>m.map(x=>x.id===id?{...x,is_read:true}:x));};
  return(
    <div style={{padding:32}}>
      <h2 style={{marginBottom:24}}>Messages ({messages.filter(m=>!m.is_read).length} unread)</h2>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {messages.map(m=>(
          <div key={m.id} className="card" style={{padding:20,opacity:m.is_read?.8:1,borderLeft:`3px solid ${m.is_read?'var(--border)':'var(--accent)'}`}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
              <div><strong>{m.name}</strong><span style={{color:'var(--text3)',marginLeft:10,fontSize:'.82rem'}}>{m.email}</span>{m.company&&<span style={{color:'var(--text3)',marginLeft:8,fontSize:'.82rem'}}>· {m.company}</span>}</div>
              <div style={{display:'flex',gap:8,alignItems:'center'}}>
                <span style={{fontSize:'.75rem',color:'var(--text3)'}}>{new Date(m.created_at).toLocaleDateString()}</span>
                {!m.is_read&&<button className="btn btn-sm" style={{padding:'3px 10px',fontSize:'.75rem',background:'rgba(124,58,237,.15)',color:'var(--accent2)',borderRadius:6}} onClick={()=>markRead(m.id)}>Mark Read</button>}
              </div>
            </div>
            {m.subject&&<div style={{fontWeight:600,marginBottom:6,fontSize:'.9rem'}}>{m.subject}</div>}
            <div style={{color:'var(--text2)',fontSize:'.875rem',lineHeight:1.6}}>{m.message}</div>
            <a href={`mailto:${m.email}`} className="btn btn-outline btn-sm" style={{marginTop:12,display:'inline-flex'}}>Reply via Email</a>
          </div>
        ))}
        {messages.length===0&&<div style={{textAlign:'center',padding:60,color:'var(--text3)'}}>No messages yet</div>}
      </div>
    </div>
  );
}

export default function AdminLayout(){
  const {admin}=useAdmin();const navigate=useNavigate();
  useEffect(()=>{if(!admin) navigate('/admin/login');},[admin,navigate]);
  if(!admin) return null;
  return(
    <div style={{display:'flex',minHeight:'100vh'}}>
      <AdminNav/>
      <main style={{flex:1,background:'var(--bg)',overflow:'auto'}}><Outlet/></main>
    </div>
  );
}