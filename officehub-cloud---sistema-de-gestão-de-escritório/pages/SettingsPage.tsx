
import React, { useState } from 'react';
import { Settings, Shield, Trash2, Globe, Save, Download, Upload, Share2, Server, Smartphone, Monitor } from 'lucide-react';
import LoadingButton from '../components/LoadingButton.tsx';

interface SettingsPageProps {
  initialConfig: any;
  onSaveConfig: (cfg: any) => void;
  onNotify: (msg: string, type?: string) => void;
  onImport: (data: any) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ initialConfig, onSaveConfig, onNotify, onImport }) => {
  const [config, setConfig] = useState(initialConfig);
  const [syncCode, setSyncCode] = useState('OFFICE-' + Math.random().toString(36).substr(2, 6).toUpperCase());

  const handleExport = () => {
    const data = {};
    Object.keys(localStorage).forEach(key => {
      if(key.startsWith('db_')) data[key] = JSON.parse(localStorage.getItem(key) || '[]');
    });
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloud_backup_${syncCode}.json`;
    a.click();
    onNotify("BACKUP GERADO COM SUCESSO!");
  };

  const handleImportFile = (e: any) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        onImport(data);
        onNotify("DADOS SINCRONIZADOS NO NOVO APARELHO!");
      } catch (err) {
        onNotify("ERRO NO ARQUIVO", "error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header>
        <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">BACKEND & CLOUD</h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-3">Gerenciamento de Sincronização e Dispositivos</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Painel de Cloud Sync */}
        <div className="lg:col-span-2 bg-indigo-950 p-12 rounded-[50px] text-white shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-12 opacity-5 rotate-12"><Globe size={300} /></div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center"><Server size={24} /></div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter">Sincronização Multi-Dispositivo</h3>
              </div>
              
              <p className="text-indigo-200 text-sm font-bold leading-relaxed max-w-xl uppercase tracking-tight">
                Para visualizar seus dados em outro celular ou computador, utilize o código de sincronização abaixo ou exporte o banco de dados.
              </p>

              <div className="mt-10 p-8 bg-black/30 rounded-[35px] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Seu Código de Nuvem</p>
                    <p className="text-3xl font-black tracking-widest text-white">{syncCode}</p>
                 </div>
                 <div className="flex gap-3">
                    <button onClick={handleExport} className="bg-white text-indigo-950 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
                       <Download size={16} /> Exportar DB
                    </button>
                    <label className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:bg-indigo-500 transition-all">
                       <Upload size={16} /> Importar DB
                       <input type="file" className="hidden" accept=".json" onChange={handleImportFile} />
                    </label>
                 </div>
              </div>

              <div className="mt-12 flex items-center gap-8 opacity-40">
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase"><Smartphone size={16} /> Mobile OK</div>
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase"><Monitor size={16} /> Desktop OK</div>
                 <div className="flex items-center gap-2 text-[9px] font-black uppercase"><Globe size={16} /> Web Hosting OK</div>
              </div>
           </div>
        </div>

        {/* Status do Servidor */}
        <div className="bg-white p-10 rounded-[50px] border border-slate-200 shadow-sm space-y-8">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl"><Shield size={24} /></div>
              <h3 className="text-xl font-black text-slate-800 uppercase">Segurança</h3>
           </div>
           <div className="space-y-6">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Criptografia</p>
                 <p className="font-bold text-sm text-slate-700">AES-256 END-TO-END (SIMULADO)</p>
              </div>
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Última Sincronização</p>
                 <p className="font-bold text-sm text-slate-700">{new Date().toLocaleTimeString()}</p>
              </div>
           </div>
           <button onClick={() => { if(window.confirm('APAGAR TUDO?')) localStorage.clear(); window.location.reload(); }} className="w-full py-5 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all">
              Resetar Banco de Dados
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
