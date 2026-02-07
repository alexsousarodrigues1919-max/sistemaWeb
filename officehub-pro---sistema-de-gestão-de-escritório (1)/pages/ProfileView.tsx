
import React from 'react';
import { User, Shield, CheckCircle2, UserCircle, Mail, Key } from 'lucide-react';

const ProfileView: React.FC<{ user: any }> = ({ user }) => {
  const permissions = [
    { label: 'CADASTRO PESSOA FÍSICA / JURÍDICA', allowed: true },
    { label: 'CRIAR / EDITAR / EXCLUIR REGISTROS', allowed: user.profile === 'ADMINISTRADOR' },
    { label: 'ACESSO TOTAL À AGENDA', allowed: true },
    { label: 'GESTÃO DE PLANEJAMENTO', allowed: true },
    { label: 'MODERAR REUNIÕES', allowed: ['ADMINISTRADOR', 'REUNIÃO'].includes(user.profile) },
    { label: 'REALIZAR ATENDIMENTOS', allowed: ['ADMINISTRADOR', 'ATENDIMENTOS'].includes(user.profile) },
    { label: 'ACESSO ADMINISTRATIVO COMPLETO', allowed: user.profile === 'ADMINISTRADOR' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white rounded-[40px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-indigo-600 via-indigo-800 to-indigo-950" />
        <div className="px-12 pb-12">
          <div className="relative -mt-20 mb-8">
            <div className="w-40 h-40 rounded-[35px] bg-white p-3 shadow-2xl">
              <div className="w-full h-full rounded-[25px] bg-indigo-50 flex items-center justify-center text-6xl font-black text-indigo-600 border-4 border-indigo-100">
                {user.fullName[0].toUpperCase()}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">{user.fullName}</h1>
                <div className="inline-block bg-indigo-600 text-white px-4 py-1.5 rounded-xl font-black text-[10px] tracking-widest mt-3 uppercase">
                  {user.profile}
                </div>
              </div>

              <div className="space-y-5 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-4 text-slate-500">
                  <UserCircle size={22} className="text-indigo-600" />
                  <span className="font-black text-xs uppercase tracking-tight">LOGIN: {user.login}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <Mail size={22} className="text-indigo-600" />
                  <span className="font-black text-xs uppercase tracking-tight">{user.email}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <Key size={22} className="text-indigo-600" />
                  <span className="font-black text-xs uppercase tracking-tight">SENHA: •••••••••</span>
                </div>
              </div>

              <div className="pt-4">
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest border ${
                  user.status === 'ATIVO' 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'bg-red-50 border-red-100 text-red-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${user.status === 'ATIVO' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  STATUS DA CONTA: {user.status}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-slate-50 rounded-[35px] p-10 border-2 border-slate-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-indigo-600">
                    <Shield size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">MATRIZ DE PERMISSÕES</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {permissions.map((perm, i) => (
                    <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${
                      perm.allowed 
                      ? 'bg-white border-emerald-50 text-slate-800 shadow-sm' 
                      : 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                    }`}>
                      <span className="text-[10px] font-black tracking-wider uppercase">{perm.label}</span>
                      {perm.allowed ? (
                        <CheckCircle2 size={20} className="text-emerald-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-10 p-8 bg-slate-900 text-white rounded-[30px] flex items-center justify-between shadow-xl">
                   <div>
                     <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">REGISTRO DE ÚLTIMO ACESSO</p>
                     <p className="font-black text-xl">{new Date().toLocaleString('pt-BR')}</p>
                   </div>
                   <Shield size={40} className="text-indigo-500/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
