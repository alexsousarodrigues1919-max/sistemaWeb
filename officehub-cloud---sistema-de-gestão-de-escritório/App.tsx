
import React, { useState, useEffect, useCallback } from 'react';
import { User, PhysicalPerson, LegalPerson, Note, Planning, Meeting, Appointment, Professional, ClientAccount, UserProfileType, SupportTicket, ServiceRating } from './types.ts';
import { 
  ShieldCheck, 
  Loader2, 
  RefreshCw, 
  Cloud, 
  Database, 
  Wifi, 
  Server, 
  Globe, 
  Activity,
  AlertCircle,
  CheckCircle2,
  X
} from 'lucide-react';
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

// --- VIRTUAL BACKEND SERVICE ---
class VirtualBackend {
  private static async latency() {
    return new Promise(r => setTimeout(r, 600 + Math.random() * 600));
  }

  static async getTable(tableName: string) {
    await this.latency();
    const data = localStorage.getItem(`db_cloud_${tableName}`);
    return data ? JSON.parse(data) : [];
  }

  static async saveTable(tableName: string, data: any) {
    await this.latency();
    localStorage.setItem(`db_cloud_${tableName}`, JSON.stringify(data));
    return { status: 200, message: "SYNC_OK" };
  }

  static async init() {
    const tables = ['users', 'pf', 'pj', 'profs', 'accounts', 'notes', 'plans', 'meetings', 'apps', 'tickets', 'ratings'];
    const db: any = {};
    for (const table of tables) {
      db[table] = await this.getTable(table);
    }
    return db;
  }
}

const App: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'IDLE' | 'SAVING' | 'ERROR'>('IDLE');
  
  // View Control
  const [view, setView] = useState<'site' | 'login' | 'system' | 'client-portal'>(() => 
    (localStorage.getItem('session_view') as any) || 'site'
  );
  
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('session_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeMenu, setActiveMenu] = useState(() => localStorage.getItem('session_menu') || 'dashboard');

  // Database State (The "Virtual Server" instance)
  const [db, setDb] = useState<any>(null);
  const [notification, setNotification] = useState<{message: string, type: string} | null>(null);

  // Connect to Backend on Boot
  useEffect(() => {
    VirtualBackend.init().then(data => {
      setDb(data);
      setIsConnecting(false);
    });
  }, []);

  // Persistent Sync Watcher
  useEffect(() => {
    if (!db || isConnecting) return;
    
    const syncWithBackend = async () => {
      setSyncStatus('SAVING');
      try {
        localStorage.setItem('session_view', view);
        localStorage.setItem('session_user', JSON.stringify(user));
        localStorage.setItem('session_menu', activeMenu);
        
        for (const table of Object.keys(db)) {
          await VirtualBackend.saveTable(table, db[table]);
        }
        setSyncStatus('IDLE');
      } catch (e) {
        setSyncStatus('ERROR');
      }
    };

    const timer = setTimeout(syncWithBackend, 1000);
    return () => clearTimeout(timer);
  }, [db, view, user, activeMenu, isConnecting]);

  const showNotify = (message: string, type: string = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleLogout = () => {
    setUser(null);
    setView('site');
    localStorage.removeItem('session_user');
  };

  if (isConnecting) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center">
        <div className="relative mb-8">
           <div className="w-20 h-20 bg-indigo-600 rounded-[30px] flex items-center justify-center text-white shadow-2xl animate-bounce">
              <Database size={40} />
           </div>
           <div className="absolute -top-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center text-white">
              <Wifi size={12} className="animate-pulse" />
           </div>
        </div>
        <h1 className="text-white font-black text-2xl tracking-tighter uppercase mb-2">OFFICEHUB <span className="text-indigo-500">CLOUD</span></h1>
        <div className="flex items-center gap-3">
           <Loader2 size={14} className="text-indigo-400 animate-spin" />
           <p className="text-indigo-300/40 text-[9px] font-black uppercase tracking-[0.4em]">Autenticando com Servidor Virtual...</p>
        </div>
      </div>
    );
  }

  // Helper for DB updates
  const updateDB = (table: string, newData: any) => {
    setDb((prev: any) => ({ ...prev, [table]: newData }));
  };

  const renderModule = () => {
    switch(activeMenu) {
      case 'dashboard': return <Dashboard user={user!} data={db} />;
      case 'clientes': return <PhysicalPersonForm list={db.pf} onSave={p => updateDB('pf', [...db.pf.filter((x:any)=>x.id!==p.id), p])} onDelete={id => updateDB('pf', db.pf.filter((x:any)=>x.id!==id))} onNotify={showNotify} />;
      case 'empresas': return <LegalPersonForm list={db.pj} onSave={p => updateDB('pj', [...db.pj.filter((x:any)=>x.id!==p.id), p])} onDelete={id => updateDB('pj', db.pj.filter((x:any)=>x.id!==id))} onNotify={showNotify} />;
      case 'contas': return <ClientAccountForm list={db.accounts} clients={[...db.pf, ...db.pj]} onSave={a => updateDB('accounts', [...db.accounts.filter((x:any)=>x.id!==a.id), a])} onDelete={id => updateDB('accounts', db.accounts.filter((x:any)=>x.id!==id))} onNotify={showNotify} />;
      case 'profissionais': return <ProfessionalForm list={db.profs} onSave={p => updateDB('profs', [...db.profs.filter((x:any)=>x.id!==p.id), p])} onDelete={id => updateDB('profs', db.profs.filter((x:any)=>x.id!==id))} onNotify={showNotify} />;
      case 'servicehub': return <ServiceHubPage tickets={db.tickets} ratings={db.ratings} clients={[...db.pf, ...db.pj]} onSaveTicket={t => updateDB('tickets', [...db.tickets.filter((x:any)=>x.id!==t.id), t])} onSaveRating={r => updateDB('ratings', [...db.ratings, r])} onDeleteTicket={id => updateDB('tickets', db.tickets.filter((x:any)=>x.id!==id))} />;
      case 'agenda': return <DiaryForm list={db.notes} people={db.pf} user={user!} onSave={n => updateDB('notes', [...db.notes.filter((x:any)=>x.id!==n.id), n])} onDelete={id => updateDB('notes', db.notes.filter((x:any)=>x.id!==id))} onNotify={showNotify} />;
      case 'planejamento': return <PlanningForm list={db.plans} user={user!} onSave={p => updateDB('plans', [...db.plans.filter((x:any)=>x.id!==p.id), p])} onDelete={id => updateDB('plans', db.plans.filter((x:any)=>x.id!==id))} onNotify={showNotify} />;
      case 'reunioes': return <MeetingForm list={db.meetings} user={user!} onSave={m => updateDB('meetings', [...db.meetings.filter((x:any)=>x.id!==m.id), m])} onDelete={id => updateDB('meetings', db.meetings.filter((x:any)=>x.id!==id))} onNotify={showNotify} />;
      case 'atendimentos': return <AppointmentForm list={db.apps} people={db.pf} user={user!} onSave={a => updateDB('apps', [...db.apps.filter((x:any)=>x.id!==a.id), a])} onDelete={id => updateDB('apps', db.apps.filter((x:any)=>x.id!==id))} onNotify={showNotify} />;
      case 'configuracoes': return <SettingsPage initialConfig={{officeName: 'OFFICEHUB PRO'}} onSaveConfig={()=>{}} onNotify={showNotify} onImport={d => setDb({...db, ...d})} />;
      case 'perfil': return <ProfileView user={user!} />;
      default: return null;
    }
  };

  if (view === 'site') return <Site onEnterSystem={() => setView('login')} onEnterClientPortal={() => setView('client-portal')} />;
  if (view === 'login') return (
    <Login 
      onLogin={(l,p) => {
        if (l.trim().toUpperCase() === 'ADMIN' && p === '123') {
           setUser({ id: 'USR-ROOT', fullName: 'ADMINISTRADOR', login: 'ADMIN', profile: UserProfileType.ADMIN, email: 'root@cloud.com', status: 'ATIVO', createdAt: '' });
           setView('system');
           return null;
        }
        return 'CREDENCIAIS INVÁLIDAS';
      }} 
      onBack={() => setView('site')} 
      onRegister={() => null} 
    />
  );
  if (view === 'client-portal') return (
    <ClientPortal 
      clients={[...db.pf, ...db.pj]} 
      accounts={db.accounts} tickets={db.tickets} ratings={db.ratings} 
      onSaveTicket={t => updateDB('tickets', [...db.tickets.filter((x:any)=>x.id!==t.id), t])}
      onSaveRating={r => updateDB('ratings', [...db.ratings, r])}
      onSavePF={p => updateDB('pf', [...db.pf.filter((x:any)=>x.id!==p.id), p])}
      onSavePJ={p => updateDB('pj', [...db.pj.filter((x:any)=>x.id!==p.id), p])}
      onBack={() => setView('site')} 
    />
  );

  return (
    <Layout activeMenu={activeMenu} setActiveMenu={setActiveMenu} user={user!} onLogout={handleLogout}>
      {/* Cloud Status Bar */}
      <div className="fixed top-6 right-6 z-[100] flex items-center gap-4">
        {syncStatus === 'SAVING' ? (
          <div className="bg-white/90 backdrop-blur-xl border border-indigo-100 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-4">
             <RefreshCw size={14} className="text-indigo-600 animate-spin" />
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Salvando no Servidor...</span>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3">
             <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
             <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Conexão Ativa</span>
          </div>
        )}
      </div>

      {notification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[1000] w-[90%] md:w-auto animate-slide-up">
           <div className={`p-6 rounded-[30px] shadow-2xl flex items-center gap-5 border backdrop-blur-md ${notification.type === 'error' ? 'bg-red-50 border-red-200 text-red-900' : 'bg-white/95 border-slate-200 text-slate-900'}`}>
              {notification.type === 'error' ? <AlertCircle className="text-red-500" /> : <CheckCircle2 className="text-emerald-500" />}
              <p className="font-black text-[11px] uppercase tracking-tight flex-1">{notification.message}</p>
              <button onClick={() => setNotification(null)}><X size={18} /></button>
           </div>
        </div>
      )}

      {renderModule()}
    </Layout>
  );
};

export default App;
