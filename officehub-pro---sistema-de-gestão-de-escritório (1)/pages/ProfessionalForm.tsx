
import React, { useState } from 'react';
import { Professional } from '../types.ts';
import LoadingButton from '../components/LoadingButton.tsx';
import { maskPhone } from '../utils/masks.ts';
import { Plus, Edit3, Trash2, Search } from 'lucide-react';

const COUNCILS = ["OAB", "CRC", "CREA", "CRM", "CRP", "CORECON", "OUTRO"];
const SPECIALTIES = ["ADVOGADO(A)", "CONTADOR(A)", "ENGENHEIRO(A)", "ARQUITETO(A)", "PSICÓLOGO(A)", "ADMINISTRADOR(A)", "AUXILIAR ADM", "GERENTE", "DIRETOR"];

const FormInput = ({ label, value, name, type = "text", mask, required = true, readOnly = false, onChange }: any) => (
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
          if (type !== 'date' && type !== 'email' && type !== 'number') val = val.toUpperCase();
          onChange(name, mask ? mask(val) : val);
        }}
        className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:border-indigo-500 focus:bg-white outline-none text-sm uppercase transition-all"
        placeholder={required ? 'OBRIGATÓRIO' : ''}
      />
    )}
  </div>
);

const FormSelect = ({ label, value, name, options, required = true, onChange }: any) => (
  <div className="flex flex-col gap-1">
    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
      {label} {required && <span className="text-red-500 font-black">*</span>}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(name, e.target.value)}
      className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:border-indigo-500 focus:bg-white outline-none text-sm uppercase transition-all appearance-none"
    >
      <option value="">SELECIONE...</option>
      {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
    </select>
  </div>
);

interface ProfessionalFormProps {
  list: Professional[];
  onSave: (d: Professional) => void;
  onDelete: (id: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

const ProfessionalForm: React.FC<ProfessionalFormProps> = ({ list, onSave, onDelete, onNotify }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Professional>>({ status: 'ATIVO' });

  const updateField = (name: string, value: any) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    const requiredFields = [
      { key: 'fullName', label: 'NOME COMPLETO' },
      { key: 'councilId', label: 'CONSELHO' },
      { key: 'specialty', label: 'ESPECIALIDADE' },
      { key: 'registration', label: 'MATRÍCULA' }
    ];

    const missing = requiredFields.filter(f => !formData[f.key as keyof Professional]);

    if (missing.length > 0) {
      const errorMsg = `NÃO É POSSÍVEL SALVAR:\n${missing.map(m => `• ${m.label}`).join('\n')}`;
      onNotify(errorMsg, 'error');
      return;
    }

    const id = formData.id || 'PRO-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    onSave({ ...formData, id, createdAt: formData.createdAt || new Date().toISOString() } as Professional);
    setShowForm(false);
    setFormData({ status: 'ATIVO' });
  };

  if (showForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">PROFISSIONAL</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">DADOS DO MEMBRO DA EQUIPE</p>
          </div>
          <button onClick={() => setShowForm(false)} className="text-slate-400 font-black hover:text-slate-800 uppercase text-xs border-2 border-slate-100 px-6 py-3 rounded-2xl">FECHAR</button>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
            <FormInput label="MATRÍCULA" name="registration" value={formData.registration} onChange={updateField} />
            <FormInput label="NOME COMPLETO" name="fullName" value={formData.fullName} onChange={updateField} />
            <FormSelect label="CONSELHO PROFISSIONAL" name="councilId" value={formData.councilId} options={COUNCILS} onChange={updateField} />
            <FormSelect label="ESPECIALIDADE / CARGO" name="specialty" value={formData.specialty} options={SPECIALTIES} onChange={updateField} />
            <FormInput label="E-MAIL CORPORATIVO" name="email" value={formData.email} type="email" onChange={updateField} required={false} />
            <FormInput label="TELEFONE" name="phone" value={formData.phone} mask={maskPhone} onChange={updateField} required={false} />
            <FormInput label="DATA ADMISSÃO" name="admissionDate" type="date" value={formData.admissionDate} onChange={updateField} required={false} />
            <FormInput label="SALÁRIO BASE (R$)" name="salary" type="number" value={formData.salary} onChange={updateField} required={false} />
            <FormInput label="TAXA COMISSÃO (%)" name="commissionRate" type="number" value={formData.commissionRate} onChange={updateField} required={false} />
            <FormSelect label="SITUAÇÃO ATUAL" name="status" value={formData.status} options={["ATIVO", "AFASTADO", "DESLIGADO"]} onChange={updateField} />
          </div>
        </div>

        <div className="flex justify-end">
          <LoadingButton onAction={handleSave} className="h-20 w-full md:w-96 text-xl rounded-3xl uppercase tracking-widest shadow-xl">SALVAR PROFISSIONAL</LoadingButton>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">EQUIPE</h2>
        <button onClick={() => { setFormData({ status: 'ATIVO' }); setShowForm(true); }} className="h-16 px-10 bg-indigo-600 text-white rounded-2xl shadow-xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"><Plus size={24} /> NOVO PROFISSIONAL</button>
      </div>

      <div className="bg-white p-4 rounded-3xl border-2 border-slate-100 mb-8 flex items-center gap-4">
        <Search className="text-slate-400 ml-4" />
        <input type="text" placeholder="PESQUISAR EQUIPE..." className="flex-1 bg-transparent py-4 font-black outline-none placeholder:text-slate-300 uppercase text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">MEMBRO / REGISTRO</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">ESPECIALIDADE</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">STATUS</th>
                <th className="px-10 py-7 text-right text-[10px] font-black uppercase text-slate-400">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.filter(p => p.fullName.includes(searchTerm.toUpperCase())).map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-10 py-7">
                    <p className="font-black text-slate-800 uppercase text-sm">{p.fullName}</p>
                    <p className="text-[10px] text-indigo-500 font-black tracking-widest mt-1 uppercase">{p.councilId}: {p.registration}</p>
                  </td>
                  <td className="px-10 py-7 font-bold text-slate-500 text-xs uppercase">{p.specialty}</td>
                  <td className="px-10 py-7">
                     <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${p.status === 'ATIVO' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                       {p.status}
                     </span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setFormData(p); setShowForm(true); }} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"><Edit3 size={18} /></button>
                      <button onClick={() => { if(window.confirm('EXCLUIR PROFISSIONAL?')) onDelete(p.id); }} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
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

export default ProfessionalForm;
