
import React, { useState } from 'react';
import { Meeting, User } from '../types';
import LoadingButton from '../components/LoadingButton';
import { Edit3, Trash2, Plus } from 'lucide-react';

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
          if (type !== 'date' && type !== 'time') val = val.toUpperCase();
          onChange(name, val);
        }}
        className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:border-indigo-500 focus:bg-white outline-none text-sm uppercase transition-all"
        placeholder={required ? 'OBRIGATÓRIO' : ''}
      />
    )}
  </div>
);

interface MeetingFormProps {
  list: Meeting[];
  user: User;
  onSave: (data: Meeting) => void;
  onDelete: (id: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

const MeetingForm: React.FC<MeetingFormProps> = ({ list, user, onSave, onDelete, onNotify }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Meeting>>({
    meetingType: 'ONLINE', status: 'AGENDADA'
  });

  const updateField = (name: string, value: any) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    const requiredFields = [
      { key: 'title', label: 'TÍTULO DA REUNIÃO' },
      { key: 'date', label: 'DATA' }
    ];

    const missing = requiredFields.filter(f => !formData[f.key as keyof Meeting]);

    if (missing.length > 0) {
      const errorMsg = `NÃO É POSSÍVEL AGENDAR:\n${missing.map(m => `• ${m.label}`).join('\n')}`;
      onNotify(errorMsg, 'error');
      return;
    }

    const id = formData.id || 'REU-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    onSave({ ...formData, id } as Meeting);
    setShowForm(false);
    setFormData({ meetingType: 'ONLINE', status: 'AGENDADA' });
  };

  if (showForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">AGENDAR REUNIÃO</h2>
          <button onClick={() => setShowForm(false)} className="text-slate-400 font-black hover:text-slate-800 uppercase text-xs border-2 border-slate-100 px-6 py-3 rounded-2xl">VOLTAR</button>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
            <FormInput label="TÍTULO DA REUNIÃO" name="title" value={formData.title} onChange={updateField} />
            <FormInput label="DATA" name="date" type="date" value={formData.date} onChange={updateField} />
            <FormInput label="HORA" name="startTime" type="time" value={formData.startTime} onChange={updateField} required={false} />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TIPO <span className="text-red-500">*</span></label>
              <select className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-indigo-500" value={formData.meetingType} onChange={e => updateField('meetingType', e.target.value)}>
                <option value="ONLINE">ONLINE</option>
                <option value="PRESENCIAL">PRESENCIAL</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">STATUS <span className="text-red-500">*</span></label>
              <select className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-indigo-500" value={formData.status} onChange={e => updateField('status', e.target.value)}>
                <option value="AGENDADA">AGENDADA</option>
                <option value="REALIZADA">REALIZADA</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <LoadingButton onAction={handleSave} className="h-20 w-full md:w-96 text-xl rounded-3xl uppercase tracking-widest shadow-xl">FINALIZAR AGENDAMENTO</LoadingButton>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">REUNIÕES</h2>
        <button onClick={() => { setFormData({ meetingType: 'ONLINE', status: 'AGENDADA' }); setShowForm(true); }} className="h-16 px-10 bg-indigo-600 text-white rounded-2xl shadow-xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"><Plus size={24} /> NOVA REUNIÃO</button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">REUNIÃO / TIPO</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">DATA / HORA</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">STATUS</th>
                <th className="px-10 py-7 text-right text-[10px] font-black uppercase text-slate-400">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map(m => (
                <tr key={m.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-10 py-7 font-black text-slate-800 uppercase text-sm">
                    {m.title}
                    <p className="text-[10px] text-indigo-500 tracking-widest">{m.meetingType}</p>
                  </td>
                  <td className="px-10 py-7 font-bold text-slate-500 text-xs uppercase">
                    {new Date(m.date).toLocaleDateString('pt-BR')} às {m.startTime}
                  </td>
                  <td className="px-10 py-7">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${m.status === 'REALIZADA' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{m.status}</span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setFormData(m); setShowForm(true); }} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"><Edit3 size={18} /></button>
                      <button onClick={() => { if(window.confirm('EXCLUIR REUNIÃO?')) onDelete(m.id); }} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
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

export default MeetingForm;
