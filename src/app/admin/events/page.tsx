'use client';

import { useSite } from '@/context/SiteContext';
import { useState } from 'react';

const UPCOMING_EVENTS = [
  { id: '1', title: 'Mariage Konan & Awa', date: '2026-06-15', site: 'Azaguié', guestCount: 250, status: 'CONFIRMED' },
  { id: '2', title: 'Séminaire Banque Mondiale', date: '2026-06-18', site: 'Yopougon', guestCount: 45, status: 'QUOTED' },
  { id: '3', title: 'Concert Privé Reggae', date: '2026-06-25', site: 'Yopougon', guestCount: 500, status: 'PENDING' },
  { id: '4', title: 'Lancement Produit Cosmétique', date: '2026-07-02', site: 'Azaguié', guestCount: 120, status: 'CONFIRMED' },
];

export default function EventsPage() {
  const { currentSite } = useSite();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-title font-bold text-primary">Événements & Business</h1>
          <p className="text-gray-400 text-sm">Gestion des Salles & Conventions — {currentSite}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-dk transition-all">
          + Créer un Devis Événement
        </button>
      </header>

      {/* Venue Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative group overflow-hidden">
           <h3 className="text-xl font-bold text-primary mb-6">Salle des Congrès</h3>
           <div className="flex items-center gap-4 mb-4">
              <span className="p-1 px-3 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">LIBRE</span>
              <span className="text-xs text-gray-400">Capacité : 500 pers.</span>
           </div>
           <p className="text-xs text-gray-500 leading-relaxed group-hover:text-primary transition-colors">Idéale pour les mariages de prestige et les grands concerts en plein air.</p>
           <div className="absolute top-0 right-0 w-32 h-32 bg-sand/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-100 relative group overflow-hidden">
           <h3 className="text-xl font-bold text-primary mb-6">Espace Business Center</h3>
           <div className="flex items-center gap-4 mb-4">
              <span className="p-1 px-3 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">OCCUPÉ</span>
              <span className="text-xs text-gray-400">Capacité : 40 pers.</span>
           </div>
           <p className="text-xs text-gray-500 leading-relaxed group-hover:text-primary transition-colors">Équipé de solutions de haute technologie pour vos séminaires exécutifs.</p>
           <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="bg-[#1A1208] text-white p-10 rounded-[3rem] shadow-xl overflow-hidden">
        <div className="flex justify-between items-center mb-10">
           <h3 className="text-xl font-bold">Calendrier des Cérémonies & Séminaires</h3>
           <button className="text-[10px] font-bold text-accent tracking-widest uppercase underline">Voir le calendrier complet</button>
        </div>
        
        <div className="space-y-6">
          {UPCOMING_EVENTS.map(event => (
            <div key={event.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-white/20 transition-all gap-6">
               <div className="flex gap-6 items-center">
                  <div className="text-center min-w-[60px]">
                     <p className="text-2xl font-bold text-accent">{event.date.split('-')[2]}</p>
                     <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{new Date(event.date).toLocaleDateString('fr', { month: 'short' })}</p>
                  </div>
                  <div className="h-10 w-[1px] bg-white/10 hidden md:block" />
                  <div>
                    <h5 className="font-bold">{event.title}</h5>
                    <p className="text-[10px] text-white/50">{event.guestCount} invités • {event.site}</p>
                  </div>
               </div>
               <div className="flex items-center gap-6">
                  <span className={`px-3 py-1 rounded text-[10px] font-bold ${
                    event.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-500' :
                    event.status === 'QUOTED' ? 'bg-blue-500/20 text-blue-500' :
                    'bg-amber-500/20 text-amber-500'
                  }`}>
                    {event.status}
                  </span>
                  <button className="p-2 bg-white/10 rounded-xl hover:bg-white text-[10px] hover:text-[#1A1208] transition-all font-bold font-title">
                    Gérer
                  </button>
               </div>
            </div>
          ))}
        </div>
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
            <h2 className="text-2xl font-bold font-title text-primary mb-6">Créer un Devis</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Action simulée avec succès.'); setIsModalOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Titre Événement</label>
                <input type="text" required placeholder="Ex: Soirée de Gala" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none" />
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-4 hover:bg-primary-dk transition-all">
                Générer le Devis
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
