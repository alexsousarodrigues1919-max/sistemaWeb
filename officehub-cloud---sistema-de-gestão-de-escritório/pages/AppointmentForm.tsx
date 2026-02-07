
import React, { useState } from 'react';
import { Appointment, PhysicalPerson, User } from '../types.ts';
import LoadingButton from '../components/LoadingButton.tsx';
import { Clock, Plus, Edit3, Trash2, CheckCircle2 } from 'lucide-react';

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
          if (type !== 'date') val = val.toUpperCase();
          onChange(name, val);
        }}
        className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-800 focus:border-indigo-500 focus:bg-white outline-none text-sm uppercase transition-all"
        placeholder={required ? 'OBRIGATÓRIO' : ''}
      />
    )}
  </div>
);

interface AppointmentFormProps {
  list: Appointment[];
  people: PhysicalPerson[];
  user: User;
  onSave: (d: Appointment) => void;
  onDelete: (id: string) => void;
  onNotify: (msg: string, type?: 'success' | 'error') => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ list, people, user, onSave, onDelete, onNotify }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Appointment>>({
    appointmentType: 'PRESENCIAL', service: 'CONSULTORIA GERAL', date: new Date().toISOString().split('T')[0]
  });
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const handleSave = async () => {
    const requiredFields = [
      { value: formData.clientName, label: 'CLIENTE' },
      { value: selectedSlot, label: 'HORÁRIO' }
    ];

    const missing = requiredFields.filter(f => !f.value);

    if (missing.length > 0) {
      const errorMsg = `DADOS INVÁLIDOS PARA AGENDAMENTO:\n${missing.map(m => `• ${m.label}`).join('\n')}`;
      onNotify(errorMsg, 'error');
      return;
    }

    const id = formData.id || 'ATE-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    onSave({ ...formData, id, startTime: selectedSlot } as Appointment);
    setShowForm(false);
    setSelectedSlot(null);
  };

  if (showForm) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">AGENDAR ATENDIMENTO</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">RESERVA DE HORÁRIO E SERVIÇO</p>
          </div>
          <button onClick={() => setShowForm(false)} className="text-slate-400 font-black hover:text-slate-800 uppercase text-xs border-2 border-slate-100 px-6 py-3 rounded-2xl">CANCELAR</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-sm space-y-8">
            <FormInput label="SERVIÇO / MOTIVO" name="service" value={formData.service} onChange={(n:string, v:any) => setFormData({...formData, [n]:v})} />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SELECIONAR CLIENTE <span className="text-red-500">*</span></label>
              <select className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-indigo-500" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})}>
                <option value="">LOCALIZAR NO SISTEMA...</option>
                {people.map(p => <option key={p.id} value={p.fullName}>{p.fullName.toUpperCase()}</option>)}
              </select>
            </div>
            <FormInput label="DATA" name="date" type="date" value={formData.date} onChange={(n:string, v:any) => setFormData({...formData, [n]:v})} />
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TIPO DE ATENDIMENTO <span className="text-red-500">*</span></label>
              <select className="bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 font-bold text-sm outline-none focus:border-indigo-500" value={formData.appointmentType} onChange={e => setFormData({...formData, appointmentType: e.target.value as any})}>
                <option value="PRESENCIAL">PRESENCIAL</option>
                <option value="ONLINE">ONLINE</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-900 p-10 rounded-[40px] shadow-2xl space-y-10 text-white flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-8"><Clock className="text-indigo-400" /><h3 className="text-xl font-black uppercase">HORÁRIOS DISPONÍVEIS <span className="text-red-500">*</span></h3></div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {slots.map(slot => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-6 rounded-3xl font-black text-lg transition-all border-2 ${
                      selectedSlot === slot ? 'bg-indigo-600 border-indigo-400 text-white shadow-xl scale-105' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {slot}
                    {selectedSlot === slot && <CheckCircle2 size={14} className="mx-auto mt-1" />}
                  </button>
                ))}
              </div>
            </div>
            <LoadingButton onAction={handleSave} className="w-full h-20 bg-white text-slate-950 text-xl font-black rounded-3xl uppercase tracking-widest shadow-xl">CONFIRMAR AGENDAMENTO</LoadingButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter">ATENDIMENTOS</h2>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">CONTROLE DE AGENDA E CLIENTE</p>
        </div>
        <button onClick={() => { setFormData({ appointmentType: 'PRESENCIAL', service: 'CONSULTORIA GERAL', date: new Date().toISOString().split('T')[0] }); setShowForm(true); }} className="h-16 px-10 bg-indigo-600 text-white rounded-2xl shadow-xl font-black flex items-center gap-2 hover:bg-indigo-700 transition-all active:scale-95"><Plus size={24} /> NOVO AGENDAMENTO</button>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">CLIENTE / SERVIÇO</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">TIPO</th>
                <th className="px-10 py-7 text-[10px] font-black uppercase text-slate-400">DATA / HORA</th>
                <th className="px-10 py-7 text-right text-[10px] font-black uppercase text-slate-400">AÇÕES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map(app => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-10 py-7">
                    <p className="font-black text-slate-800 uppercase text-sm">{app.clientName}</p>
                    <p className="text-[10px] text-indigo-500 font-black tracking-widest mt-1 uppercase">{app.service}</p>
                  </td>
                  <td className="px-10 py-7 font-bold text-slate-400 text-[10px] uppercase tracking-widest">{app.appointmentType}</td>
                  <td className="px-10 py-7 font-bold text-slate-500 text-xs uppercase">
                    <p>{new Date(app.date).toLocaleDateString('pt-BR')}</p>
                    <p className="font-black text-slate-900">{app.startTime}</p>
                  </td>
                  <td className="px-10 py-7 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setFormData(app); setSelectedSlot(app.startTime); setShowForm(true); }} className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors" title="EDITAR"><Edit3 size={18} /></button>
                      <button onClick={() => { if(window.confirm('DESEJA EXCLUIR ESTE ATENDIMENTO?')) onDelete(app.id); }} className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors" title="EXCLUIR"><Trash2 size={18} /></button>
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

export default AppointmentForm;
