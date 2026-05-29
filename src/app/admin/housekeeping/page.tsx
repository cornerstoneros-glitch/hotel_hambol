'use client';

import { useSite } from '@/context/SiteContext';

export default function HousekeepingPage() {
  const { currentSite } = useSite();

  const roomStatuses = [
    { num: '01', status: 'AVAILABLE', type: 'Suite Royale' },
    { num: '02', status: 'DIRTY', type: 'Standard' },
    { num: '03', status: 'CLEANING', type: 'Luxe' },
    { num: '04', status: 'MAINTENANCE', type: 'Suite Horizon' },
    { num: '05', status: 'AVAILABLE', type: 'Luxe' },
    { num: '06', status: 'DIRTY', type: 'Standard' },
    { num: '07', status: 'AVAILABLE', type: 'Luxe' },
    { num: '08', status: 'AVAILABLE', type: 'Suite Royale' },
    { num: '09', status: 'DIRTY', type: 'Standard' },
    { num: '10', status: 'CLEANING', type: 'Luxe' },
    { num: '11', status: 'AVAILABLE', type: 'Suite Horizon' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-title font-bold text-primary">Gouvernance & Entretien</h1>
          <p className="text-gray-400 text-sm">Gestion du Housekeeping — {currentSite}</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg hover:bg-primary-dk transition-all">
            Assigner le Nettoyage
          </button>
        </div>
      </header>

      {/* Housekeeping Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {roomStatuses.map((room) => (
          <div key={room.num} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-6 group hover:shadow-xl transition-all">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Suite {room.num}</p>
                <h4 className="font-bold text-primary">{room.type}</h4>
              </div>
              <span className={`px-3 py-1 rounded-full text-[8px] font-bold ${
                room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                room.status === 'DIRTY' ? 'bg-red-100 text-red-700' :
                room.status === 'CLEANING' ? 'bg-blue-100 text-blue-700 animate-pulse' :
                'bg-orange-100 text-orange-700'
              }`}>
                {room.status}
              </span>
            </div>

            <div className="space-y-3">
               <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-400">Dernier passage</span>
                  <span className="font-medium">Hier, 16:30</span>
               </div>
               <div className="flex justify-between text-xs items-center">
                  <span className="text-gray-400">Priorité</span>
                  <span className={`font-bold ${room.status === 'DIRTY' ? 'text-red-500' : 'text-gray-900'}`}>
                    {room.status === 'DIRTY' ? 'HAUTE' : 'NORMALE'}
                  </span>
               </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-50">
               <button className="flex-1 py-2 rounded-xl bg-sand/30 text-accent text-[10px] font-bold hover:bg-accent hover:text-white transition-all uppercase tracking-widest">
                 Détails Inspect.
               </button>
               <button className="flex-1 py-2 rounded-xl bg-primary text-white text-[10px] font-bold hover:bg-primary-dk transition-all uppercase tracking-widest">
                 Valider État
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Maintenance Alerts */}
      <div className="bg-[#1A1208] text-white p-10 rounded-[3rem] shadow-xl">
         <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
           🛠️ Maintenance & Incidents
           <span className="px-2 py-1 bg-red-100 text-red-600 rounded text-[10px] uppercase font-bold tracking-widest">1 Urgent</span>
         </h3>
         <div className="space-y-4">
            <div className="p-6 bg-white/5 rounded-2xl flex justify-between items-center border border-white/5 hover:border-white/20 transition-all">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center font-bold">!</div>
                  <div>
                    <h5 className="font-bold">Fuite Climatisation — Suite 04</h5>
                    <p className="text-xs text-white/50">Signalé par Housekeeping il y a 2h</p>
                  </div>
               </div>
               <button className="px-4 py-2 bg-white text-[#1A1208] rounded-xl text-[10px] font-bold hover:bg-accent hover:text-white transition-all">
                 Assigner Tech
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
