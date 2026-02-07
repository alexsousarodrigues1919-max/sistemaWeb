
import React, { useState } from 'react';
import { UserProfileType, User } from '../types.ts';
import LoadingButton from '../components/LoadingButton.tsx';
import { ShieldCheck, UserPlus, LogIn, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (login: string, pass: string) => string | null;
  onRegister: (user: User) => string | null;
  onBack?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', login: '', password: '', email: '', profile: UserProfileType.USER
  });
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (isRegister) {
      if (!formData.fullName || !formData.login || !formData.password) {
        setError('PREENCHA TODOS OS CAMPOS PARA CONTINUAR.');
        return;
      }
      const newUser: User = {
        id: 'USR-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        fullName: formData.fullName.toUpperCase(),
        login: formData.login.toUpperCase(),
        password: formData.password,
        email: formData.email.toUpperCase(),
        profile: formData.profile,
        status: 'ATIVO',
        createdAt: new Date().toISOString()
      };
      onRegister(newUser);
      setIsRegister(false);
    } else {
      const res = onLogin(formData.login, formData.password);
      if (res) setError(res);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden bg-slate-950">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-5px) translateX(-15px); }
          75% { transform: translateY(-25px) translateX(5px); }
        }
        @keyframes aurora {
          0% { transform: translate(-30%, -30%) rotate(0deg) scale(1); }
          50% { transform: translate(10%, 10%) rotate(180deg) scale(1.3); }
          100% { transform: translate(-30%, -30%) rotate(360deg) scale(1); }
        }
        .animate-aurora { animation: aurora 35s infinite linear; will-change: transform; }
        .animate-float { animation: float 15s infinite ease-in-out; will-change: transform; }
        .bg-noise { background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); }
      `}</style>

      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80%] h-[80%] rounded-full bg-indigo-600/30 blur-[120px] animate-aurora" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[80%] h-[80%] rounded-full bg-blue-600/20 blur-[150px] animate-aurora" style={{ animationDirection: 'reverse', animationDuration: '45s' }} />
        
        {/* Partículas Flutuantes */}
        {[...Array(15)].map((_, i) => (
          <div 
            key={i}
            className="absolute bg-white/10 rounded-full blur-[1px] animate-float"
            style={{
              width: Math.random() * 8 + 2 + 'px',
              height: Math.random() * 8 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: i * -1.5 + 's',
              opacity: Math.random() * 0.5
            }}
          />
        ))}
        
        <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay" />
        <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[4px]" />
      </div>

      {/* Botão Sair / Voltar */}
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-10 left-10 z-20 flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all font-black text-[10px] tracking-[0.2em] uppercase"
        >
          <ArrowLeft size={16} /> VOLTAR AO SITE
        </button>
      )}

      <div className="relative z-10 w-full max-w-md animate-in zoom-in-95 duration-1000">
        <div className="bg-white/80 backdrop-blur-3xl rounded-[50px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] p-12 border border-white/40">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-indigo-600 text-white rounded-[32px] mb-8 shadow-2xl shadow-indigo-500/40 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <ShieldCheck size={48} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">OFFICEHUB <span className="text-indigo-600">PRO</span></h1>
            <p className="text-slate-400 text-[10px] mt-3 font-black tracking-widest uppercase opacity-60">SISTEMA INTELIGENTE DE GESTÃO</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            {isRegister && (
              <div className="animate-in slide-in-from-top-4">
                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">NOME COMPLETO</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm focus:border-indigo-600 outline-none font-bold uppercase transition-all shadow-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">IDENTIFICAÇÃO / LOGIN</label>
              <input
                type="text"
                value={formData.login}
                onChange={(e) => setFormData({...formData, login: e.target.value})}
                className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm focus:border-indigo-600 outline-none font-bold uppercase transition-all shadow-sm"
                placeholder="USUÁRIO"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest">SENHA DE ACESSO</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-white/50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-sm focus:border-indigo-600 outline-none font-bold transition-all shadow-sm"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-5 rounded-[24px] text-[10px] font-black uppercase border border-red-100 animate-in slide-in-from-left-4">
                {error}
              </div>
            )}

            <LoadingButton onAction={handleSubmit} className="w-full h-20 text-xs tracking-[0.2em] shadow-2xl shadow-indigo-200/50 rounded-3xl">
              {isRegister ? 'CONFIRMAR CADASTRO' : 'ENTRAR AGORA'}
            </LoadingButton>

            <button 
              onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="w-full text-slate-400 hover:text-indigo-600 text-[10px] font-black uppercase tracking-widest py-3 flex items-center justify-center gap-2 transition-colors"
            >
              {isRegister ? <LogIn size={16} /> : <UserPlus size={16} />}
              {isRegister ? 'JÁ POSSUO ACESSO' : 'CRIAR NOVA CONTA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
