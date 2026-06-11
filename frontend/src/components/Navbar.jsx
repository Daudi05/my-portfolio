import {useState,useEffect} from 'react';
import {Link,useLocation} from 'react-router-dom';
import {Sun,Moon,Menu,X,Download} from 'lucide-react';
import {useTheme} from '../context/ThemeContext';
import './Navbar.css';

const NAV=[['Home','/'],['About','/about'],['Projects','/projects'],['Blog','/blog'],['Resume','/resume'],['Contact','/contact']];

export default function Navbar(){
  const {dark,toggle}=useTheme();
  const loc=useLocation();
  const [open,setOpen]=useState(false);
  const [scrolled,setScrolled]=useState(false);
  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>50);
    window.addEventListener('scroll',fn);return()=>window.removeEventListener('scroll',fn);
  },[]);
  return(
    <nav className={`navbar${scrolled?' scrolled':''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="nav-brand">
          <span className="brand-dot"/>
          <span>David<b>Wege</b></span>
        </Link>
        <div className={`nav-links${open?' open':''}`}>
          {NAV.map(([label,to])=>(
            <Link key={to} to={to} className={`nav-link${loc.pathname===to?' active':''}`} onClick={()=>setOpen(false)}>{label}</Link>
          ))}
        </div>
        <div className="nav-right">
          <button className="nav-icon" onClick={toggle} title="Toggle theme">
            {dark?<Sun size={18}/>:<Moon size={18}/>}
          </button>
          <Link to="/contact" className="btn btn-primary btn-sm" style={{marginLeft:8}}>Hire Me</Link>
          <button className="hamburger" onClick={()=>setOpen(!open)}>{open?<X size={22}/>:<Menu size={22}/>}</button>
        </div>
      </div>
    </nav>
  );
}
