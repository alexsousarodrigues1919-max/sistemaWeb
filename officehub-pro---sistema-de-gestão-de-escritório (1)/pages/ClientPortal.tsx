
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { SupportTicket, ServiceRating, TicketMessage, PhysicalPerson, LegalPerson, ClientAccount, Invoice } from '../types.ts';
import LoadingButton from '../components/LoadingButton.tsx';
import { maskCPF, maskCNPJ, maskPhone } from '../utils/masks.ts';
import { 
  Headset, 
  Plus, 
  LogOut, 
  ArrowLeft,
  MessageCircle,
  Send,
  MoreVertical,
  User,
  Paperclip,
  Smile,
  ChevronLeft,
  UserPlus,
  ShieldCheck,
  Building2,
  Lock,
  LayoutDashboard,
  CreditCard,
  UserCircle,
  ArrowRight,
  TrendingUp,
  History,
  AlertCircle,
  LogIn,
  AlertTriangle,
  CheckCircle2,
  FileText,
  DollarSign,
  Calendar,
  Wallet,
  Clock,
  ChevronDown
} from 'lucide-react';

interface Props {
  clients: any[];
  accounts: ClientAccount[];
  tickets: SupportTicket[];
  ratings: ServiceRating[];
  onSaveTicket: (t: SupportTicket) => void;
  onSaveRating: (r: ServiceRating) => void;
  onSavePF: (p: PhysicalPerson) => void;
  onSavePJ: (p: LegalPerson) => void;
  onBack: () => void;
}

const ClientPortal: React.FC<Props> = ({ clients, accounts, tickets, ratings, onSaveTicket, onSaveRating, onSavePF, onSavePJ, onBack }) => {
  const [view, setView] = useState<'WELCOME' | 'REGISTER' | 'SYSTEM'>('WELCOME');
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'FINANCE' | 'SUPPORT' | 'PROFILE'>('DASHBOARD');
  const [loggedClientData, setLoggedClientData] = useState<any>(null);
  
  // Estados de Login
  const [loginDoc, setLoginDoc] = useState('');
  const [loginType, setLoginType] = useState<'CPF' | 'CNPJ'>('CPF');
  const [error, setError] = useState('');
  
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isNewTicketModal, setIsNewTicketModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newTicketData, setNewTicketData] = useState({ subject: '', description: '', priority: 'MEDIA' });
  const [financeFilter, setFinanceFilter] = useState<'TODOS' | 'PAGO' | 'PENDENTE'>('TODOS');

  // Estado de Cadastro
  const [regType, setRegType] = useState<'FISICA' | 'JURIDICA'>('FISICA');
  const [regPF, setRegPF] = useState<Partial<PhysicalPerson>>({ type: 'FISICA' });
  const [regPJ, setRegPJ] = useState<Partial<LegalPerson>>({ type: 'JURIDICA' });
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filtra dados do cliente logado para tickets e contas
  const clientTickets = useMemo(() => {
    if (!loggedClientData) return [];
    const name = loggedClientData.fullName || loggedClientData.companyName;
    return tickets.filter(t => t.clientName.toUpperCase() === name.toUpperCase()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [tickets, loggedClientData]);

  const clientAccount = useMemo(() => {
    if (!loggedClientData) return null;
    return accounts.find(acc => acc.clientId === loggedClientData.id);
  }, [accounts, loggedClientData]);

  const filteredInvoices = useMemo(() => {
    const invs = clientAccount?.invoices || [];
    if (financeFilter === 'TODOS') return invs.sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    return invs.filter(i => i.status === financeFilter).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  }, [clientAccount?.invoices, financeFilter]);

  const activeTicket = useMemo(() => 
    clientTickets.find(t => t.id === selectedTicketId), 
  [selectedTicketId, clientTickets]);

  useEffect(() => {
    if (activeTicket && activeTicket.unreadClient > 0) {
      onSaveTicket({ ...activeTicket, unreadClient: 0 });
    }
  }, [selectedTicketId, activeTicket?.unreadClient]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTicket?.messages]);

  const handleLogin = async () => {
    setError('');
    if (!loginDoc) {
      setError('POR FAVOR, INSIRA O DOCUMENTO DE ACESSO.');
      return;
    }

    const found = clients.find(c => (c.cpf === loginDoc) || (c.cnpj === loginDoc));

    if (found) {
      setLoggedClientData(found);
      setView('SYSTEM');
    } else {
      setError('CADASTRO NÃO ENCONTRADO. REALIZE O CADASTRO ABAIXO.');
    }
  };

  const handleRegisterSave = async () => {
    setError('');
    if (regType === 'FISICA') {
      if (!regPF.fullName || !regPF.cpf || !regPF.phonePrincipal) {
        setError('NOME, CPF E TELEFONE SÃO OBRIGATÓRIOS.');
        return;
      }
      const id = 'PF-AUTO-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      const p = { ...regPF, id, createdAt: new Date().toISOString() } as PhysicalPerson;
      onSavePF(p);
      setLoggedClientData(p);
    } else {
      if (!regPJ.companyName || !regPJ.cnpj || !regPJ.comercialPhone) {
        setError('RAZÃO SOCIAL, CNPJ E TELEFONE SÃO OBRIGATÓRIOS.');
        return;
      }
      const id = 'PJ-AUTO-' + Math.random().toString(36).substr(2, 6).toUpperCase();
      const p = { ...regPJ, id, createdAt: new Date().toISOString() } as LegalPerson;
      onSavePJ(p);
      setLoggedClientData(p);
    }
    setView('SYSTEM');
  };

  const handleCreateTicket = async () => {
    if (!newTicketData.subject || !newTicketData.description || !loggedClientData) return;
    
    const ticketId = 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const name = loggedClientData.fullName || loggedClientData.companyName;
    const initialMessage: TicketMessage = {
      id: 'MSG-' + Math.random().toString(36).substr(2, 4),
      sender: 'CLIENTE',
      text: newTicketData.description.toUpperCase(),
      timestamp: new Date().toISOString()
    };

    onSaveTicket({
      id: ticketId,
      clientName: name.toUpperCase(),
      subject: newTicketData.subject.toUpperCase(),
      description: newTicketData.description.toUpperCase(),
      status: 'ABERTO',
      priority: newTicketData.priority as any,
      messages: [initialMessage],
      unreadSupport: 1,
      unreadClient: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as SupportTicket);
    
    setIsNewTicketModal(false);
    setSelectedTicketId(ticketId);
    setNewTicketData({ subject: '', description: '', priority: 'MEDIA' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeTicket) return;
    
    const updatedTicket = {
      ...activeTicket,
      messages: [
        ...(activeTicket.messages || []),
        {
          id: 'MSG-' + Math.random().toString(36).substr(2, 4),
          sender: 'CLIENTE',
          text: newMessage.toUpperCase(),
          timestamp: new Date().toISOString()
        }
      ],
      unreadSupport: (activeTicket.unreadSupport || 0) + 1,
      updatedAt: new Date().toISOString()
    };

    onSaveTicket(updatedTicket as SupportTicket);
    setNewMessage('');
  };

  if (view === 'WELCOME') {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white rounded-[60px] shadow-2xl p-16 border border-rose-100 animate-in zoom-in-95 duration-700">
           <button onClick={onBack} className="mb-10 text-rose-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-rose-600 transition-colors mx-auto">
             <ArrowLeft size={16} /> Voltar ao Site
           </button>
           
           <div className="text-center mb-10">
              <div className="w-20 h-20 bg-rose-600 rounded-[30px] text-white flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-rose-200">
                 <ShieldCheck size={40} />
              </div>
              <h2 className="text-3xl font-black text-rose-950 uppercase tracking-tighter leading-none mb-2">ÁREA DO CLIENTE</h2>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em]">Autenticação de Segurança</p>
           </div>

           <div className="space-y-6">
              <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl mb-4">
                 <button 
                   onClick={() => { setLoginType('CPF'); setLoginDoc(''); setError(''); }}
                   className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${loginType === 'CPF' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}
                 >
                   PESSOA FÍSICA (CPF)
                 </button>
                 <button 
                   onClick={() => { setLoginType('CNPJ'); setLoginDoc(''); setError(''); }}
                   className={`flex-1 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${loginType === 'CNPJ' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}
                 >
                   PESSOA JURÍDICA (CNPJ)
                 </button>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block ml-2">DOCUMENTO DE IDENTIFICAÇÃO</label>
                 <input 
                   type="text" 
                   value={loginDoc}
                   onChange={e => setLoginDoc(loginType === 'CPF' ? maskCPF(e.target.value) : maskCNPJ(e.target.value))}
                   className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 rounded-[28px] px-8 py-6 font-bold text-xl text-center outline-none transition-all placeholder:text-slate-200 shadow-inner"
                   placeholder={loginType === 'CPF' ? '000.000.000-00' : '00.000.000/0000-00'}
                 />
              </div>

              {error && <p className="text-red-500 text-[10px] font-black uppercase text-center py-2 animate-in fade-in">{error}</p>}

              <LoadingButton onAction={handleLogin} className="w-full h-20 bg-rose-600 text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-rose-100 hover:bg-rose-700 flex items-center justify-center gap-3">
                 <LogIn size={20} /> ACESSAR MINHA ÁREA
              </LoadingButton>

              <div className="relative py-4 flex items-center justify-center">
                 <div className="absolute w-full h-[1px] bg-slate-100"></div>
                 <span className="relative bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Ainda não possui cadastro?</span>
              </div>

              <button 
                onClick={() => setView('REGISTER')}
                className="w-full py-6 border-2 border-rose-100 text-rose-600 rounded-[28px] font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-3"
              >
                 <UserPlus size={18} /> REALIZE O CADASTRO COMPLETO
              </button>
           </div>
        </div>
      </div>
    );
  }

  if (view === 'REGISTER') {
    return (
      <div className="min-h-screen bg-rose-50 flex items-center justify-center p-6 py-20 overflow-y-auto">
         <div className="w-full max-w-2xl bg-white rounded-[60px] shadow-2xl p-16 border border-rose-100 animate-in slide-in-from-bottom-8 duration-700">
            <button onClick={() => setView('WELCOME')} className="mb-10 text-rose-400 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:text-rose-600 transition-colors">
              <ArrowLeft size={16} /> Voltar
            </button>
            <div className="mb-12">
               <h2 className="text-4xl font-black text-rose-950 uppercase tracking-tighter leading-none">CRIAR CONTA</h2>
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">DADOS DE IDENTIFICAÇÃO OBRIGATÓRIOS</p>
            </div>
            <div className="flex gap-4 mb-10 bg-slate-50 p-2 rounded-3xl">
               <button onClick={() => setRegType('FISICA')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${regType === 'FISICA' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-rose-600'}`}>
                 <User size={16} /> PESSOA FÍSICA
               </button>
               <button onClick={() => setRegType('JURIDICA')} className={`flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${regType === 'JURIDICA' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-rose-600'}`}>
                 <Building2 size={16} /> PESSOA JURÍDICA
               </button>
            </div>
            <div className="space-y-6">
               {regType === 'FISICA' ? (
                 <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NOME COMPLETO</label>
                       <input type="text" value={regPF.fullName || ''} onChange={e => setRegPF({...regPF, fullName: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 rounded-2xl px-6 py-5 font-bold outline-none uppercase shadow-sm" placeholder="DIGITE SEU NOME" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CPF</label>
                       <input type="text" value={regPF.cpf || ''} onChange={e => setRegPF({...regPF, cpf: maskCPF(e.target.value)})} className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 rounded-2xl px-6 py-5 font-bold outline-none shadow-sm" placeholder="000.000.000-00" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TELEFONE</label>
                       <input type="text" value={regPF.phonePrincipal || ''} onChange={e => setRegPF({...regPF, phonePrincipal: maskPhone(e.target.value)})} className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 rounded-2xl px-6 py-5 font-bold outline-none shadow-sm" placeholder="(00) 00000-0000" />
                    </div>
                 </div>
               ) : (
                 <div className="grid md:grid-cols-2 gap-6 animate-in fade-in">
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RAZÃO SOCIAL</label>
                       <input type="text" value={regPJ.companyName || ''} onChange={e => setRegPJ({...regPJ, companyName: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 rounded-2xl px-6 py-5 font-bold outline-none uppercase shadow-sm" placeholder="NOME DA EMPRESA" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CNPJ</label>
                       <input type="text" value={regPJ.cnpj || ''} onChange={e => setRegPJ({...regPJ, cnpj: maskCNPJ(e.target.value)})} className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 rounded-2xl px-6 py-5 font-bold outline-none shadow-sm" placeholder="00.000.000/0000-00" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TEL. COMERCIAL</label>
                       <input type="text" value={regPJ.comercialPhone || ''} onChange={e => setRegPJ({...regPJ, comercialPhone: maskPhone(e.target.value)})} className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 rounded-2xl px-6 py-5 font-bold outline-none shadow-sm" placeholder="(00) 0000-0000" />
                    </div>
                 </div>
               )}
               {error && <p className="text-red-600 text-[10px] font-black uppercase text-center py-2 animate-bounce">{error}</p>}
               <div className="pt-8">
                  <LoadingButton onAction={handleRegisterSave} className="w-full h-24 bg-rose-600 text-white text-xs tracking-[0.2em] rounded-3xl shadow-2xl shadow-rose-100 uppercase">
                    CRIAR MINHA CONTA E ACESSAR DASHBOARD
                  </LoadingButton>
               </div>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 flex overflow-hidden font-sans">
      <aside className="w-24 md:w-72 bg-rose-950 text-white flex flex-col shadow-2xl z-20">
        <div className="p-8 hidden md:block text-center border-b border-rose-900/50">
           <div className="flex items-center justify-center gap-3 mb-2">
              <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg"><ShieldCheck size={24} /></div>
              <span className="font-black text-lg tracking-tighter uppercase">CLIENTE<span className="text-rose-500">PRO</span></span>
           </div>
           <p className="text-[8px] font-black text-rose-500 tracking-[0.3em] uppercase">Sessão Segura</p>
        </div>
        
        <div className="flex-1 px-4 py-8 space-y-2">
           {[
             { id: 'DASHBOARD', label: 'INÍCIO', icon: LayoutDashboard },
             { id: 'FINANCE', label: 'FINANCEIRO', icon: CreditCard },
             { id: 'SUPPORT', label: 'SUPORTE', icon: MessageCircle, badge: clientTickets.some(t => t.unreadClient > 0) },
             { id: 'PROFILE', label: 'MEU PERFIL', icon: UserCircle },
           ].map(item => (
             <button
               key={item.id}
               onClick={() => { setActiveTab(item.id as any); setSelectedTicketId(null); }}
               className={`w-full flex flex-col md:flex-row items-center gap-4 px-4 py-5 rounded-[20px] transition-all relative ${activeTab === item.id ? 'bg-rose-600 text-white shadow-xl shadow-rose-900/50' : 'text-rose-300 hover:bg-rose-900/40'}`}
             >
               <item.icon size={24} />
               <span className="hidden md:block font-black text-[10px] tracking-widest uppercase">{item.label}</span>
               {item.badge && <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-400 border-2 border-rose-950 rounded-full animate-pulse shadow-lg" />}
             </button>
           ))}
        </div>

        <div className="p-6 border-t border-rose-900 flex items-center justify-between">
           <div className="hidden md:flex flex-col overflow-hidden">
              <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Cliente Autenticado</span>
              <span className="text-xs font-bold truncate max-w-[150px] uppercase">{(loggedClientData?.fullName || loggedClientData?.companyName)?.split(' ')[0]}</span>
           </div>
           <button onClick={() => { setLoggedClientData(null); setView('WELCOME'); setLoginDoc(''); }} className="p-3 bg-rose-900 hover:bg-red-600 rounded-xl transition-colors shadow-lg"><LogOut size={20} /></button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative bg-[#fcfcfd]">
        <div className="max-w-7xl mx-auto p-10 space-y-10">
           
           {activeTab === 'DASHBOARD' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                   <div>
                      <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">BEM-VINDO, { (loggedClientData?.fullName || loggedClientData?.companyName)?.split(' ')[0] }</h1>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Painel de Acompanhamento em Tempo Real</p>
                   </div>
                </header>

                {clientAccount && parseFloat(clientAccount.totalDebt) > 0 && (
                   <div className="bg-red-600 rounded-[35px] p-10 text-white shadow-2xl shadow-red-100 animate-pulse flex flex-col md:flex-row items-center justify-between gap-8 border-4 border-red-400">
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center shrink-0">
                            <AlertTriangle size={32} />
                         </div>
                         <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter leading-none">Atenção: Débito em Aberto</h2>
                            <p className="text-red-100 text-xs font-bold uppercase mt-2 opacity-80 tracking-widest">Você possui faturas pendentes que requerem sua atenção para regularização dos serviços.</p>
                         </div>
                      </div>
                      <div className="bg-white text-red-600 px-10 py-5 rounded-[25px] font-black text-xl tracking-tighter shadow-xl">
                         R$ {clientAccount.totalDebt}
                      </div>
                   </div>
                )}

                <div className="grid md:grid-cols-3 gap-8">
                   <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500">
                      <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform"><CreditCard size={32} /></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Saldo em Conta</p>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter">R$ {clientAccount?.balance || '0,00'}</h3>
                      <div className={`mt-6 flex items-center gap-2 text-[9px] font-black px-3 py-1.5 rounded-full w-fit ${clientAccount?.status === 'REGULAR' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                         <TrendingUp size={12} /> SITUAÇÃO: {clientAccount?.status || 'REGULAR'}
                      </div>
                   </div>

                   <div className="bg-white p-10 rounded-[45px] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500">
                      <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform"><FileText size={32} /></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Faturas Pendentes</p>
                      <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{(clientAccount?.invoices || []).filter(i=>i.status === 'PENDENTE').length.toString().padStart(2, '0')}</h3>
                      <button onClick={() => setActiveTab('FINANCE')} className="mt-6 text-[9px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">VER EXTRATO <ArrowRight size={12} /></button>
                   </div>

                   <div className="bg-rose-600 p-10 rounded-[45px] shadow-2xl shadow-rose-200 text-white group hover:scale-[1.02] transition-all duration-500 relative overflow-hidden">
                      <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12"><ShieldCheck size={180} /></div>
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-6"><ShieldCheck size={32} /></div>
                        <p className="text-[10px] font-black text-rose-200 uppercase tracking-widest mb-1">Segurança</p>
                        <h3 className="text-2xl font-black leading-tight tracking-tighter uppercase">PORTAL 100% SEGURO</h3>
                        <p className="text-[10px] font-bold mt-4 opacity-60">ID ACESSO: {loggedClientData.id}</p>
                      </div>
                   </div>
                </div>

                <div className="bg-white p-12 rounded-[55px] border border-slate-100 shadow-sm">
                   <div className="flex justify-between items-center mb-10">
                      <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3"><History className="text-rose-600" /> Últimas Cobranças</h3>
                      <button onClick={() => setActiveTab('FINANCE')} className="bg-rose-50 text-rose-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-100 transition-colors">Ver Financeiro Completo</button>
                   </div>
                   <div className="space-y-4">
                      {(clientAccount?.invoices || []).slice(0, 3).map(inv => (
                        <div key={inv.id} className="flex items-center justify-between p-6 rounded-[30px] bg-slate-50 border border-transparent hover:border-rose-100 transition-all group">
                           <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${inv.status === 'PAGO' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                 {inv.status === 'PAGO' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                              </div>
                              <div>
                                 <h4 className="font-black text-slate-800 text-xs uppercase">{inv.description}</h4>
                                 <p className="text-[9px] font-black text-slate-400 uppercase mt-1">Vencimento: {new Date(inv.dueDate).toLocaleDateString()}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-8">
                              <p className={`font-black text-sm ${inv.status === 'PAGO' ? 'text-emerald-600' : 'text-red-600'}`}>R$ {inv.value}</p>
                              <span className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest ${inv.status === 'PAGO' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{inv.status}</span>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'FINANCE' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-700">
                <header>
                   <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Extrato Financeiro</h1>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Relação Detalhada de Pagamentos e Débitos</p>
                </header>

                <div className="grid md:grid-cols-4 gap-6">
                   <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4"><Wallet size={24}/></div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Saldo Disponível</p>
                      <p className="text-2xl font-black text-emerald-600">R$ {clientAccount?.balance || '0,00'}</p>
                   </div>
                   <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mb-4"><AlertTriangle size={24}/></div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Devedor</p>
                      <p className="text-2xl font-black text-rose-600">R$ {clientAccount?.totalDebt || '0,00'}</p>
                   </div>
                   <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4"><CheckCircle2 size={24}/></div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Faturas Pagas</p>
                      <p className="text-2xl font-black text-slate-800">{(clientAccount?.invoices || []).filter(i=>i.status==='PAGO').length}</p>
                   </div>
                   <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
                      <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-4"><Clock size={24}/></div>
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Aguardando Pagto.</p>
                      <p className="text-2xl font-black text-slate-800">{(clientAccount?.invoices || []).filter(i=>i.status==='PENDENTE').length}</p>
                   </div>
                </div>

                <div className="bg-white rounded-[50px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                   <div className="px-10 py-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-3">
                         <FileText className="text-rose-600" />
                         <h3 className="text-xl font-black uppercase tracking-tighter">Histórico de Cobranças</h3>
                      </div>
                      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                         {['TODOS', 'PENDENTE', 'PAGO'].map(f => (
                           <button 
                             key={f}
                             onClick={() => setFinanceFilter(f as any)}
                             className={`px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${financeFilter === f ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                           >
                              {f === 'TODOS' ? 'VER TUDO' : f}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="flex-1 p-8 space-y-4">
                      {filteredInvoices.map(inv => (
                        <div key={inv.id} className={`flex flex-col md:flex-row items-center justify-between p-8 rounded-[35px] border-2 transition-all ${inv.status === 'PAGO' ? 'bg-slate-50/50 border-transparent opacity-60' : 'bg-white border-rose-50 shadow-sm'}`}>
                           <div className="flex items-center gap-8 w-full md:w-auto">
                              <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner ${inv.status === 'PAGO' ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                                 {inv.status === 'PAGO' ? <CheckCircle2 size={32} /> : <Calendar size={32} />}
                              </div>
                              <div className="flex-1">
                                 <h4 className="font-black text-slate-800 text-lg uppercase tracking-tight">{inv.description}</h4>
                                 <div className="flex flex-wrap items-center gap-4 mt-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1"><Clock size={12}/> VENC: {new Date(inv.dueDate).toLocaleDateString()}</p>
                                    {inv.status === 'PAGO' && <p className="text-[10px] font-black text-emerald-600 uppercase">LIQUIDADO EM: {new Date(inv.paidAt!).toLocaleDateString()}</p>}
                                 </div>
                              </div>
                           </div>
                           <div className="flex items-center gap-10 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                              <p className={`text-2xl font-black tracking-tighter ${inv.status === 'PAGO' ? 'text-emerald-600' : 'text-rose-600'}`}>R$ {inv.value}</p>
                              <div className={`px-6 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] ${inv.status === 'PAGO' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                 {inv.status}
                              </div>
                           </div>
                        </div>
                      ))}
                      {filteredInvoices.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
                           <DollarSign size={64} className="mb-4" />
                           <p className="text-xl font-black uppercase tracking-widest">Nenhum lançamento encontrado</p>
                        </div>
                      )}
                   </div>
                </div>
             </div>
           )}

           {activeTab === 'SUPPORT' && (
             <div className="h-[calc(100vh-140px)] flex gap-6 overflow-hidden animate-in fade-in slide-in-from-left-4 duration-700">
                <div className={`w-full lg:w-96 flex flex-col gap-4 transition-all ${selectedTicketId ? 'hidden lg:flex' : 'flex'}`}>
                   <div className="flex justify-between items-center px-4">
                      <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">Suas Conversas</h3>
                      <button onClick={() => setIsNewTicketModal(true)} className="w-10 h-10 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg"><Plus size={20} /></button>
                   </div>
                   <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
                      {clientTickets.map(t => (
                        <button 
                          key={t.id}
                          onClick={() => setSelectedTicketId(t.id)}
                          className={`w-full p-6 rounded-[35px] text-left transition-all relative border ${selectedTicketId === t.id ? 'bg-rose-600 text-white shadow-xl translate-x-1' : 'bg-white border-slate-100 hover:bg-rose-50'}`}
                        >
                           {t.unreadClient > 0 && selectedTicketId !== t.id && (
                             <div className="absolute top-4 right-4 w-6 h-6 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce border-2 border-white shadow-lg">{t.unreadClient}</div>
                           )}
                           <h4 className="font-black text-xs uppercase truncate pr-8">{t.subject}</h4>
                           <p className={`text-[9px] mt-1 font-bold truncate opacity-60`}>{t.description}</p>
                           <div className="flex justify-between items-center mt-4">
                              <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded ${selectedTicketId === t.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>{t.status}</span>
                              <span className={`text-[7px] font-black opacity-40 uppercase`}>{new Date(t.updatedAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                           </div>
                        </button>
                      ))}
                   </div>
                </div>

                <div className={`flex-1 bg-white rounded-[50px] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative ${!selectedTicketId ? 'hidden lg:flex items-center justify-center text-center opacity-30' : 'flex'}`}>
                   {activeTicket ? (
                     <>
                        <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/20 backdrop-blur-md sticky top-0 z-10">
                           <div className="flex items-center gap-4">
                              <button onClick={() => setSelectedTicketId(null)} className="lg:hidden p-2 text-rose-600"><ChevronLeft size={24}/></button>
                              <div className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100"><Headset size={24} /></div>
                              <div>
                                 <h3 className="font-black text-slate-800 uppercase text-sm tracking-tighter">{activeTicket.subject}</h3>
                                 <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> Suporte Oficial</span>
                              </div>
                           </div>
                        </div>
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 bg-slate-50/10">
                           {activeTicket.messages?.map(msg => (
                             <div key={msg.id} className={`flex ${msg.sender === 'CLIENTE' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                                <div className={`max-w-[70%] flex flex-col ${msg.sender === 'CLIENTE' ? 'items-end' : 'items-start'}`}>
                                   <div className={`px-6 py-4 rounded-[30px] font-bold text-xs leading-relaxed shadow-sm ${msg.sender === 'CLIENTE' ? 'bg-rose-600 text-white rounded-br-none shadow-rose-100' : 'bg-white border border-slate-100 text-slate-800 rounded-bl-none'}`}>{msg.text}</div>
                                   <span className="text-[7px] font-black text-slate-400 uppercase mt-2 tracking-widest px-2">{msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                                </div>
                             </div>
                           ))}
                        </div>
                        <div className="p-8 border-t border-slate-50 bg-white">
                           {activeTicket.status === 'CONCLUIDO' ? (
                             <div className="bg-emerald-50 p-6 rounded-[30px] text-center border border-emerald-100">
                                <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Este atendimento foi finalizado com sucesso!</p>
                             </div>
                           ) : (
                             <div className="flex items-center gap-4 bg-slate-50 rounded-[40px] px-6 py-2 border border-transparent focus-within:border-rose-200 focus-within:bg-white transition-all shadow-inner">
                                <button className="text-slate-300 hover:text-rose-600 transition-colors"><Paperclip size={18} /></button>
                                <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} className="flex-1 bg-transparent py-4 font-bold text-xs uppercase outline-none placeholder:text-slate-300" placeholder="DIGITE SUA RESPOSTA..." />
                                <button onClick={handleSendMessage} disabled={!newMessage.trim()} className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg active:scale-95 disabled:opacity-50 transition-all"><Send size={20} /></button>
                             </div>
                           )}
                        </div>
                     </>
                   ) : (
                     <div className="flex flex-col items-center">
                        <MessageCircle size={64} className="text-slate-100 mb-6" />
                        <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest">Selecione uma conversa ativa</h3>
                     </div>
                   )}
                </div>
             </div>
           )}

           {activeTab === 'PROFILE' && (
             <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <header>
                   <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">Meu Perfil</h1>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Dados Cadastrais e Segurança</p>
                </header>

                <div className="bg-white rounded-[50px] shadow-sm border border-slate-100 overflow-hidden">
                   <div className="h-32 bg-rose-600" />
                   <div className="px-12 pb-12">
                      <div className="relative -mt-16 mb-10">
                         <div className="w-32 h-32 rounded-[35px] bg-white p-3 shadow-2xl">
                            <div className="w-full h-full rounded-[22px] bg-rose-50 text-rose-600 flex items-center justify-center text-4xl font-black border-4 border-rose-100 uppercase">
                               { (loggedClientData?.fullName || loggedClientData?.companyName)?.[0] }
                            </div>
                         </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-12">
                         <div className="space-y-8">
                            <div>
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Identificação Principal</label>
                               <h4 className="text-2xl font-black text-slate-800 uppercase leading-tight">{loggedClientData?.fullName || loggedClientData?.companyName}</h4>
                            </div>
                            <div>
                               <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{loggedClientData?.type === 'FISICA' ? 'CPF' : 'CNPJ'}</label>
                               <h4 className="text-lg font-black text-slate-600">{loggedClientData?.cpf || loggedClientData?.cnpj}</h4>
                            </div>
                         </div>
                         <div className="bg-slate-50 p-10 rounded-[40px] border-2 border-slate-100 flex flex-col justify-center text-center space-y-6">
                            <ShieldCheck size={48} className="text-rose-600 mx-auto" />
                            <h4 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Sessão Autenticada</h4>
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">Seu cadastro está vinculado ao banco de dados central. Mantenha seus dados sempre atualizados.</p>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
           )}

        </div>
      </main>

      {isNewTicketModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-rose-950/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="w-full max-w-xl bg-white rounded-[60px] shadow-2xl p-12 animate-in slide-in-from-bottom-10 duration-500">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter text-center mb-10 leading-none">Nova Solicitação</h2>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Assunto Principal</label>
                    <input type="text" value={newTicketData.subject} onChange={e => setNewTicketData({...newTicketData, subject: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 rounded-2xl px-6 py-5 font-bold outline-none uppercase shadow-sm" placeholder="EX: DÚVIDA JURÍDICA" />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Descreva sua necessidade</label>
                    <textarea rows={5} value={newTicketData.description} onChange={e => setNewTicketData({...newTicketData, description: e.target.value.toUpperCase()})} className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-600 rounded-[30px] px-8 py-8 font-bold outline-none uppercase resize-none shadow-sm" placeholder="DETALHE AQUI O QUE VOCÊ PRECISA..." />
                 </div>
                 <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button onClick={() => setIsNewTicketModal(false)} className="flex-1 h-20 rounded-3xl border-2 border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Cancelar</button>
                    <LoadingButton onAction={handleCreateTicket} className="flex-[2] h-20 bg-rose-600 text-white rounded-3xl text-xs tracking-widest shadow-xl shadow-rose-200">INICIAR ATENDIMENTO</LoadingButton>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClientPortal;
