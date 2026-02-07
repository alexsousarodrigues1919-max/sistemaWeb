
import React from 'react';
import { 
  Shield, 
  ArrowRight, 
  Building2, 
  Users, 
  CheckCircle, 
  Globe, 
  Smartphone, 
  Lock,
  Monitor,
  Cpu,
  Layout,
  ExternalLink,
  Headset,
  UserCheck
} from 'lucide-react';

interface SiteProps {
  onEnterSystem: () => void;
  onEnterClientPortal: () => void;
}

const Site: React.FC<SiteProps> = ({ onEnterSystem, onEnterClientPortal }) => {
  const platforms = [
    {
      icon: Monitor,
      name: "DESKTOP PRO",
      tag: "ADMINISTRATIVO",
      desc: "Plataforma completa para gestão de processos, profissionais e controle financeiro robusto.",
      color: "bg-indigo-600",
      action: onEnterSystem
    },
    {
      icon: Smartphone,
      name: "MOBILE GO",
      tag: "AGILIDADE",
      desc: "Acesse sua agenda, contatos e notificações em tempo real diretamente do seu smartphone.",
      color: "bg-blue-600",
      action: onEnterSystem
    },
    {
      icon: Cpu,
      name: "AI CORE",
      tag: "INTELIGÊNCIA",
      desc: "Motor de IA que automatiza o preenchimento de documentos e analisa a saúde do escritório.",
      color: "bg-emerald-600",
      action: onEnterSystem
    },
    {
      icon: Layout,
      name: "CLIENT PORTAL",
      tag: "EXPERIÊNCIA",
      desc: "Área exclusiva para seus clientes acompanharem o status de solicitações e pagamentos.",
      color: "bg-amber-600",
      action: onEnterClientPortal
    },
    {
      icon: Headset,
      name: "SERVICE HUB",
      tag: "RELACIONAMENTO",
      desc: "Central dedicada para gestão de atendimentos, tickets de suporte e satisfação do cliente.",
      color: "bg-rose-600",
      action: onEnterClientPortal
    }
  ];

  return (
    <div className="bg-white text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Shield size={24} />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase">OFFICEHUB <span className="text-indigo-600">PRO</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#plataformas" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors">Plataformas</a>
            <button 
              onClick={onEnterClientPortal}
              className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-50 border border-indigo-100"
            >
              <UserCheck size={14} /> Área do Cliente
            </button>
            <button 
              onClick={onEnterSystem}
              className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
            >
              Acessar Sistema
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 animate-in slide-in-from-left-10 duration-700">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span> Gestão de Próxima Geração
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-[0.9] text-slate-900 uppercase">
              O Controle <span className="text-indigo-600">Total</span> do seu Escritório.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
              Software completo para escritórios modernos. Gerencie clientes, processos, agenda e financeiro em uma única plataforma intuitiva e segura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={onEnterSystem} className="bg-indigo-600 text-white h-20 px-10 rounded-[28px] font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3">
                Acesso Administrativo <ArrowRight size={20} />
              </button>
              <button onClick={onEnterClientPortal} className="bg-white text-slate-900 border-4 border-slate-100 h-20 px-10 rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                Portal do Cliente
              </button>
            </div>
          </div>
          <div className="relative animate-in zoom-in-95 duration-1000">
             <div className="absolute inset-0 bg-indigo-600/10 blur-[120px] rounded-full"></div>
             <div className="bg-slate-900 aspect-video rounded-[60px] shadow-2xl overflow-hidden border-[12px] border-white relative z-10 rotate-3 transform hover:rotate-0 transition-transform duration-700">
                <div className="p-10 space-y-6">
                   <div className="flex justify-between items-center">
                      <div className="h-4 w-1/3 bg-slate-800 rounded-full"></div>
                      <div className="flex gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      </div>
                   </div>
                   <div className="grid grid-cols-3 gap-4">
                      <div className="h-32 bg-slate-800 rounded-3xl"></div>
                      <div className="h-32 bg-indigo-600 rounded-3xl"></div>
                      <div className="h-32 bg-slate-800 rounded-3xl"></div>
                   </div>
                   <div className="h-40 bg-slate-800 rounded-[40px]"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Plataformas List Section */}
      <section id="plataformas" className="py-32 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Nossas Plataformas</h2>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-2">UM ÚNICO LOGIN. MÚLTIPLAS POSSIBILIDADES.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {platforms.map((plat, i) => (
              <div key={i} className="group bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className={`w-16 h-16 ${plat.color} text-white rounded-3xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform`}>
                  <plat.icon size={28} />
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">{plat.tag}</span>
                    <h3 className="text-2xl font-black mt-3 uppercase tracking-tighter">{plat.name}</h3>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed h-20 overflow-hidden">
                    {plat.desc}
                  </p>
                  <button 
                    onClick={plat.action}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-indigo-600 transition-colors pt-4"
                  >
                    ACESSAR AGORA <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto bg-slate-900 rounded-[60px] p-20 text-center relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-indigo-600/10 blur-[100px] pointer-events-none"></div>
           <div className="relative z-10 space-y-10">
              <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter">Pronto para digitalizar seu escritório?</h2>
              <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">
                Junte-se a centenas de profissionais que já transformaram sua gestão com o OfficeHub Pro.
              </p>
              <button 
                onClick={onEnterSystem}
                className="bg-white text-slate-950 px-16 h-24 rounded-[35px] font-black text-lg uppercase tracking-widest hover:scale-105 transition-all shadow-2xl"
              >
                Começar Grátis Agora
              </button>
           </div>
        </div>
      </section>
      
      <footer className="py-10 text-center text-slate-400 font-black text-[10px] uppercase tracking-widest border-t border-slate-100">
         OFFICEHUB PRO &copy; 2025 - TODOS OS DIREITOS RESERVADOS
      </footer>
    </div>
  );
};

export default Site;
