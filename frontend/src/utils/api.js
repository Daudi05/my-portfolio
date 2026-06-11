import axios from 'axios';
const api = axios.create({baseURL:'http://localhost:5000/api'});
api.interceptors.request.use(cfg=>{
  const t=localStorage.getItem('portfolio_token');
  if(t) cfg.headers.Authorization=`Bearer ${t}`;
  return cfg;
});
api.interceptors.response.use(r=>r,err=>Promise.reject(err.response?.data?.message||'Something went wrong'));
export default api;
