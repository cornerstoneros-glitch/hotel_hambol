'use client';

import { useState } from 'react';
import { useSite } from '@/context/SiteContext';

const MOCK_INVENTORY = [
  { id: '1', name: 'Riz Perfumé', category: 'F&B', quantity: 25, unit: 'kg', threshold: 10 },
  { id: '2', name: 'Serviettes Luxe', category: 'Linge', quantity: 4, unit: 'unités', threshold: 12 },
  { id: '3', name: 'Savon Artisanal', category: 'Gouvernance', quantity: 45, unit: 'unités', threshold: 20 },
  { id: '4', name: 'Vin de Palme - Grand Cru', category: 'F&B', quantity: 3, unit: 'bouteilles', threshold: 6 },
  { id: '5', name: 'Draps Coton Égypte', category: 'Linge', quantity: 22, unit: 'unités', threshold: 10 },
];

export default function InventoryPage() {
  const { currentSite } = useSite();
  const [filter, setFilter] = useState('All');

  const filteredItems = filter === 'All' 
    ? MOCK_INVENTORY 
    : MOCK_INVENTORY.filter(item => item.category === filter);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-title font-bold text-primary">Gestion des Stocks</h1>
          <p className="text-gray-400 text-sm">Inventaire centralisé — {currentSite}</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-dk transition-all">
          + Entrée de Stock
        </button>
      </header>

      {/* Alerts Banner */}
      <div className="bg-amber-50 border-l-8 border-amber-400 p-6 rounded-2xl flex items-center gap-6">
        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl">⚠️</div>
        <div>
          <h4 className="font-bold text-amber-800">Alertes Stock Critique</h4>
          <p className="text-amber-700/80 text-sm">2 articles sont en dessous du seuil de sécurité. Veuillez réapprovisionner.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        {['All', 'F&B', 'Linge', 'Gouvernance'].map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              filter === cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-400 border-gray-100 hover:border-accent'
            }`}
          >
            {cat === 'All' ? 'Tous les produits' : cat}
          </button>
        ))}
      </div>

      {/* Inventory List */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F9FA] border-b border-gray-100 text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-10 py-5">Article</th>
              <th className="px-10 py-5">Catégorie</th>
              <th className="px-10 py-5 text-center">Quantité</th>
              <th className="px-10 py-5">Unité</th>
              <th className="px-10 py-5">Statut</th>
              <th className="px-10 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredItems.map(item => {
              const isLow = item.quantity <= item.threshold;
              return (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-10 py-6">
                    <span className="font-bold text-primary">{item.name}</span>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-[10px] p-1 px-2 bg-gray-100 rounded font-bold uppercase">{item.category}</span>
                  </td>
                  <td className="px-10 py-6 text-center">
                    <span className={`text-lg font-bold ${isLow ? 'text-red-500' : 'text-primary'}`}>
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-gray-400">{item.unit}</td>
                  <td className="px-10 py-6">
                    <span className={`p-1 px-3 rounded-full text-[10px] font-bold ${
                      isLow ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                    }`}>
                      {isLow ? 'CRITIQUE' : 'OPTIMAL'}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="p-2 hover:bg-sand rounded-xl transition-all">📝</button>
                    <button className="p-2 hover:bg-sand rounded-xl transition-all ml-2">🔄</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
