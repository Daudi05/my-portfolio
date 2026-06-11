import {useState} from 'react';
import {Mail,Github,Linkedin,Twitter,Send,MapPin,Clock} from 'lucide-react';
import api from '../utils/api';
import {useToast} from '../context/ToastContext';

export default function Contact(){
  const toast=useToast();
  const [form,setForm]=useState({name:'',email:'',company:'',subject:'',message:''});
  const [loading,setLoading]=useState(false);
  const [sent,setSent]=useState(false);

  const handle=async e=>{
    e.preventDefault();setLoading(true);
    try{
      await api.post('/portfolio/contact',form);
      setSent(true);
      toast("Message sent! I'll reply within 24 hours.",'success');
    }catch(err){toast(err,'error');}
    finally{setLoading(false);}
  };

  return(
    <div style={{paddingTop:68}}>
      <div style={{background:'linear-gradient(135deg,var(--bg),var(--bg2))',padding:'80px 0 40px',borderBottom:'1px solid var(--border)'}}>
        <div className="container">
          <span className="section-tag">Get in Touch</span>
          <h1 style={{color:'var(--text)',margin:'14px 0'}}>Let's Work Together</h1>
          <p style={{color:'var(--text2)',maxWidth:500}}>Have a project in mind? I'm available for freelance work and full-time opportunities. Let's talk.</p>
        </div>
      </div>

      <div className="container" style={{padding:'60px 24px 80px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr',gap:60,alignItems:'start'}}>

          {/* Left — contact info */}
          <div>
            <h2 style={{marginBottom:24}}>Contact Information</h2>
            {[
              {icon:<Mail size={20}/>,label:'Email',value:'ojorodavid@gmail.com',href:'mailto:ojorodavid@gmail.com'},
              {icon:<MapPin size={20}/>,label:'Location',value:'Nairobi, Kenya · Remote'},
              {icon:<Clock size={20}/>,label:'Availability',value:'Open to work · Responds in 24hrs'},
            ].map(({icon,label,value,href})=>(
              <div key={label} className="card" style={{padding:'16px 20px',marginBottom:12,display:'flex',gap:14,alignItems:'center'}}>
                <div style={{width:42,height:42,borderRadius:10,background:'rgba(124,58,237,.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--accent2)',flexShrink:0}}>{icon}</div>
                <div>
                  <div style={{fontSize:'.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:1,color:'var(--text3)',marginBottom:2}}>{label}</div>
                  {href
                    ? <a href={href} style={{color:'var(--text)',fontWeight:600}}>{value}</a>
                    : <div style={{color:'var(--text)',fontWeight:600}}>{value}</div>
                  }
                </div>
              </div>
            ))}

            <div style={{marginTop:28}}>
              <h3 style={{marginBottom:14,fontSize:'1rem'}}>Social Links</h3>
              <div style={{display:'flex',gap:10}}>
                {[
                  {icon:'🐙',href:'https://github.com/Daudi05',label:'GitHub'},
                  {icon:'💼',href:'https://linkedin.com/in/davidwege',label:'LinkedIn'},
                  {icon:'𝕏',href:'https://x.com/jaUyoma12',label:'Twitter'},
                ].map(s=>(
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                    style={{width:44,height:44,borderRadius:10,border:'1px solid var(--border2)',display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text2)',transition:'all .2s'}}
                    onMouseEnter={e=>Object.assign(e.currentTarget.style,{borderColor:'var(--accent)',color:'var(--accent)',background:'rgba(124,58,237,.1)'})}
                    onMouseLeave={e=>Object.assign(e.currentTarget.style,{borderColor:'var(--border2)',color:'var(--text2)',background:'transparent'})}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right — form */}
          <div className="card" style={{padding:36}}>
            {sent ? (
              <div style={{textAlign:'center',padding:'20px 0'}}>
                <div style={{fontSize:'3.5rem',marginBottom:16}}>✉️</div>
                <h3 style={{marginBottom:12}}>Message Sent!</h3>
                <p style={{color:'var(--text2)',marginBottom:20}}>Thanks for reaching out! I'll get back to you within 24 hours.</p>
                <button className="btn btn-outline btn-sm" onClick={()=>setSent(false)}>Send Another</button>
              </div>
            ) : (
              <>
                <h3 style={{marginBottom:24}}>Send a Message</h3>
                <form onSubmit={handle}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
                    <div className="form-group">
                      <label className="form-label">Name *</label>
                      <input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="Your name"/>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email *</label>
                      <input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required placeholder="your@email.com"/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input className="form-input" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} placeholder="Your company (optional)"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input className="form-input" value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="Project inquiry, job opportunity…"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Message *</label>
                    <textarea className="form-input" rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} required placeholder="Tell me about your project…" style={{resize:'vertical'}}/>
                  </div>
                  <button className="btn btn-primary" type="submit" disabled={loading} style={{width:'100%',justifyContent:'center',marginTop:4}}>
                    <Send size={16}/>{loading ? 'Sending…' : 'Send Message'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
