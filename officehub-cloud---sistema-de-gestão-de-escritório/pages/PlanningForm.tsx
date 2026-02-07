
import React, { useState } from 'react';
import { Planning, User } from '../types.ts';
import LoadingButton from '../components/LoadingButton.tsx';
import { Plus, Edit3, Trash2, FileText } from 'lucide-react';

const FormInput = ({ label, value, name, type = "text", required = true, readOnly = false, onChange }: any) => (
  <div className="flex flex-col gap-1">
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
          if (type !== 'number') val = val.toUpperCase();
          onChange(name, val);
        }}
        className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:border-indigo-500 focus:bg-white outline-none text-sm uppercase transition-all"
        placeholder={required ? 'OBRIGATÓRIO' : ''}
      />
    )}
  </div>
);

const FormTextarea = ({ label, value, name, required = false, onChange }: any) => (
  <div className="flex flex-col gap-1 h-full">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
      {label} {required && <span className="text-red-500 font-black">*</span>}
    </label>
    <textarea
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value.toUpperCase())}
      className="bg-slate-50 border-2 border-slate-100 rounded-[30px] px-8 py-8 font-bold text-slate-800 focus:border-indigo-500 focus:bg-white outline-none text-sm uppercase transition-all min-h-[350px] resize-none shadow-inner leading-relaxed"
      placeholder={required ? 'CAMPO OBRIGATÓRIO' : 'DESCREVA AQUI O OBJETIVO DETALHADO, METAS E CRONOGRAMA DO PLANEJAMENTO...'}
    />
  </div>
);

interface PlanningFormProps {
  list: Planning[];
  user: User;
  onSave: (d: Planning) => void;
  onDelete: (id: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

const PlanningForm: React.FC<PlanningFormProps> = ({ list, user, onSave, onDelete, onNotify }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Planning>>({
    status: 'PLANEJADO', percentage: 0, planType: 'PROJETO'
  });

  const handleSave = async () => {
    if (!formData.title) {
      onNotify("O TÍTULO DO PLANEJAMENTO É OBRIGATÓRIO!", 'error');
      return;
    }
    const id = formData.id || 'PLN-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    onSave({ ...formData, id, percentage: formData.percentage || 0 } as Planning);
    setShowForm(false);
    setFormData({ status: 'PLANEJADO', percentage: 0, planType: 'PROJETO' });
  };

  if (showForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">PLANO ESTRATÉGICO</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">GESTÃO DE METAS E ATIVIDADES</p>
          </div>
          <button onClick={() => setShowForm(false)} className="text-slate-400 font-black hover:text-slate-800 uppercase text-xs border-2 border-slate-100 px-6 py-3 rounded-2xl transition-all hover:bg-white">CANCELAR</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
              <FormInput label="TÍTULO DO PLANEJAMENTO" name="title" value={formData.title} onChange={(n:string, v:any)=>setFormData({...formData,[n]:v})} />
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TIPO DE PLANO <span className="text-red-500">*</span></label>
                <select className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-indigo-500 appearance-none" value={formData.planType} onChange={e => setFormData({...formData, planType: e.target.value as any})}>
                  <option value="PROJETO">PROJETO</option>
                  <option value="META">META</option>
                  <option value="ATIVIDADE">ATIVIDADE</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PROGRESSO ATUAL</label>
                  <span className="text-indigo-600 font-black text-xs">{formData.percentage}%</span>
                </div>
                <input type="range" min="0" max="100" step="5" className="h-12 accent-indigo-600 cursor-pointer" value={formData.percentage} onChange={e => setFormData({...formData, percentage: parseInt(e.target.value)})} />
                <p className="text-[9px] text-slate-400 font-bold text-center uppercase tracking-widest">ARRASTE PARA AJUSTAR</p>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">STATUS ATUAL <span className="text-red-500">*</span></label>
                <select className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-indigo-500 appearance-none" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                  <option value="PLANEJADO">PLANEJADO</option>
                  <option value="EM ANDAMENTO">EM ANDAMENTO</option>
                  <option value="CONCLUIDO">CONCLUÍDO</option>
                </select>
              </div>
            </div>
            
            <div className="bg-indigo-900 p-10 rounded-[40px] shadow-2xl text-white">
              <FileText className="text-indigo-400 mb-6" size={40} />
              <h3 className="text-xl font-black uppercase mb-2">RECOMENDAÇÃO</h3>
              <p className="text-indigo-200 text-xs font-bold leading-relaxed uppercase">DETALHE CADA ETAPA PARA QUE A EQUIPE POSSA ACOMPANHAR O EVOLUTIVO ATRAVÉS DO PAINEL DE INDICADORES.</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm h-full">
              <FormTextarea 
                label="DESCRIÇÃO DETALHADA / OBJETIVO ESTRATÉGICO" 
                name="description" 
                value={formData.description} 
                onChange={(n:string, v:any)=>setFormData({...formData,[n]:v})} 
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-10">
          <LoadingButton onAction={handleSave} className="h-20 w-full md:w-96 text-xl rounded-3xl uppercase tracking-widest shadow-xl">SALVAR PLANEJAMENTO</LoadingButton>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">PLANEJAMENTOS</h2>
        <button onClick={() => { setFormData({ status: 'PLANEJADO', percentage: 0, planType: 'PROJETO' }); setShowForm(true); }} className="h-16 px-10 bg-indigo-600 text-white rounded-2xl shadow-xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"><Plus size={24} /> NOVO PLANO</button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">PLANO / TIPO</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">PROGRESSO</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">STATUS</th>
                <th className="px-10 py-7 text-right text-[10px] font-black uppercase text-slate-400">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map(plan => (
                <tr key={plan.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-10 py-7">
                    <p className="font-black text-slate-800 uppercase text-sm">{plan.title}</p>
                    <p className="text-[10px] text-indigo-500 font-black tracking-widest mt-1 uppercase">{plan.planType}</p>
                  </td>
                  <td className="px-10 py-7">
                    <div className="w-40 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full transition-all duration-1000" style={{ width: `${plan.percentage}%` }} />
                    </div>
                    <span className="text-[9px] font-black text-slate-400 mt-1 block uppercase">{plan.percentage}% COMPLETO</span>
                  </td>
                  <td className="px-10 py-7">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${plan.status === 'CONCLUIDO' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{plan.status}</span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setFormData(plan); setShowForm(true); }} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="EDITAR"><Edit3 size={18} /></button>
                      <button onClick={() => { if(window.confirm('EXCLUIR PLANEJAMENTO?')) onDelete(plan.id); }} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="EXCLUIR"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PlanningForm;
