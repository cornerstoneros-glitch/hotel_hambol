'use client';

import { useSite } from '@/context/SiteContext';

const CLIENT_GUESTS = [
  { id: '1', name: 'Jean-Luc Gbagbo', email: 'j.gbagbo@mail.ci', tier: 'PLATINUM', visits: 12, spent: 2450000 },
  { id: '2', name: 'Sophie Mensah', email: 'sophie.m@provider.com', tier: 'GOLD', visits: 5, spent: 850000 },
  { id: '3', name: 'Désiré N&apos;Guessan', email: 'desire.ng@inter.com', tier: 'STANDARD', visits: 1, spent: 125000 },
  { id: '4', name: 'Marie-Louise Yao', email: 'ml.yao@corporate.ci', tier: 'GOLD', visits: 8, spent: 1100000 },
];

export default function CRMPage() {
  const { currentSite } = useSite();

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-title font-bold text-primary text-primary-content">CRM & Fidélité</h1>
          <p className="text-gray-400 text-sm">Gestion des Clients — {currentSite}</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-dk transition-all">
          + Nouveau Profil Client
        </button>
      </header>

      {/* Loyalty Tiers Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { name: 'Platinum', color: 'bg-indigo-600', count: 12 },
          { name: 'Gold', color: 'bg-amber-500', count: 45 },
          { name: 'Silver', color: 'bg-gray-400', count: 89 },
          { name: 'Standard', color: 'bg-sand', count: 234 }
        ].map((tier, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center justify-between">
             <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{tier.name}</p>
                <h4 className="text-xl font-bold text-primary">{tier.count} Clients</h4>
             </div>
             <div className={`w-3 h-10 rounded-full ${tier.color}`} />
          </div>
        ))}
      </div>

      {/* Guest Directory */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F9FA] text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-10 py-5">Client</th>
              <th className="px-10 py-5">Niveau</th>
              <th className="px-10 py-5 text-center">Séjours</th>
              <th className="px-10 py-5">Total Dépensé</th>
              <th className="px-10 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {CLIENT_GUESTS.map(guest => (
              <tr key={guest.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sand flex items-center justify-center font-bold text-primary text-xs uppercase">
                      {guest.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-bold text-primary">{guest.name}</p>
                      <p className="text-[10px] text-gray-400">{guest.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    guest.tier === 'PLATINUM' ? 'bg-indigo-100 text-indigo-700' :
                    guest.tier === 'GOLD' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {guest.tier}
                  </span>
                </td>
                <td className="px-10 py-6 text-center text-primary font-bold">{guest.visits}</td>
                <td className="px-10 py-6 font-mono font-bold text-primary">{guest.spent.toLocaleString()} FCFA</td>
                <td className="px-10 py-6 text-right">
                   <button className="px-3 py-1 bg-sand/30 hover:bg-sand rounded-lg text-xs font-bold text-primary transition-all">
                     Détails 360°
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
