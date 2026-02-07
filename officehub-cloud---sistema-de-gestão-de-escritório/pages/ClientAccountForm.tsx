
import React, { useState, useMemo } from 'react';
import { ClientAccount, Invoice } from '../types.ts';
import LoadingButton from '../components/LoadingButton.tsx';
import { Plus, Edit3, Trash2, AlertTriangle, CheckCircle2, XCircle, DollarSign, Calendar, TrendingUp, Wallet, ArrowUpRight, ArrowDownRight, Search } from 'lucide-react';

const FormInput = ({ label, value, name, type = "text", mask, required = true, readOnly = false, onChange, className = "" }: any) => (
  <div className={`flex flex-col gap-1 ${className}`}>
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
      {label} {required && <span className="text-red-500 font-black">*</span>}
    </label>
    {readOnly ? (
      <div className="bg-slate-100 border-2 border-slate-200 border-dashed rounded-2xl px-5 py-4 font-black text-slate-400 select-none uppercase text-sm">
        {value || 'GERADO PELO SISTEMA'}
      </div>
    ) : (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => {
          let val = e.target.value;
          if (type !== 'date' && type !== 'email' && type !== 'number') val = val.toUpperCase();
          onChange(name, mask ? mask(val) : val);
        }}
        className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:border-indigo-500 focus:bg-white outline-none text-sm uppercase transition-all"
        placeholder={required ? 'OBRIGATÓRIO' : ''}
      />
    )}
  </div>
);

interface ClientAccountFormProps {
  list: ClientAccount[];
  clients: any[];
  onSave: (d: ClientAccount) => void;
  onDelete: (id: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

const ClientAccountForm: React.FC<ClientAccountFormProps> = ({ list, clients, onSave, onDelete, onNotify }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<ClientAccount>>({ 
    accountType: 'MENSALISTA', status: 'REGULAR', balance: '0.00', creditLimit: '0.00', totalDebt: '0.00', invoices: []
  });
  
  const [newInvoice, setNewInvoice] = useState<Partial<Invoice>>({
    description: '', value: '0.00', dueDate: new Date().toISOString().split('T')[0], status: 'PENDENTE'
  });

  const financialSummary = useMemo(() => {
    const invs = formData.invoices || [];
    const paid = invs.filter(i => i.status === 'PAGO').reduce((acc, curr) => acc + parseFloat(curr.value || '0'), 0);
    const pending = invs.filter(i => i.status === 'PENDENTE').reduce((acc, curr) => acc + parseFloat(curr.value || '0'), 0);
    return { 
      paid: paid.toFixed(2), 
      pending: pending.toFixed(2), 
      total: (paid + pending).toFixed(2) 
    };
  }, [formData.invoices]);

  const updateField = (name: string, value: any) => setFormData(prev => ({ ...prev, [name]: value }));

  const addInvoice = () => {
    if (!newInvoice.description || !newInvoice.value || !newInvoice.dueDate) {
      onNotify("PREENCHA OS DADOS DA COBRANÇA!", "error");
      return;
    }
    const invoice: Invoice = {
      id: 'INV-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
      description: newInvoice.description.toUpperCase(),
      value: parseFloat(newInvoice.value).toFixed(2),
      dueDate: newInvoice.dueDate,
      status: newInvoice.status as 'PAGO' | 'PENDENTE',
      paidAt: newInvoice.status === 'PAGO' ? new Date().toISOString() : undefined
    };
    
    const updatedInvoices = [...(formData.invoices || []), invoice];
    setFormData({ ...formData, invoices: updatedInvoices });
    setNewInvoice({ description: '', value: '0.00', dueDate: new Date().toISOString().split('T')[0], status: 'PENDENTE' });
    onNotify("COBRANÇA ADICIONADA AO RASCUNHO!");
  };

  const removeInvoice = (id: string) => {
    const updatedInvoices = (formData.invoices || []).filter(i => i.id !== id);
    setFormData({ ...formData, invoices: updatedInvoices });
  };

  const toggleInvoiceStatus = (id: string) => {
    const updatedInvoices = (formData.invoices || []).map(i => {
      if (i.id === id) {
        const newStatus = i.status === 'PAGO' ? 'PENDENTE' : 'PAGO';
        return { 
          ...i, 
          status: newStatus as any, 
          paidAt: newStatus === 'PAGO' ? new Date().toISOString() : undefined 
        };
      }
      return i;
    });
    setFormData({ ...formData, invoices: updatedInvoices });
  };

  const handleSave = async () => {
    if (!formData.clientId) {
      onNotify("VINCULE UM CLIENTE!", 'error');
      return;
    }
    
    const pendingAmount = (formData.invoices || []).filter(i => i.status === 'PENDENTE').reduce((acc, curr) => acc + parseFloat(curr.value || '0'), 0);
    const finalStatus = pendingAmount > 0 ? 'INADIMPLENTE' : 'REGULAR';
    const id = formData.id || 'ACC-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    onSave({ 
      ...formData, 
      id, 
      status: finalStatus, 
      totalDebt: pendingAmount.toFixed(2),
      createdAt: formData.createdAt || new Date().toISOString() 
    } as ClientAccount);
    
    setShowForm(false);
    onNotify("CONTA ATUALIZADA COM SUCESSO!");
  };

  if (showForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">GESTÃO FINANCEIRA</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">LANÇAMENTOS E LIQUIDAÇÕES DE FATURAS</p>
          </div>
          <button onClick={() => setShowForm(false)} className="text-slate-400 font-black hover:text-slate-800 uppercase text-xs border-2 border-slate-100 px-6 py-3 rounded-2xl transition-all hover:bg-white">VOLTAR</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
           <div className="lg:col-span-1 space-y-6">
              <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">CLIENTE <span className="text-red-500">*</span></label>
                  <select 
                    disabled={!!formData.id}
                    className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-indigo-500 disabled:opacity-50 appearance-none" 
                    value={formData.clientId} 
                    onChange={e => {
                      const c = clients.find(x => x.id === e.target.value);
                      setFormData({...formData, clientId: e.target.value, clientName: c?.fullName || c?.companyName || ''});
                    }}
                  >
                    <option value="">SELECIONAR CLIENTE...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.fullName || c.companyName}</option>)}
                  </select>
                </div>
                <FormInput label="SALDO VIRTUAL (R$)" name="balance" type="number" value={formData.balance} onChange={updateField} />
                <FormInput label="LIMITE CRÉDITO (R$)" name="creditLimit" type="number" value={formData.creditLimit} onChange={updateField} />
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TIPO DE CONTA</label>
                  <select 
                    className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-indigo-500 appearance-none"
                    value={formData.accountType}
                    onChange={e => updateField('accountType', e.target.value)}
                  >
                    <option value="MENSALISTA">MENSALISTA</option>
                    <option value="PRE-PAGO">PRÉ-PAGO</option>
                    <option value="POS-PAGO">PÓS-PAGO</option>
                  </select>
                </div>
                <LoadingButton onAction={handleSave} className="h-16 w-full bg-slate-900 text-white rounded-2xl uppercase tracking-widest text-xs shadow-xl">SALVAR ALTERAÇÕES</LoadingButton>
              </div>

              <div className="bg-slate-900 rounded-[40px] p-10 text-white space-y-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <TrendingUp size={120} />
                 </div>
                 <div className="relative z-10">
                   <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-6">
                      <Wallet className="text-indigo-400" size={24} />
                      <h4 className="font-black text-sm uppercase tracking-widest">Resumo Quitação</h4>
                   </div>
                   <div className="space-y-6">
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Total Liquidado</p>
                         <div className="flex items-center gap-2 text-emerald-400">
                            <ArrowDownRight size={18} />
                            <p className="text-2xl font-black">R$ {financialSummary.paid}</p>
                         </div>
                      </div>
                      <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Dívida em Aberto</p>
                         <div className="flex items-center gap-2 text-rose-400">
                            <ArrowUpRight size={18} />
                            <p className="text-2xl font-black">R$ {financialSummary.pending}</p>
                         </div>
                      </div>
                      <div className="pt-6 border-t border-white/10">
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Faturamento Total</p>
                         <p className="text-3xl font-black text-white">R$ {financialSummary.total}</p>
                      </div>
                   </div>
                 </div>
              </div>
           </div>

           <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                 <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <DollarSign size={24} />
                 </div>
                 <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">NOVA COBRANÇA</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-3xl mb-10 border-2 border-slate-100 border-dashed">
                 <div className="md:col-span-2">
                   <FormInput label="DESCRIÇÃO" value={newInvoice.description} onChange={(_:any, v:string)=>setNewInvoice({...newInvoice, description: v})} required={false} />
                 </div>
                 <FormInput label="VALOR (R$)" type="number" value={newInvoice.value} onChange={(_:any, v:string)=>setNewInvoice({...newInvoice, value: v})} required={false} />
                 <FormInput label="VENCIMENTO" type="date" value={newInvoice.dueDate} onChange={(_:any, v:string)=>setNewInvoice({...newInvoice, dueDate: v})} required={false} />
                 <div className="md:col-span-4 flex justify-end">
                    <button onClick={addInvoice} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95">
                       <Plus size={16} /> ADICIONAR AO EXTRATO
                    </button>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="flex justify-between items-center px-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Histórico de Movimentações</h4>
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">ORDEM CRONOLÓGICA</span>
                 </div>
                 <div className="max-h-[550px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                    {(formData.invoices || []).sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()).map(inv => (
                      <div key={inv.id} className={`flex items-center justify-between p-6 rounded-[35px] border-2 transition-all group ${inv.status === 'PAGO' ? 'bg-emerald-50 border-emerald-100 opacity-80' : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm'}`}>
                         <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-inner ${inv.status === 'PAGO' ? 'bg-white text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                               {inv.status === 'PAGO' ? <CheckCircle2 size={30} /> : <Calendar size={30} />}
                            </div>
                            <div>
                               <p className="font-black text-slate-800 text-sm uppercase leading-tight">{inv.description}</p>
                               <div className="flex items-center gap-4 mt-1">
                                  <span className="text-[9px] font-black text-slate-400 uppercase flex items-center gap-1">VENC: {new Date(inv.dueDate).toLocaleDateString()}</span>
                                  {inv.status === 'PAGO' ? (
                                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded uppercase">LIQUIDADO</span>
                                  ) : (
                                    <span className="text-[9px] font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded uppercase">PENDENTE</span>
                                  )}
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <p className={`font-black text-xl tracking-tighter ${inv.status === 'PAGO' ? 'text-emerald-600' : 'text-rose-600'}`}>R$ {inv.value}</p>
                            <div className="flex gap-2">
                               <button 
                                 onClick={() => toggleInvoiceStatus(inv.id)} 
                                 className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${inv.status === 'PAGO' ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 shadow-inner' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg'}`}
                                 title={inv.status === 'PAGO' ? 'Marcar como Pendente' : 'Confirmar Pagamento'}
                               >
                                  {inv.status === 'PAGO' ? <XCircle size={22} /> : <CheckCircle2 size={22} />}
                               </button>
                               <button onClick={() => removeInvoice(inv.id)} className="w-12 h-12 flex items-center justify-center text-slate-200 hover:text-red-600 transition-colors group-hover:scale-110"><Trash2 size={22} /></button>
                            </div>
                         </div>
                      </div>
                    ))}
                    {(formData.invoices || []).length === 0 && (
                      <div className="py-24 text-center opacity-20 border-4 border-dotted border-slate-200 rounded-[50px]">
                         <DollarSign size={64} className="mx-auto mb-6" />
                         <p className="text-[11px] font-black uppercase tracking-[0.3em]">Nenhuma fatura lançada nesta conta</p>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">FINANCEIRO</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">CONTROLE DE FATURAMENTO E DÉBITOS</p>
        </div>
        <button onClick={() => { setFormData({ accountType: 'MENSALISTA', status: 'REGULAR', balance: '0.00', creditLimit: '0.00', totalDebt: '0.00', invoices: [] }); setShowForm(true); }} className="h-16 px-10 bg-indigo-600 text-white rounded-2xl shadow-xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"><Plus size={24} /> NOVA CONTA</button>
      </div>

      <div className="bg-white p-4 rounded-3xl border border-slate-200 mb-8 flex items-center gap-4 shadow-sm">
        <Search className="text-slate-300 ml-4" />
        <input type="text" placeholder="BUSCAR CONTA POR CLIENTE..." className="flex-1 bg-transparent py-4 font-black outline-none placeholder:text-slate-300 uppercase text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[950px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400 tracking-widest">CLIENTE / TIPO</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400 tracking-widest">QUITAÇÃO (P/T)</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400 tracking-widest">TOTAL EM DÉBITO</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400 tracking-widest">SALDO DISP.</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">STATUS</th>
                <th className="px-10 py-7 text-right text-[10px] font-black uppercase text-slate-400 tracking-widest">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.filter(a => a.clientName.includes(searchTerm.toUpperCase())).map(a => {
                 const invs = a.invoices || [];
                 const paidCount = invs.filter(i => i.status === 'PAGO').length;
                 const totalCount = invs.length;
                 const progress = totalCount > 0 ? (paidCount / totalCount) * 100 : 0;
                 
                 return (
                  <tr key={a.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-10 py-7">
                      <p className="font-black text-slate-800 uppercase text-sm">{a.clientName}</p>
                      <p className="text-[10px] text-indigo-500 font-black tracking-widest mt-1 uppercase">{a.accountType}</p>
                    </td>
                    <td className="px-10 py-7">
                      <div className="flex flex-col">
                         <p className="font-black text-slate-800 text-[10px] uppercase">{paidCount} de {totalCount} Pagas</p>
                         <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden border border-slate-200/30">
                            <div className="bg-emerald-500 h-full transition-all duration-700" style={{ width: `${progress}%` }} />
                         </div>
                      </div>
                    </td>
                    <td className="px-10 py-7">
                      <p className={`font-black text-sm ${parseFloat(a.totalDebt) > 0 ? 'text-rose-600' : 'text-slate-300'}`}>R$ {a.totalDebt || '0.00'}</p>
                    </td>
                    <td className="px-10 py-7 font-black text-emerald-600 text-sm">R$ {a.balance}</td>
                    <td className="px-10 py-7 text-center">
                      <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${a.status === 'REGULAR' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{a.status}</span>
                    </td>
                    <td className="px-10 py-7 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setFormData(a); setShowForm(true); }} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90" title="GERENCIAR CONTA"><Edit3 size={18} /></button>
                        <button onClick={() => { if(window.confirm('EXCLUIR CONTA FINANCEIRA?')) onDelete(a.id); }} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                 )
              })}
              {list.length === 0 && (
                <tr>
                   <td colSpan={6} className="py-24 text-center opacity-20">
                      <AlertTriangle size={48} className="mx-auto mb-4 text-amber-500" />
                      <p className="text-[11px] font-black uppercase tracking-[0.3em]">Aguardando configuração de contas financeiras</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientAccountForm;
