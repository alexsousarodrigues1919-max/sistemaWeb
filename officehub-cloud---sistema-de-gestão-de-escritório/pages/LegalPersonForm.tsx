
import React, { useState } from 'react';
import { LegalPerson } from '../types.ts';
import LoadingButton from '../components/LoadingButton.tsx';
import { maskCNPJ, maskCEP, maskCPF, maskPhone } from '../utils/masks.ts';
import { Plus, Edit3, Trash2, Search } from 'lucide-react';

const BRAZIL_STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

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
          if (type !== 'date' && type !== 'email') val = val.toUpperCase();
          onChange(name, mask ? mask(val) : val);
        }}
        className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:border-indigo-500 focus:bg-white outline-none text-sm uppercase transition-all"
        placeholder={required ? 'CAMPO OBRIGATÓRIO' : ''}
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
      {options.map((opt: any) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

interface LegalPersonFormProps {
  list: LegalPerson[];
  onSave: (d: LegalPerson) => void;
  onDelete: (id: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

const LegalPersonForm: React.FC<LegalPersonFormProps> = ({ list, onSave, onDelete, onNotify }) => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'BASIC' | 'ADDR' | 'RESP' | 'FISCAL'>('BASIC');
  const [formData, setFormData] = useState<Partial<LegalPerson>>({
    type: 'JURIDICA', taxRegime: 'SIMPLES NACIONAL', status: 'ATIVO', country: 'BRASIL'
  });

  const updateField = (name: string, value: any) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    const requiredFields = [
      { key: 'companyName', label: 'RAZÃO SOCIAL' },
      { key: 'cnpj', label: 'CNPJ' },
      { key: 'openingDate', label: 'DATA DE ABERTURA' },
      { key: 'comercialPhone', label: 'TEL COMERCIAL' },
      { key: 'city', label: 'CIDADE' },
      { key: 'state', label: 'UF' },
      { key: 'responsibleName', label: 'RESPONSÁVEL' }
    ];

    const missing = requiredFields.filter(f => !formData[f.key as keyof LegalPerson]);

    if (missing.length > 0) {
      const errorMsg = `AVISO: OS SEGUINTES CAMPOS SÃO OBRIGATÓRIOS:\n${missing.map(m => `• ${m.label}`).join('\n')}`;
      onNotify(errorMsg, 'error');
      return;
    }

    const id = formData.id || 'PJ-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    onSave({ ...formData, id, createdAt: formData.createdAt || new Date().toISOString() } as LegalPerson);
    setShowForm(false);
    setFormData({ type: 'JURIDICA', taxRegime: 'SIMPLES NACIONAL', status: 'ATIVO', country: 'BRASIL' });
  };

  if (showForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">EMPRESA PJ</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">DADOS CADASTRAIS DA PESSOA JURÍDICA</p>
          </div>
          <button onClick={() => setShowForm(false)} className="text-slate-400 font-black hover:text-slate-800 uppercase text-xs border-2 border-slate-100 px-6 py-3 rounded-2xl">FECHAR</button>
        </div>

        <div className="flex overflow-x-auto gap-2 mb-8 bg-slate-100 p-2 rounded-[25px]">
          {[
            { id: 'BASIC', label: 'IDENTIFICAÇÃO' },
            { id: 'FISCAL', label: 'TRIBUTÁRIO' },
            { id: 'ADDR', label: 'ENDEREÇO' },
            { id: 'RESP', label: 'RESPONSÁVEL' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-1 min-w-[120px] py-4 rounded-2xl font-black text-[10px] tracking-widest transition-all uppercase ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm mb-10">
          {activeTab === 'BASIC' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
              <FormInput label="ID DA EMPRESA" name="id" value={formData.id} readOnly onChange={updateField} />
              <FormInput label="RAZÃO SOCIAL" name="companyName" value={formData.companyName} onChange={updateField} />
              <FormInput label="NOME FANTASIA" name="tradeName" value={formData.tradeName} onChange={updateField} required={false} />
              <FormInput label="CNPJ" name="cnpj" value={formData.cnpj} mask={maskCNPJ} onChange={updateField} />
              <FormInput label="DATA ABERTURA" name="openingDate" type="date" value={formData.openingDate} onChange={updateField} />
              <FormInput label="TEL. COMERCIAL" name="comercialPhone" mask={maskPhone} value={formData.comercialPhone} onChange={updateField} />
              <FormInput label="E-MAIL" name="email" value={formData.email} type="email" onChange={updateField} required={false} />
            </div>
          )}
          {activeTab === 'FISCAL' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
              <FormInput label="INSCRIÇÃO ESTADUAL" name="stateRegistration" value={formData.stateRegistration} onChange={updateField} required={false} />
              <FormInput label="INSCRIÇÃO MUNICIPAL" name="municipalRegistration" value={formData.municipalRegistration} onChange={updateField} required={false} />
              <FormSelect label="REGIME TRIBUTÁRIO" name="taxRegime" value={formData.taxRegime} options={["SIMPLES NACIONAL", "MEI", "LUCRO PRESUMIDO", "LUCRO REAL"]} onChange={updateField} />
            </div>
          )}
          {activeTab === 'ADDR' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
              <FormInput label="CEP" name="cep" value={formData.cep} mask={maskCEP} onChange={updateField} required={false} />
              <FormSelect label="ESTADO (UF)" name="state" value={formData.state} options={BRAZIL_STATES} onChange={updateField} />
              <FormInput label="CIDADE" name="city" value={formData.city} onChange={updateField} />
              <FormInput label="BAIRRO" name="neighborhood" value={formData.neighborhood} onChange={updateField} required={false} />
              <FormInput label="LOGRADOURO" name="street" value={formData.street} onChange={updateField} required={false} />
              <FormInput label="NÚMERO" name="number" value={formData.number} onChange={updateField} required={false} />
            </div>
          )}
          {activeTab === 'RESP' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
              <FormInput label="NOME DO RESPONSÁVEL" name="responsibleName" value={formData.responsibleName} onChange={updateField} />
              <FormInput label="CPF RESPONSÁVEL" name="responsibleCpf" mask={maskCPF} value={formData.responsibleCpf} onChange={updateField} required={false} />
              <FormInput label="CARGO / FUNÇÃO" name="responsibleRole" value={formData.responsibleRole} onChange={updateField} required={false} />
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <LoadingButton onAction={handleSave} className="h-20 w-full md:w-96 text-xl rounded-3xl uppercase tracking-widest shadow-xl">SALVAR EMPRESA</LoadingButton>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">EMPRESAS PJ</h2>
        <button onClick={() => { setFormData({ type: 'JURIDICA', taxRegime: 'SIMPLES NACIONAL', status: 'ATIVO', country: 'BRASIL' }); setShowForm(true); }} className="h-16 px-10 bg-indigo-600 text-white rounded-2xl shadow-xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"><Plus size={24} /> NOVA EMPRESA</button>
      </div>

      <div className="bg-white p-4 rounded-3xl border-2 border-slate-100 mb-8 flex items-center gap-4">
        <Search className="text-slate-400 ml-4" />
        <input type="text" placeholder="PESQUISAR POR RAZÃO OU CNPJ..." className="flex-1 bg-transparent py-4 font-black outline-none placeholder:text-slate-300 uppercase text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1100px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">RAZÃO SOCIAL / CNPJ</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">UF / CIDADE</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">RESPONSÁVEL ADM</th>
                <th className="px-10 py-7 text-right text-[10px] font-black uppercase text-slate-400">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.filter(p => p.companyName.includes(searchTerm.toUpperCase()) || p.cnpj.includes(searchTerm)).map(p => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-10 py-7">
                    <p className="font-black text-slate-800 uppercase text-sm">{p.companyName}</p>
                    <p className="text-[10px] text-indigo-500 font-black tracking-widest mt-1">{p.cnpj}</p>
                  </td>
                  <td className="px-10 py-7 font-bold text-slate-500 text-xs uppercase">{p.city || '---'} ({p.state || '--'})</td>
                  <td className="px-10 py-7">
                    <p className="font-bold text-slate-700 text-xs uppercase">{p.responsibleName || '---'}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase">{p.responsibleRole || '---'}</p>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setFormData(p); setShowForm(true); }} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"><Edit3 size={18} /></button>
                      <button onClick={() => { if(window.confirm('EXCLUIR EMPRESA?')) onDelete(p.id); }} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
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

export default LegalPersonForm;
