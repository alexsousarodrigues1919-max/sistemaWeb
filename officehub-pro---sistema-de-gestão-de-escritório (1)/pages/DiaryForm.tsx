
import React, { useState } from 'react';
import { Note, PhysicalPerson, User } from '../types';
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

interface DiaryFormProps {
  list: Note[];
  people: PhysicalPerson[];
  user: User;
  onSave: (data: Note) => void;
  onDelete: (id: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

const DiaryForm: React.FC<DiaryFormProps> = ({ list, people, user, onSave, onDelete, onNotify }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Note>>({
    type: 'ANOTACAO', priority: 'NORMAL', status: 'PENDENTE'
  });

  const updateField = (name: string, value: any) => setFormData(prev => ({ ...prev, [name]: value }));

  const handleSave = async () => {
    const requiredFields = [
      { key: 'title', label: 'TÍTULO DO REGISTRO' },
      { key: 'eventDate', label: 'DATA DO EVENTO' },
      { key: 'type', label: 'TIPO DE REGISTRO' },
      { key: 'priority', label: 'PRIORIDADE' }
    ];

    const missing = requiredFields.filter(f => !formData[f.key as keyof Note]);

    if (missing.length > 0) {
      const errorMsg = `AVISO: CAMPOS OBRIGATÓRIOS FALTANDO:\n${missing.map(m => `• ${m.label}`).join('\n')}`;
      onNotify(errorMsg, 'error');
      return;
    }

    const id = formData.id || 'NOT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    onSave({ ...formData, id, createdAt: formData.createdAt || new Date().toISOString() } as Note);
    setShowForm(false);
    setFormData({ type: 'ANOTACAO', priority: 'NORMAL', status: 'PENDENTE' });
  };

  if (showForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">AGENDA</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">NOVO REGISTRO DE ATIVIDADE</p>
          </div>
          <button onClick={() => setShowForm(false)} className="text-slate-400 font-black hover:text-slate-800 uppercase text-xs border-2 border-slate-100 px-6 py-3 rounded-2xl">FECHAR</button>
        </div>

        <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in">
            <FormInput label="TÍTULO DO REGISTRO" name="title" value={formData.title} onChange={updateField} />
            <FormSelect label="TIPO DE REGISTRO" name="type" value={formData.type} options={["ANOTACAO", "COMPROMISSO", "LEMBRETE"]} onChange={updateField} />
            <FormSelect label="PRIORIDADE" name="priority" value={formData.priority} options={["BAIXA", "NORMAL", "ALTA", "URGENTE"]} onChange={updateField} />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">VINCULAR CLIENTE</label>
              <select className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-indigo-500 appearance-none" value={formData.personId} onChange={e => updateField('personId', e.target.value)}>
                <option value="">NENHUM VÍNCULO</option>
                {people.map(p => <option key={p.id} value={p.id}>{p.fullName}</option>)}
              </select>
            </div>
            <FormInput label="DATA DO EVENTO" name="eventDate" type="date" value={formData.eventDate} onChange={updateField} />
            <FormInput label="HORA INÍCIO" name="startTime" type="time" value={formData.startTime} onChange={updateField} required={false} />
            <div className="md:col-span-2 lg:col-span-3">
              <FormInput label="OBSERVAÇÕES DETALHADAS" name="description" value={formData.description} onChange={updateField} required={false} />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <LoadingButton onAction={handleSave} className="h-20 w-full md:w-96 text-xl rounded-3xl uppercase tracking-widest shadow-xl">SALVAR NA AGENDA</LoadingButton>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">AGENDA</h2>
        <button onClick={() => { setFormData({ type: 'ANOTACAO', priority: 'NORMAL', status: 'PENDENTE' }); setShowForm(true); }} className="h-16 px-10 bg-indigo-600 text-white rounded-2xl shadow-xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"><Plus size={24} /> NOVO REGISTRO</button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">REGISTRO / TIPO</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">CLIENTE VINCULADO</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">PRIORIDADE</th>
                <th className="px-10 py-7 text-right text-[10px] font-black uppercase text-slate-400">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map(note => (
                <tr key={note.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-10 py-7">
                    <p className="font-black text-slate-800 uppercase text-sm">{note.title}</p>
                    <p className="text-[10px] text-slate-400 font-black tracking-widest mt-1 uppercase">{note.type}</p>
                  </td>
                  <td className="px-10 py-7 font-bold text-slate-500 text-xs uppercase">
                    {(people.find(p => p.id === note.personId))?.fullName || 'SEM VÍNCULO'}
                  </td>
                  <td className="px-10 py-7 uppercase">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black ${note.priority === 'URGENTE' ? 'bg-red-50 text-red-600' : 'bg-slate-100 text-slate-600'}`}>
                      {note.priority}
                    </span>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setFormData(note); setShowForm(true); }} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"><Edit3 size={18} /></button>
                      <button onClick={() => { if(window.confirm('EXCLUIR REGISTRO?')) onDelete(note.id); }} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
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

export default DiaryForm;
