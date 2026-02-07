
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { SupportTicket, ServiceRating, TicketMessage } from '../types.ts';
import LoadingButton from '../components/LoadingButton.tsx';
import { 
  Headset, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  Star, 
  MessageCircle,
  Trash2,
  ChevronLeft,
  Send,
  MoreVertical,
  Paperclip,
  Smile,
  AlertCircle,
  User,
  History
} from 'lucide-react';

interface Props {
  tickets: SupportTicket[];
  ratings: ServiceRating[];
  clients: any[];
  onSaveTicket: (t: SupportTicket) => void;
  onSaveRating: (r: ServiceRating) => void;
  onDeleteTicket: (id: string) => void;
}

const ServiceHubPage: React.FC<Props> = ({ tickets, ratings, clients, onSaveTicket, onSaveRating, onDeleteTicket }) => {
  const [activeTab, setActiveTab] = useState<'TICKETS' | 'FEEDBACK'>('TICKETS');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [formData, setFormData] = useState<Partial<SupportTicket>>({
    status: 'ABERTO', priority: 'MEDIA', clientName: '', unreadSupport: 0, unreadClient: 0
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const stats = useMemo(() => {
    const totalTickets = tickets.length;
    const openTickets = tickets.filter(t => t.status === 'ABERTO').length;
    const inProgress = tickets.filter(t => t.status === 'EM ANDAMENTO').length;
    const avgScore = ratings.length > 0 ? (ratings.reduce((a, b) => a + b.score, 0) / ratings.length).toFixed(1) : '0.0';
    return { totalTickets, openTickets, inProgress, avgScore };
  }, [tickets, ratings]);

  const activeTicket = useMemo(() => 
    tickets.find(t => t.id === selectedTicketId), 
  [selectedTicketId, tickets]);

  useEffect(() => {
    if (activeTicket && activeTicket.unreadSupport > 0) {
      onSaveTicket({ ...activeTicket, unreadSupport: 0 });
    }
  }, [selectedTicketId, activeTicket?.unreadSupport]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeTicket?.messages]);

  const handleSaveNewTicket = async () => {
    if (!formData.clientName || !formData.subject) return;
    
    const id = 'TKT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    const initialMessage: TicketMessage = {
      id: 'MSG-' + Math.random().toString(36).substr(2, 4),
      sender: 'SUPORTE',
      text: "OLÁ! INICIAMOS ESTE ATENDIMENTO. COMO POSSO AJUDAR?",
      timestamp: new Date().toISOString()
    };

    onSaveTicket({
      ...formData,
      id,
      messages: [initialMessage],
      unreadSupport: 0,
      unreadClient: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    } as SupportTicket);
    
    setSelectedTicketId(id);
    setShowForm(false);
    setFormData({ status: 'ABERTO', priority: 'MEDIA', clientName: '', unreadSupport: 0, unreadClient: 0 });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeTicket) return;
    
    const updatedTicket = {
      ...activeTicket,
      messages: [
        ...(activeTicket.messages || []),
        {
          id: 'MSG-' + Math.random().toString(36).substr(2, 4),
          sender: 'SUPORTE',
          text: newMessage.toUpperCase(),
          timestamp: new Date().toISOString()
        }
      ],
      unreadClient: (activeTicket.unreadClient || 0) + 1,
      updatedAt: new Date().toISOString()
    };

    onSaveTicket(updatedTicket as SupportTicket);
    setNewMessage('');
  };

  const updateTicketStatus = (status: any) => {
    if (!activeTicket) return;
    onSaveTicket({ ...activeTicket, status, updatedAt: new Date().toISOString() });
  };

  const filteredTickets = tickets.filter(t => 
    t.clientName.toUpperCase().includes(searchTerm.toUpperCase()) || 
    t.subject.toUpperCase().includes(searchTerm.toUpperCase())
  ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (showForm) {
    return (
      <div className="animate-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-rose-950 uppercase tracking-tighter">NOVO CHAT</h2>
            <p className="text-rose-400 font-bold uppercase text-[10px] tracking-widest mt-2">INICIAR CONVERSA INDEPENDENTE</p>
          </div>
          <button onClick={() => setShowForm(false)} className="px-8 py-3 rounded-2xl border-2 border-rose-100 font-black text-xs uppercase text-rose-400 hover:text-rose-600 transition-colors">CANCELAR</button>
        </div>

        <div className="bg-white p-12 rounded-[50px] border border-rose-100 shadow-xl space-y-10">
           <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NOME DO CLIENTE / INTERESSADO</label>
                 <input 
                   type="text" 
                   value={formData.clientName || ''} 
                   onChange={e => setFormData({...formData, clientName: e.target.value.toUpperCase()})}
                   className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-300 focus:bg-white rounded-2xl px-6 py-5 outline-none font-bold text-sm uppercase transition-all"
                   placeholder="DIGITE O NOME..."
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ASSUNTO DA CONVERSA</label>
                 <input 
                   type="text" 
                   value={formData.subject || ''} 
                   onChange={e => setFormData({...formData, subject: e.target.value.toUpperCase()})}
                   className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-300 focus:bg-white rounded-2xl px-6 py-5 outline-none font-bold text-sm uppercase transition-all"
                   placeholder="EX: DÚVIDA INICIAL"
                 />
              </div>
              <div className="md:col-span-2 space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RESUMO OU DESCRIÇÃO</label>
                 <textarea 
                   rows={4}
                   value={formData.description || ''} 
                   onChange={e => setFormData({...formData, description: e.target.value.toUpperCase()})}
                   className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-300 focus:bg-white rounded-[30px] px-8 py-6 outline-none font-bold text-sm uppercase transition-all resize-none"
                   placeholder="OPCIONAL: DETALHE O MOTIVO DA CONVERSA..."
                 />
              </div>
           </div>
           <div className="flex justify-end">
              <LoadingButton onAction={handleSaveNewTicket} className="h-20 w-full md:w-80 bg-rose-600 hover:bg-rose-700 text-white text-lg rounded-3xl uppercase tracking-widest shadow-2xl">
                INICIAR CHAT AGORA
              </LoadingButton>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 h-[calc(100vh-160px)] flex flex-col space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 shrink-0">
        <div>
          <h2 className="text-4xl font-black text-rose-950 uppercase tracking-tighter flex items-center gap-3">
            <Headset className="text-rose-600" size={40} /> SERVICE CONSOLE
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.3em] mt-2">CENTRAL DE MENSAGENS INDEPENDENTE</p>
        </div>
        
        <div className="flex gap-4 overflow-x-auto w-full lg:w-auto pb-2">
           <div className="flex bg-white p-1 rounded-2xl border border-slate-200">
              <button onClick={() => setActiveTab('TICKETS')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'TICKETS' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400'}`}>CHATS</button>
              <button onClick={() => setActiveTab('FEEDBACK')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'FEEDBACK' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400'}`}>NPS</button>
           </div>
           <button onClick={() => setShowForm(true)} className="bg-rose-600 text-white px-8 rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-700 shadow-xl transition-all active:scale-95 flex items-center gap-2">
             <Plus size={16} /> NOVO CHAT
          </button>
        </div>
      </div>

      {activeTab === 'TICKETS' ? (
        <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
          {/* Ticket Sidebar */}
          <div className={`w-full lg:w-96 flex flex-col gap-4 transition-all ${selectedTicketId ? 'hidden lg:flex' : 'flex'}`}>
            <div className="bg-white p-4 rounded-3xl border border-slate-100 flex items-center gap-3 shrink-0">
               <Search size={18} className="text-slate-300 ml-2" />
               <input 
                 type="text" 
                 placeholder="BUSCAR CONVERSA..." 
                 className="bg-transparent flex-1 font-black text-xs uppercase outline-none"
                 value={searchTerm}
                 onChange={e => setSearchTerm(e.target.value)}
               />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
               {filteredTickets.map(t => (
                 <button 
                   key={t.id}
                   onClick={() => setSelectedTicketId(t.id)}
                   className={`w-full p-6 rounded-[35px] text-left transition-all border relative overflow-hidden ${selectedTicketId === t.id ? 'bg-rose-600 text-white border-rose-500 shadow-xl' : 'bg-white border-slate-50 hover:border-rose-200 hover:bg-rose-50/30'}`}
                 >
                    {t.unreadSupport > 0 && selectedTicketId !== t.id && (
                       <div className="absolute top-4 right-4 w-6 h-6 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce shadow-lg border-2 border-white">
                          {t.unreadSupport}
                       </div>
                    )}
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-lg ${selectedTicketId === t.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>{t.status}</span>
                       <span className={`text-[8px] font-black ${selectedTicketId === t.id ? 'text-rose-200' : 'text-slate-300'}`}>{new Date(t.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <h3 className="font-black text-xs uppercase truncate leading-tight">{t.clientName}</h3>
                    <p className={`text-[9px] mt-1 font-bold uppercase truncate opacity-70`}>{t.subject}</p>
                 </button>
               ))}
               {filteredTickets.length === 0 && (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-50 p-10">
                    <MessageCircle size={48} className="mb-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma conversa ativa</p>
                 </div>
               )}
            </div>
          </div>

          {/* Chat Window */}
          <div className={`flex-1 bg-white rounded-[45px] border border-slate-100 shadow-sm flex flex-col overflow-hidden relative ${!selectedTicketId ? 'hidden lg:flex items-center justify-center text-center opacity-40' : 'flex'}`}>
             {activeTicket ? (
               <>
                 {/* Chat Header */}
                 <div className="px-10 py-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <div className="flex items-center gap-4">
                       <button onClick={() => setSelectedTicketId(null)} className="lg:hidden p-2 text-rose-600"><ChevronLeft size={24}/></button>
                       <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600">
                          <User size={24} />
                       </div>
                       <div>
                          <h3 className="font-black text-rose-950 uppercase text-sm tracking-tight">{activeTicket.clientName}</h3>
                          <div className="flex items-center gap-2">
                             <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">ASSUNTO: {activeTicket.subject}</span>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <select 
                         value={activeTicket.status} 
                         onChange={e => updateTicketStatus(e.target.value)}
                         className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[9px] font-black uppercase tracking-widest outline-none focus:border-rose-300"
                       >
                          <option value="ABERTO">ABERTO</option>
                          <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                          <option value="CONCLUIDO">CONCLUÍDO</option>
                       </select>
                       <button onClick={() => { if(window.confirm('EXCLUIR ATENDIMENTO?')) { onDeleteTicket(activeTicket.id); setSelectedTicketId(null); } }} className="p-3 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                    </div>
                 </div>

                 {/* Messages Area */}
                 <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-6 bg-slate-50/30">
                    {(activeTicket.messages || []).map((msg, i) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'SUPORTE' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}>
                        <div className={`max-w-[75%] flex flex-col ${msg.sender === 'SUPORTE' ? 'items-end' : 'items-start'}`}>
                           <div className={`px-6 py-4 rounded-[30px] font-bold text-xs leading-relaxed shadow-sm ${msg.sender === 'SUPORTE' ? 'bg-rose-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'}`}>
                              {msg.text}
                           </div>
                           <span className="text-[7px] font-black text-slate-400 uppercase mt-2 tracking-widest px-1">
                              {msg.sender} • {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                           </span>
                        </div>
                      </div>
                    ))}
                 </div>

                 {/* Input Area */}
                 <div className="p-8 border-t border-slate-50 bg-white">
                    <div className="flex items-center gap-4 bg-slate-50 rounded-[35px] px-6 py-2">
                       <button className="text-slate-300 hover:text-rose-600 transition-colors"><Paperclip size={18} /></button>
                       <input 
                         type="text" 
                         value={newMessage}
                         onChange={e => setNewMessage(e.target.value)}
                         onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                         className="flex-1 bg-transparent py-4 font-bold text-xs uppercase outline-none placeholder:text-slate-300"
                         placeholder="DIGITE SUA RESPOSTA..."
                       />
                       <button className="text-slate-300 hover:text-rose-600 transition-colors"><Smile size={18} /></button>
                       <button 
                         onClick={handleSendMessage}
                         disabled={!newMessage.trim()}
                         className="w-12 h-12 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100 hover:scale-105 active:scale-95 disabled:opacity-50 transition-all"
                       >
                          <Send size={20} />
                       </button>
                    </div>
                 </div>
               </>
             ) : (
               <div className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-slate-50 rounded-[35px] flex items-center justify-center text-slate-200 mb-6">
                    <Headset size={48} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Console de Atendimento</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Selecione uma conversa ou abra um novo chat</p>
               </div>
             )}
          </div>
        </div>
      ) : (
        <div className="flex-1 bg-white rounded-[45px] border border-slate-100 shadow-sm overflow-hidden flex flex-col animate-in fade-in duration-500">
           <div className="px-10 py-8 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center shrink-0">
              <h3 className="font-black text-slate-800 uppercase text-sm tracking-tight flex items-center gap-3"><Star className="text-amber-500" /> FEEDBACK DE SATISFAÇÃO (NPS)</h3>
              <div className="bg-amber-100 text-amber-700 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest">MÉDIA GERAL: {stats.avgScore}</div>
           </div>
           
           <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-slate-50 z-10 border-b border-slate-100">
                  <tr>
                    <th className="px-10 py-6 text-[9px] font-black uppercase text-slate-400 tracking-widest">CLIENTE / DATA</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase text-slate-400 tracking-widest">AVALIAÇÃO</th>
                    <th className="px-10 py-6 text-[9px] font-black uppercase text-slate-400 tracking-widest">CLASSIFICAÇÃO</th>
                    <th className="px-10 py-6 text-right text-[9px] font-black uppercase text-slate-400 tracking-widest">AÇÃO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ratings.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-6">
                        <p className="font-black text-slate-800 uppercase text-xs">{r.clientName}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">{new Date(r.date).toLocaleDateString()}</p>
                      </td>
                      <td className="px-10 py-6">
                         <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < r.score ? "text-amber-400 fill-amber-400" : "text-slate-100"} />)}
                         </div>
                      </td>
                      <td className="px-10 py-6">
                         <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${r.score >= 4 ? 'bg-emerald-50 text-emerald-600' : r.score === 3 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'}`}>
                            {r.score >= 4 ? 'PROMOTOR' : r.score === 3 ? 'NEUTRO' : 'DETRATOR'}
                         </span>
                      </td>
                      <td className="px-10 py-6 text-right">
                         <button onClick={() => { setSelectedTicketId(r.ticketId || null); setActiveTab('TICKETS'); }} className="p-2 text-slate-300 hover:text-rose-600 transition-colors" title="VER CONVERSA"><History size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {ratings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-10 py-20 text-center opacity-30">
                        <Star size={48} className="mx-auto mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma avaliação recebida ainda</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
        </div>
      )}
    </div>
  );
};

export default ServiceHubPage;
