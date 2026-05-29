'use client';

import { useSite } from '@/context/SiteContext';
import { useState } from 'react';

const STAFF_LIST = [
  { id: '1', name: 'Kouassi Konan', role: 'Réceptionniste', site: 'Azaguié', status: 'ON_DUTY' },
  { id: '2', name: 'Awa Traoré', role: 'Chef de Rang', site: 'Yopougon', status: 'ON_DUTY' },
  { id: '3', name: 'Moussa Diakité', role: 'Maintenance', site: 'Azaguié', status: 'OFF' },
  { id: '4', name: 'Yao Koffi', role: 'Gouvernante', site: 'Yopougon', status: 'OFF' },
  { id: '5', name: 'Cissé Mariam', role: 'Manager site', site: 'Azaguié', status: 'ON_DUTY' },
];

export default function HRPage() {
  const { currentSite } = useSite();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-title font-bold text-primary">Ressources Humaines</h1>
          <p className="text-gray-400 text-sm">Gestion des Équipes — {currentSite}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-dk transition-all">
          + Ajouter un Employé
        </button>
      </header>

      {/* Staff Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
           <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">👥</div>
           <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Total Effectif</p>
              <h4 className="text-2xl font-bold text-primary">24 Agents</h4>
           </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
           <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-3xl">✅</div>
           <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Présents ce jour</p>
              <h4 className="text-2xl font-bold text-primary">18 Agents</h4>
           </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6">
           <div className="w-16 h-16 bg-sand rounded-2xl flex items-center justify-center text-3xl">📅</div>
           <div>
              <p className="text-[10px] uppercase font-bold text-gray-400">Planning S22</p>
              <h4 className="text-2xl font-bold text-accent">Validé</h4>
           </div>
        </div>
      </div>

      {/* Staff Directory */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
           <h3 className="text-xl font-bold text-primary">Répertoire du Personnel</h3>
           <div className="flex gap-4">
             <input type="text" placeholder="Rechercher un nom..." className="px-4 py-2 bg-sand/30 border border-transparent rounded-xl text-xs focus:bg-white focus:border-accent outline-none" />
           </div>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-[#F8F9FA] text-gray-400 font-bold uppercase text-[10px] tracking-widest">
            <tr>
              <th className="px-10 py-5">Employé</th>
              <th className="px-10 py-5">Poste</th>
              <th className="px-10 py-5">Site Affecté</th>
              <th className="px-10 py-5">Statut</th>
              <th className="px-10 py-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {STAFF_LIST.map(staff => (
              <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-sand flex items-center justify-center text-[10px] font-bold text-primary">
                      {staff.name.charAt(0)}
                    </div>
                    <span className="font-bold text-primary">{staff.name}</span>
                  </div>
                </td>
                <td className="px-10 py-6 text-gray-500">{staff.role}</td>
                <td className="px-10 py-6">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${staff.site === 'Azaguié' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {staff.site}
                  </span>
                </td>
                <td className="px-10 py-6">
                  <span className={`flex items-center gap-2 text-[10px] font-bold ${staff.status === 'ON_DUTY' ? 'text-green-600' : 'text-gray-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${staff.status === 'ON_DUTY' ? 'bg-green-500 shadow-[0_0_5px_#22c55e]' : 'bg-gray-300'}`} />
                    {staff.status === 'ON_DUTY' ? 'EN SERVICE' : 'REPOS'}
                  </span>
                </td>
                <td className="px-10 py-6 text-right">
                   <button className="text-xs font-bold text-accent underline">Détails</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold font-title text-primary mb-6">Ajouter un Employé</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Action simulée avec succès.'); setIsModalOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nom Complet</label>
                <input type="text" required placeholder="Ex: Kouassi Konan" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none" />
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-4 hover:bg-primary-dk transition-all">
                Enregistrer l'Employé
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
