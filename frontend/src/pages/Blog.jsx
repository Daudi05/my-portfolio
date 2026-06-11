import {useState,useEffect} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ArrowLeft,Clock,Eye} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {oneDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import api from '../utils/api';

export function BlogPost(){
  const {slug}=useParams();const [post,setPost]=useState(null);
  useEffect(()=>{api.get(`/blog/${slug}`).then(r=>setPost(r.data.data)).catch(()=>{});},[slug]);
  if(!post) return <div className="page-loader"><div className="spinner"/></div>;
  return(
    <div style={{paddingTop:68}}>
      <div style={{background:'linear-gradient(135deg,var(--bg),var(--bg2))',padding:'60px 0 40px',borderBottom:'1px solid var(--border)'}}>
        <div className="container" style={{maxWidth:760}}>
          <Link to="/blog" style={{display:'inline-flex',alignItems:'center',gap:6,color:'var(--text2)',fontSize:'.85rem',marginBottom:24}}><ArrowLeft size={14}/>All Posts</Link>
          {post.category&&<span className="section-tag">{post.category}</span>}
          <h1 style={{margin:'16px 0',color:'var(--text)'}}>{post.title}</h1>
          <div style={{display:'flex',gap:16,color:'var(--text3)',fontSize:'.82rem'}}>
            <span><Clock size={13} style={{display:'inline',marginRight:4}}/>{post.read_time} min read</span>
            <span><Eye size={13} style={{display:'inline',marginRight:4}}/>{post.views} views</span>
            <span>{new Date(post.published_at||post.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'})}</span>
          </div>
        </div>
      </div>
      {post.cover_image&&<div style={{background:'var(--bg2)',padding:'32px 0'}}><div className="container" style={{maxWidth:760}}><img src={post.cover_image} alt={post.title} style={{width:'100%',borderRadius:12,maxHeight:400,objectFit:'cover',border:'1px solid var(--border)'}}/></div></div>}
      <div className="container" style={{maxWidth:760,padding:'48px 24px 80px'}}>
        <div className="article-content">
          <ReactMarkdown components={{code({node,inline,className,children,...props}){
            const match=/language-(\w+)/.exec(className||'');
            return !inline&&match?<SyntaxHighlighter style={oneDark} language={match[1]} PreTag="div" {...props}>{String(children).replace(/\n$/,'')}</SyntaxHighlighter>:<code className={className} style={{background:'var(--surface2)',padding:'2px 6px',borderRadius:4,fontSize:'.85em'}} {...props}>{children}</code>;
          }}}>{post.content}</ReactMarkdown>
        </div>
        {(post.tags||[]).length>0&&<div style={{marginTop:40,paddingTop:24,borderTop:'1px solid var(--border)',display:'flex',gap:8,flexWrap:'wrap'}}>{post.tags.map(t=><span key={t} className="badge">{t}</span>)}</div>}
      </div>
    </div>
  );
}

export default function Blog(){
  const [posts,setPosts]=useState([]);const [cat,setCat]=useState('');const [search,setSearch]=useState('');const [loading,setLoading]=useState(true);
  const CATS=['All','Backend','Frontend','Architecture','DevOps','Career'];
  useEffect(()=>{
    setLoading(true);
    const p={};if(cat&&cat!=='All') p.category=cat;if(search) p.search=search;
    api.get('/blog',{params:p}).then(r=>setPosts(r.data.data)).finally(()=>setLoading(false));
  },[cat,search]);
  return(
    <div style={{paddingTop:68}}>
      <div style={{background:'linear-gradient(135deg,var(--bg),var(--bg2))',padding:'80px 0 60px',borderBottom:'1px solid var(--border)'}}>
        <div className="container"><span className="section-tag">Blog</span><h1 style={{margin:'12px 0',color:'var(--text)'}}>Thoughts & Tutorials</h1><p style={{color:'var(--text2)',fontSize:'1.05rem'}}>Writing about web development, architecture, and lessons from the field.</p></div>
      </div>
      <div className="container" style={{padding:'40px 24px 80px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:36,flexWrap:'wrap',gap:12}}>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{CATS.map(c=><button key={c} className={`chip${cat===c||(!cat&&c==='All')?' active':''}`} onClick={()=>setCat(c==='All'?'':c)}>{c}</button>)}</div>
          <input className="form-input" style={{maxWidth:220}} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        {loading?<div className="page-loader"><div className="spinner"/></div>:(
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))',gap:24}}>
            {posts.map(p=>(
              <Link to={`/blog/${p.slug}`} key={p.id} className="card" style={{overflow:'hidden',display:'block',color:'inherit',transition:'all .2s'}}>
                {p.cover_image&&<img src={p.cover_image} alt={p.title} style={{width:'100%',height:180,objectFit:'cover'}}/>}
                <div style={{padding:20}}>
                  <span style={{fontSize:'.72rem',fontWeight:700,textTransform:'uppercase',letterSpacing:1.5,color:'var(--accent2)',display:'block',marginBottom:8}}>{p.category}</span>
                  <h3 style={{marginBottom:8,color:'var(--text)',fontSize:'1.05rem'}}>{p.title}</h3>
                  <p style={{fontSize:'.85rem',color:'var(--text2)',lineHeight:1.6,marginBottom:14,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{p.excerpt}</p>
                  <div style={{display:'flex',alignItems:'center',gap:12,fontSize:'.78rem',color:'var(--text3)'}}>
                    <span><Clock size={12} style={{display:'inline',marginRight:3}}/>{p.read_time} min</span>
                    <span><Eye size={12} style={{display:'inline',marginRight:3}}/>{p.views}</span>
                    <span style={{marginLeft:'auto'}}>{new Date(p.published_at||p.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
            {posts.length===0&&<div style={{gridColumn:'1/-1',textAlign:'center',padding:60,color:'var(--text2)'}}>No posts found</div>}
          </div>
        )}
      </div>
    </div>
  );
}
