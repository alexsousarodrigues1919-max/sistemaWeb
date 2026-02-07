
import React, { useState, useEffect } from 'react';
import { User, PhysicalPerson, LegalPerson, Note, Planning, Meeting, Appointment, Professional, ClientAccount, UserProfileType, SupportTicket, ServiceRating } from './types.ts';
import { AlertCircle, CheckCircle2, X, ShieldCheck, Loader2, RefreshCw, Cloud, Database, Wifi, Server, Globe } from 'lucide-react';
import Login from './pages/Login.tsx';
import Layout from './components/Layout.tsx';
import Site from './pages/Site.tsx';
import PhysicalPersonForm from './pages/PhysicalPersonForm.tsx';
import LegalPersonForm from './pages/LegalPersonForm.tsx';
import Dashboard from './pages/Dashboard.tsx';
import DiaryForm from './pages/DiaryForm.tsx';
import PlanningForm from './pages/PlanningForm.tsx';
import MeetingForm from './pages/MeetingForm.tsx';
import AppointmentForm from './pages/AppointmentForm.tsx';
import ProfileView from './pages/ProfileView.tsx';
import ProfessionalForm from './pages/ProfessionalForm.tsx';
import ClientAccountForm from './pages/ClientAccountForm.tsx';
import SettingsPage from './pages/SettingsPage.tsx';
import ServiceHubPage from './pages/ServiceHubPage.tsx';
import ClientPortal from './pages/ClientPortal.tsx';

// --- SERVICE LAYER: BACKEND MOCK API ---
const DataAPI = {
  async fetchAll() {
    // Simula atraso de rede real de um servidor web
    await new Promise(r => setTimeout(r, 1200));
    return {
      users: JSON.parse(localStorage.getItem('db_users') || '[]'),
      pf: JSON.parse(localStorage.getItem('db_pf') || '[]'),
      pj: JSON.parse(localStorage.getItem('db_pj') || '[]'),
      profs: JSON.parse(localStorage.getItem('db_profs') || '[]'),
      accounts: JSON.parse(localStorage.getItem('db_accounts') || '[]'),
      notes: JSON.parse(localStorage.getItem('db_notes') || '[]'),
      plans: JSON.parse(localStorage.getItem('db_plans') || '[]'),
      meetings: JSON.parse(localStorage.getItem('db_meetings') || '[]'),
      apps: JSON.parse(localStorage.getItem('db_apps') || '[]'),
      tickets: JSON.parse(localStorage.getItem('db_tickets') || '[]'),
      ratings: JSON.parse(localStorage.getItem('db_ratings') || '[]'),
    };
  },
  async sync(key: string, data: any) {
    // Fix: Removed setIsSyncing(true) as it is not defined in this scope.
    // The UI syncing state is already handled via serverStatus within the App component.
    await new Promise(r => setTimeout(r, 800)); // Simula upload para o backend
    localStorage.setItem(`db_${key}`, JSON.stringify(data));
    return { success: true };
  }
};

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [serverStatus, setServerStatus] = useState<'ONLINE' | 'SYNCING'>('ONLINE');
  
  // Estados de Sessão
  const [view, setView] = useState<'site' | 'login' | 'system' | 'client-portal'>(() => (localStorage.getItem('session_view') as any) || 'site');
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('session_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeMenu, setActiveMenu] = useState(() => localStorage.getItem('session_menu') || 'dashboard');

  // Dados Centrais (Simulando Tabelas de Banco de Dados)
  const [db, setDb] = useState<any>({
    users: [], pf: [], pj: [], profs: [], accounts: [], notes: [], plans: [], meetings: [], apps: [], tickets: [], ratings: []
  });
  
  const [notification, setNotification] = useState<{message: string, type: string} | null>(null);

  // Inicialização do Sistema (Conexão ao Backend)
  useEffect(() => {
    const initSystem = async () => {
      const data = await DataAPI.fetchAll();
      setDb(data);
      setIsBooting(false);
    };
    initSystem();
  }, []);

  // Sincronizador Automático (Salva toda vez que db muda)
  useEffect(() => {
    if (isBooting) return;
    
    const persist = () => {
      setServerStatus('SYNCING');
      localStorage.setItem('session_view', view);
      localStorage.setItem('session_user', JSON.stringify(user));
      localStorage.setItem('session_menu', activeMenu);
      
      // Persiste "tabelas" individuais
      Object.keys(db).forEach(key => {
        localStorage.setItem(`db_${key}`, JSON.stringify(db[key]));
      });
      
      setTimeout(() => setServerStatus('ONLINE'), 1000);
    };

    const timer = setTimeout(persist, 500);
    return () => clearTimeout(timer);
  }, [db, view, user, activeMenu, isBooting]);

  const showNotify = (message: string, type: string = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogout = () => {
    setUser(null);
    setView('site');
    localStorage.removeItem('session_user');
  };

  if (isBooting) {
    return (
      <div className="h-screen w-screen bg-slate-950 flex flex-col items-center justify-center space-y-10">
        <div className="relative">
           <div className="w-24 h-24 bg-indigo-600 rounded-[38px] flex items-center justify-center text-white shadow-[0_0_50px_rgba(79,70,229,0.3)] animate-pulse">
              <Server size={48} />
           </div>
           <div className="absolute -top-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full border-4 border-slate-950 flex items-center justify-center text-white">
              <Wifi size={14} className="animate-bounce" />
           </div>
        </div>
        <div className="text-center space-y-4">
          <h1 className="text-white font-black text-3xl tracking-tighter uppercase">OFFICEHUB <span className="text-indigo-500">CLOUD</span></h1>
          <div className="flex flex-col items-center gap-2">
             <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 animate-[shimmer_2s_infinite_linear]" style={{width: '70%'}}></div>
             </div>
             <p className="text-indigo-400 text-[9px] font-black uppercase tracking-[0.5em] mt-2">Conectando ao Banco de Dados Web</p>
          </div>
        </div>
      </div>
    );
  }

  // Componente de View principal
  const renderContent = () => {
    switch(activeMenu) {
      case 'dashboard': return <Dashboard user={user!} data={db} />;
      case 'clientes': return <PhysicalPersonForm list={db.pf} onSave={p => setDb({...db, pf: [...db.pf.filter((x:any)=>x.id!==p.id), p]})} onDelete={id => setDb({...db, pf: db.pf.filter((x:any)=>x.id!==id)})} onNotify={showNotify} />;
      case 'empresas': return <LegalPersonForm list={db.pj} onSave={p => setDb({...db, pj: [...db.pj.filter((x:any)=>x.id!==p.id), p]})} onDelete={id => setDb({...db, pj: db.pj.filter((x:any)=>x.id!==id)})} onNotify={showNotify} />;
      case 'configuracoes': return <SettingsPage initialConfig={{officeName: 'OFFICEHUB PRO', primaryColor: '#4f46e5', language: 'PT', autoBackup: true, dataDensity: 'N'}} onSaveConfig={()=>{}} onNotify={showNotify} onImport={d => setDb({...db, ...d})} />;
      default: return <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">Módulo em Manutenção</div>;
    }
  };

  if (view === 'site') return <Site onEnterSystem={() => setView('login')} onEnterClientPortal={() => setView('client-portal')} />;
  if (view === 'login') return <Login onLogin={(l,p)=>{ if(l==='ADMIN'&&p==='123'){ setUser({id:'1', fullName:'ADMIN', profile:UserProfileType.ADMIN} as any); setView('system'); return null; } return 'ERRO';}} onBack={()=>setView('site')} onRegister={()=>{}} />;
  
  return (
    <Layout activeMenu={activeMenu} setActiveMenu={setActiveMenu} user={user!} onLogout={handleLogout}>
      {/* Indicador de Conexão com o Backend */}
      <div className="fixed top-6 right-6 z-[100] flex items-center gap-3">
        {serverStatus === 'SYNCING' ? (
          <div className="bg-white/90 backdrop-blur-md border border-indigo-100 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-right-4">
             <RefreshCw size={14} className="text-indigo-600 animate-spin" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Salvando na Nuvem...</span>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl shadow-md flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse cloud-active"></div>
             <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Servidor Online</span>
          </div>
        )}
      </div>

      {notification && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[1000] w-[90%] md:w-auto">
          <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/10">
            <CheckCircle2 className="text-emerald-400" />
            <p className="font-black text-[11px] uppercase tracking-tight">{notification.message}</p>
          </div>
        </div>
      )}

      {renderContent()}
    </Layout>
  );
};

export default App;
