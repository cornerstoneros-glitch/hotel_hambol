'use client';

import { useSite } from '@/context/SiteContext';
import { useState } from 'react';

export default function FinancePage() {
  const { currentSite } = useSite();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const financialMetrics = [
    { label: 'Chiffre d&apos;Affaires (CA)', value: 12450000, trend: '+15%', color: 'text-primary' },
    { label: 'Dépenses Opérationnelles', value: 4200000, trend: '-5%', color: 'text-red-500' },
    { label: 'Bénéfice Net Porté', value: 8250000, trend: '+20%', color: 'text-green-500' },
  ];

  const handleTransactionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Saisie comptable enregistrée avec succès (Mode Démo).');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-10 relative">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-title font-bold text-primary">Comptabilité & Finance</h1>
          <p className="text-gray-400 text-sm">Gestion financière OHADA — {currentSite}</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold hover:bg-sand transition-all">
            Exporter (Sage/Excel)
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold shadow-lg hover:bg-primary-dk transition-all"
          >
            + Nouvelle Saisie
          </button>
        </div>
      </header>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {financialMetrics.map((m, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-3 relative overflow-hidden group">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{m.label}</p>
            <div className={`text-3xl font-bold ${m.color}`}>
              {m.value.toLocaleString()} <span className="text-sm">FCFA</span>
            </div>
            <div className="flex items-center gap-2">
               <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${m.trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                 {m.trend}
               </span>
               <span className="text-[10px] text-gray-400">vs mois dernier</span>
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-sand/10 rounded-full translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Breakdown */}
        <div className="lg:col-span-2 bg-[#1A1208] text-white p-10 rounded-[3rem] shadow-xl">
           <h3 className="text-xl font-bold mb-8 flex justify-between items-center">
             Répartition des Revenus
             <span className="text-[10px] font-normal opacity-50 tracking-widest uppercase">Analyse 30 Jours</span>
           </h3>
           <div className="space-y-10">
             {[
               { label: 'Hébergement (Chambres)', value: 65, color: 'bg-accent' },
               { label: 'Restauration (F&B)', value: 25, color: 'bg-green-500' },
               { label: 'Activités & Conciergerie', value: 10, color: 'bg-blue-500' }
             ].map((item, i) => (
               <div key={i} className="space-y-2">
                 <div className="flex justify-between text-xs font-bold tracking-wide">
                   <span>{item.label}</span>
                   <span>{item.value}%</span>
                 </div>
                 <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
                   <div className={`${item.color} h-full transition-all duration-1000`} style={{ width: `${item.value}%` }} />
                 </div>
               </div>
             ))}
           </div>
           <div className="mt-12 pt-8 border-t border-white/5 flex gap-12">
              <div className="space-y-1">
                 <p className="text-[10px] uppercase text-white/30 font-bold tracking-widest">Azaguié</p>
                 <p className="font-bold">5.8M FCFA</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[10px] uppercase text-white/30 font-bold tracking-widest">Yopougon</p>
                 <p className="font-bold">6.6M FCFA</p>
              </div>
           </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100">
           <h3 className="text-xl font-bold text-primary mb-6">Transactions</h3>
           <div className="space-y-6">
             {[1, 2, 3, 4, 5].map(i => (
               <div key={i} className="flex justify-between items-center pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                 <div>
                   <p className="text-xs font-bold text-primary">Facture #INV-00{i}</p>
                   <p className="text-[10px] text-gray-400">Services Restauration</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-bold text-green-600">+12,500</p>
                   <p className="text-[8px] text-gray-400 uppercase">Payé</p>
                 </div>
               </div>
             ))}
           </div>
           <button className="w-full mt-8 py-3 rounded-2xl border border-accent/20 text-accent text-xs font-bold hover:bg-sand transition-all">
             Voir tout le journal
           </button>
        </div>
      </div>

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold font-title text-primary mb-6">Nouvelle Écriture</h2>
            <form onSubmit={handleTransactionSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Type de saisie</label>
                <select className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none">
                  <option>Entrée (Revenu)</option>
                  <option>Sortie (Dépense)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Montant (FCFA)</label>
                <input type="number" required placeholder="Ex: 50000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Description</label>
                <input type="text" required placeholder="Ex: Paiement Fournisseur" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none" />
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-4 hover:bg-primary-dk transition-all">
                Enregistrer la Saisie
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
