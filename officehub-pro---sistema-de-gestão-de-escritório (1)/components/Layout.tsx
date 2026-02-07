
import React, { useState } from 'react';
import { 
  Users, 
  Briefcase, 
  Calendar, 
  Layers, 
  UserCircle, 
  Settings, 
  LogOut,
  Building2,
  BookOpen,
  MessageSquare,
  Clock,
  LayoutDashboard,
  Headset,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  user: any;
  onLogout: () => void;
  officeName?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeMenu, setActiveMenu, user, onLogout, officeName = 'OFFICEHUB PRO' }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard, profiles: ['ADMINISTRADOR', 'REUNIÃO', 'ATENDIMENTOS', 'USUÁRIO'] },
    { id: 'clientes', label: 'CLIENTES', icon: Users, profiles: ['ADMINISTRADOR', 'USUÁRIO'] },
    { id: 'empresas', label: 'EMPRESAS', icon: Building2, profiles: ['ADMINISTRADOR', 'USUÁRIO'] },
    { id: 'contas', label: 'CONTA CLIENTES', icon: Briefcase, profiles: ['ADMINISTRADOR'] },
    { id: 'profissionais', label: 'PROFISSIONAL', icon: UserCircle, profiles: ['ADMINISTRADOR'] },
    { id: 'servicehub', label: 'SERVICE HUB', icon: Headset, profiles: ['ADMINISTRADOR', 'ATENDIMENTOS'] },
    { id: 'agenda', label: 'AGENDA NOTAÇÃO', icon: BookOpen, profiles: ['ADMINISTRADOR', 'USUÁRIO'] },
    { id: 'planejamento', label: 'PLANEJAMENTO', icon: Layers, profiles: ['ADMINISTRADOR', 'USUÁRIO'] },
    { id: 'reunioes', label: 'MARCAR REUNIÃO', icon: MessageSquare, profiles: ['ADMINISTRADOR', 'REUNIÃO'] },
    { id: 'atendimentos', label: 'MARCAR ATENDIMENTO', icon: Clock, profiles: ['ADMINISTRADOR', 'ATENDIMENTOS'] },
    { id: 'perfil', label: 'PERFIL', icon: UserCircle, profiles: ['ADMINISTRADOR', 'REUNIÃO', 'ATENDIMENTOS', 'USUÁRIO'] },
    { id: 'configuracoes', label: 'CONFIGURAÇÃO', icon: Settings, profiles: ['ADMINISTRADOR'] },
  ];

  const filteredMenu = menuItems.filter(item => item.profiles.includes(user.profile));

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 lg:bg-indigo-950 text-white">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-2xl">
              <ShieldCheck size={24} />
           </div>
           <div>
              <h1 className="text-xl font-black tracking-tighter uppercase leading-none">{officeName.split(' ')[0]}</h1>
              <p className="text-indigo-400 text-[8px] font-black tracking-[0.3em] uppercase mt-1">SISTEMA CONECTADO</p>
           </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-hide">
        {filteredMenu.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveMenu(item.id);
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 ${
              activeMenu === item.id 
                ? 'bg-indigo-600 text-white shadow-xl scale-[1.02]' 
                : 'text-indigo-300 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon size={20} className={activeMenu === item.id ? 'text-white' : 'text-indigo-500'} />
              <span className="font-black text-[10px] tracking-widest uppercase">{item.label}</span>
            </div>
            {activeMenu === item.id && <ChevronRight size={14} className="opacity-50" />}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-xl font-black shadow-inner">
            {user.fullName[0].toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black truncate uppercase text-white">{user.fullName}</p>
            <p className="text-[8px] text-indigo-400 uppercase font-black tracking-widest mt-0.5">{user.profile}</p>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl bg-red-900/30 text-red-400 hover:bg-red-900/50 transition-all text-[9px] font-black uppercase tracking-widest"
        >
          <LogOut size={16} /> ENCERRAR SESSÃO
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-80 flex-col z-30 shadow-2xl">
        <SidebarContent />
      </aside>

      {/* Mobile Backdrop & Drawer */}
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-opacity duration-300 lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsSidebarOpen(false)}
      />
      <aside className={`fixed inset-y-0 left-0 w-80 z-[101] lg:hidden transform transition-transform duration-500 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-6 -right-12 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl"
        >
          <X size={20} />
        </button>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                <ShieldCheck size={20} />
             </div>
             <span className="font-black text-sm tracking-tighter uppercase">{officeName}</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-slate-50 text-indigo-600 rounded-xl border border-slate-100 active:scale-95 transition-transform"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto bg-[#fcfcfd] p-4 md:p-10 scrollbar-hide">
          <div className="max-w-7xl mx-auto h-full pb-20 md:pb-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
