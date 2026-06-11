import {createContext,useContext,useState} from 'react';
import api from '../utils/api';
const AuthContext=createContext();
export function AuthProvider({children}){
  const [admin,setAdmin]=useState(()=>!!localStorage.getItem('portfolio_token'));
  const login=async(email,password)=>{
    const res=await api.post('/auth/login',{email,password});
    localStorage.setItem('portfolio_token',res.data.data.token);
    setAdmin(true);return res.data.data;
  };
  const logout=()=>{localStorage.removeItem('portfolio_token');setAdmin(false);};
  return <AuthContext.Provider value={{admin,login,logout}}>{children}</AuthContext.Provider>;
}
export const useAdmin=()=>useContext(AuthContext);
