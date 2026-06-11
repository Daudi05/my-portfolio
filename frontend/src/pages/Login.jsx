import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAdmin} from '../context/AuthContext';
import {useToast} from '../context/ToastContext';
export default function AdminLogin(){
  const {login}=useAdmin();const toast=useToast();const navigate=useNavigate();
  const [form,setForm]=useState({email:'',password:''});const [loading,setLoading]=useState(false);
  const handle=async e=>{
    e.preventDefault();setLoading(true);
    try{await login(form.email,form.password);toast('Welcome back!','success');navigate('/admin');}
    catch(err){toast(err,'error');}finally{setLoading(false);}
  };
  return(
    <div style={{minHeight:'100vh',background:'var(--bg)',display:'flex',alignItems:'center',justifyContent:'center',padding:24}}>
      <div className="card" style={{maxWidth:400,width:'100%',padding:40}}>
        <div style={{textAlign:'center',marginBottom:32}}>
          <div style={{width:56,height:56,borderRadius:16,background:'var(--gradient)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 16px',fontSize:'1.5rem'}}>🔐</div>
          <h2>Admin Login</h2><p style={{color:'var(--text2)',marginTop:6,fontSize:'.9rem'}}>David Wege Portfolio CMS</p>
        </div>
        <form onSubmit={handle}>
          <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required placeholder="admin@portfolio.dev"/></div>
          <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required placeholder="••••••••"/></div>
          <button className="btn btn-primary" type="submit" disabled={loading} style={{width:'100%',justifyContent:'center',marginTop:8,padding:12}}>{loading?'Signing in…':'Sign In'}</button>
        </form>
        <p style={{textAlign:'center',marginTop:16,fontSize:'.78rem',color:'var(--text3)'}}>admin@portfolio.dev / admin123</p>
      </div>
    </div>
  );
}
