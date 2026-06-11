import {BrowserRouter,Routes,Route,Navigate} from 'react-router-dom';
import {ThemeProvider} from './context/ThemeContext';
import {ToastProvider} from './context/ToastContext';
import {AuthProvider} from './context/AuthContext';
import Navbar from './components/Navbar';
import ChatBot from './components/ChatBot';
import Home from './pages/Home';
import About from './pages/About';
import Projects, {ProjectDetail} from './pages/Projects';
import Blog, {BlogPost} from './pages/Blog';
import Resume from './pages/Resume';
import Contact from './pages/Contact';
import AdminLogin from './pages/Login';
import AdminLayout, {AdminOverview,AdminProjects,AdminMessages} from './pages/admin/AdminDashboard';

function PublicLayout({children}){return <><Navbar/>{children}<ChatBot/></>;}

export default function App(){
  return(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <Routes>
              <Route path="/" element={<PublicLayout><Home/></PublicLayout>}/>
              <Route path="/about" element={<PublicLayout><About/></PublicLayout>}/>
              <Route path="/projects" element={<PublicLayout><Projects/></PublicLayout>}/>
              <Route path="/projects/:slug" element={<PublicLayout><ProjectDetail/></PublicLayout>}/>
              <Route path="/blog" element={<PublicLayout><Blog/></PublicLayout>}/>
              <Route path="/blog/:slug" element={<PublicLayout><BlogPost/></PublicLayout>}/>
              <Route path="/resume" element={<PublicLayout><Resume/></PublicLayout>}/>
              <Route path="/contact" element={<PublicLayout><Contact/></PublicLayout>}/>
              <Route path="/admin/login" element={<AdminLogin/>}/>
              <Route path="/admin" element={<AdminLayout/>}>
                <Route index element={<AdminOverview/>}/>
                <Route path="projects" element={<AdminProjects/>}/>
                <Route path="messages" element={<AdminMessages/>}/>
                <Route path="blog" element={<div style={{padding:32}}><h2>Blog CMS</h2><p style={{color:'var(--text2)',marginTop:8}}>Blog management coming soon.</p></div>}/>
                <Route path="testimonials" element={<div style={{padding:32}}><h2>Testimonials</h2></div>}/>
              </Route>
              <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
