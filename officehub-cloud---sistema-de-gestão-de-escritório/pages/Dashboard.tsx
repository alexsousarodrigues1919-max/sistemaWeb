
import React, { useMemo } from 'react';
import { User, Activity, Calendar, Users, Briefcase, Layers, TrendingUp, ArrowUpRight } from 'lucide-react';
import { PhysicalPerson, LegalPerson, Meeting, Note, Planning } from '../types.ts';

interface Props {
  user: any;
  data: {
    pf: PhysicalPerson[];
    pj: LegalPerson[];
    meetings: Meeting[];
    notes: Note[];
    plans: Planning[];
  }
}

const Dashboard: React.FC<Props> = ({ user, data }) => {
  const cards = [
    { label: 'CLIENTES (PF)', value: data.pf.length, icon: Users, color: 'bg-blue-600' },
    { label: 'EMPRESAS (PJ)', value: data.pj.length, icon: Briefcase, color: 'bg-indigo-600' },
    { label: 'REUNIÕES', value: data.meetings.length, icon: Calendar, color: 'bg-amber-600' },
    { label: 'PLANEJAMENTOS', value: data.plans.length, icon: Layers, color: 'bg-emerald-600' },
  ];

  // Cálculo real da atividade dos últimos 7 dias
  const { chartData, days } = useMemo(() => {
    const today = new Date();
    const result = [];
    const dayLabels = [];
    const weekdays = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      dayLabels.push(weekdays[d.getDay()]);

      // Conta interações/registros no dia
      const count = 
        data.pf.filter(p => p.createdAt?.startsWith(dateStr)).length +
        data.pj.filter(p => p.createdAt?.startsWith(dateStr)).length +
        data.meetings.filter(p => p.date === dateStr).length +
        data.notes.filter(p => p.createdAt?.startsWith(dateStr)).length;
      
      result.push(count);
    }
    return { chartData: result, days: dayLabels };
  }, [data]);

  const maxVal = Math.max(...chartData, 5); // Garante escala mínima de 5

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">OLÁ, {user.fullName.split(' ')[0]}</h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-2">MODO OPERACIONAL: {user.profile}</p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase border border-emerald-100 flex items-center gap-2">
           <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> SISTEMA ONLINE
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 duration-300">
            <div className={`${card.color} w-16 h-16 rounded-3xl flex items-center justify-center text-white shadow-lg mb-6`}>
              <card.icon size={30} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{card.label}</p>
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{card.value.toString().padStart(2, '0')}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10">
         <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-12">
               <div>
                  <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                    <TrendingUp className="text-indigo-600" /> DESEMPENHO OPERACIONAL
                  </h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">VOLUME DE ATIVIDADES DOS ÚLTIMOS 7 DIAS</p>
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-indigo-600 font-black text-2xl flex items-center gap-1">
                    {chartData.reduce((a, b) => a + b, 0)} <Activity size={20}/>
                  </span>
                  <span className="text-slate-300 text-[9px] font-black uppercase">total de registros semanais</span>
               </div>
            </div>

            <div className="relative h-64 w-full mt-4">
               <svg viewBox="0 0 700 200" className="w-full h-full preserve-3d overflow-visible">
                  <defs>
                     <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4f46e5" stopOpacity="0" />
                     </linearGradient>
                     <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                           <feMergeNode in="coloredBlur" />
                           <feMergeNode in="SourceGraphic" />
                        </feMerge>
                     </filter>
                  </defs>

                  {/* Linhas de Grade */}
                  {[0, 1, 2, 3].map((v) => (
                    <line 
                      key={v}
                      x1="0" y1={v * 66} x2="700" y2={v * 66} 
                      stroke="#f8fafc" strokeWidth="2" 
                    />
                  ))}

                  {/* Área Preenchida */}
                  <path
                    d={`M 0 200 ${chartData.map((d, i) => `L ${i * (700 / (chartData.length - 1))} ${200 - (d / maxVal * 150)}`).join(' ')} L 700 200 Z`}
                    fill="url(#chartGradient)"
                    className="transition-all duration-1000 ease-in-out"
                  />

                  {/* Linha Principal */}
                  <path
                    d={`M 0 ${200 - (chartData[0] / maxVal * 150)} ${chartData.map((d, i) => `L ${i * (700 / (chartData.length - 1))} ${200 - (d / maxVal * 150)}`).join(' ')}`}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                    className="transition-all duration-1000 ease-in-out"
                  />

                  {/* Pontos Interativos */}
                  {chartData.map((d, i) => (
                    <g key={i} className="group/dot">
                       <circle
                         cx={i * (700 / (chartData.length - 1))}
                         cy={200 - (d / maxVal * 150)}
                         r="7"
                         fill="white"
                         stroke="#4f46e5"
                         strokeWidth="4"
                         className="cursor-pointer transition-all duration-300 group-hover/dot:r-10"
                       />
                       <text 
                         x={i * (700 / (chartData.length - 1))} 
                         y={200 - (d / maxVal * 150) - 20} 
                         textAnchor="middle" 
                         className="text-[12px] font-black fill-indigo-600 opacity-0 group-hover/dot:opacity-100 transition-opacity"
                       >
                         {d}
                       </text>
                    </g>
                  ))}
               </svg>
               
               {/* Labels X */}
               <div className="flex justify-between mt-8 px-2">
                  {days.map((day, i) => (
                    <span key={i} className={`text-[11px] font-black tracking-tighter ${i === days.length - 1 ? 'text-indigo-600' : 'text-slate-400'}`}>
                      {day}
                    </span>
                  ))}
               </div>
            </div>

            {/* Decoração sutil */}
            <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity">
               <Activity size={300} />
            </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
