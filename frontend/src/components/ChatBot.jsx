import {useState,useRef,useEffect} from 'react';
import {MessageCircle,X,Send,Bot,User} from 'lucide-react';
import api from '../utils/api';
import './ChatBot.css';

export default function ChatBot(){
  const [open,setOpen]=useState(false);
  const [messages,setMessages]=useState([{role:'bot',text:"Hi! 👋 I'm David's AI assistant. Ask me about his skills, projects, experience, or availability!"}]);
  const [input,setInput]=useState('');const [loading,setLoading]=useState(false);
  const bottomRef=useRef();
  useEffect(()=>bottomRef.current?.scrollIntoView({behavior:'smooth'}),[messages]);

  const send=async()=>{
    if(!input.trim()||loading) return;
    const userMsg=input.trim();setInput('');
    setMessages(m=>[...m,{role:'user',text:userMsg}]);
    setLoading(true);
    try{
      const res=await api.post('/portfolio/chat',{message:userMsg,history:messages.slice(-6)});
      setMessages(m=>[...m,{role:'bot',text:res.data.data.reply}]);
    }catch{setMessages(m=>[...m,{role:'bot',text:"Sorry, I had trouble connecting. Please try again!"}]);}
    finally{setLoading(false);}
  };

  const QUICK=['What are David\'s skills?','Is David available?','Show me his projects','How to contact David?'];

  return(
    <>
      <button className={`chat-toggle${open?' open':''}`} onClick={()=>setOpen(!open)} title="Chat with AI">
        {open?<X size={22}/>:<MessageCircle size={22}/>}
        {!open&&<span className="chat-pulse"/>}
      </button>
      {open&&(
        <div className="chatbot-window">
          <div className="chat-header">
            <div className="chat-avatar"><Bot size={18}/></div>
            <div><div className="chat-name">David's AI Assistant</div><div className="chat-status">●  Online</div></div>
            <button onClick={()=>setOpen(false)}><X size={18}/></button>
          </div>
          <div className="chat-messages">
            {messages.map((m,i)=>(
              <div key={i} className={`chat-msg${m.role==='user'?' user':''}`}>
                <div className="msg-avatar">{m.role==='bot'?<Bot size={14}/>:<User size={14}/>}</div>
                <div className="msg-bubble" style={{whiteSpace:'pre-line'}} dangerouslySetInnerHTML={{__html:m.text.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}}/>
              </div>
            ))}
            {loading&&<div className="chat-msg"><div className="msg-avatar"><Bot size={14}/></div><div className="msg-bubble typing"><span/><span/><span/></div></div>}
            <div ref={bottomRef}/>
          </div>
          {messages.length===1&&(
            <div className="chat-quick">
              {QUICK.map(q=><button key={q} onClick={()=>{setInput(q);setTimeout(()=>send(),100)}}>{q}</button>)}
            </div>
          )}
          <div className="chat-input">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask me anything…"/>
            <button onClick={send} disabled={loading||!input.trim()}><Send size={16}/></button>
          </div>
        </div>
      )}
    </>
  );
}
