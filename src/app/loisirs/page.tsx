'use client';

import { useSite } from "@/context/SiteContext";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LoisirsPage() {
  const { currentSite } = useSite();
  const [activeTab, setActiveTab] = useState('pool'); // pool, sports, kids, relax

  const leisureData = {
    'pool': [
      { name: 'Piscine Adulte (Grand Bain)', price: '3000 F / adulte', category: 'Aqua', site: 'all' },
      { name: 'Piscine Enfant', price: '2000 F / enfant', category: 'Aqua', site: 'all' },
      { name: 'Bar VIP Immergé', price: 'Accès Libre', category: 'Aqua', site: 'all' },
    ],
    'sports': [
      { name: 'Maracana (Football)', price: '15000 F / heure', category: 'Sport', site: 'all' },
      { name: 'Pétanque', price: 'Gratuit pour les résidents', category: 'Sport', site: 'all' },
      { name: 'Espace Jeux de Société (Ludo, Awalé, Dames)', price: 'Gratuit', category: 'Animation', site: 'all' },
    ],
    'relax': [
      { name: 'Espace Détente & Lits Balinais', price: '10000 F / jour', category: 'Relaxation', site: 'Azaguié' },
      { name: 'Massages Traditionnels', price: '25000 F / séance', category: 'Bien-être', site: 'Azaguié' },
      { name: 'Balade en Forêt Guidée', price: '5000 F', category: 'Nature', site: 'Azaguié' },
      { name: 'Soirée Night Club VIP', price: 'Sur Réservation', category: 'Divertissement', site: 'Yopougon' },
    ],
    'kids': [
      { name: 'Aire de Jeux Extérieure', price: 'Gratuit', category: 'Enfants', site: 'all' },
      { name: 'Animations Découvertes', price: 'Sur Programme', category: 'Enfants', site: 'Azaguié' },
    ]
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Hero Header */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <Image 
          src={currentSite === 'Azaguié' ? "/images/azaguie/pool.jpg" : "/images/yopougon/pool.jpg"} 
          alt="Loisirs Hero" 
          fill 
          className="object-cover brightness-50"
        />
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="font-title text-6xl font-bold mb-4">Détente & Loisirs</h1>
          <p className="font-body text-xl tracking-widest uppercase opacity-80">Les Activités de {currentSite}</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto py-20 px-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button 
            onClick={() => setActiveTab('pool')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'pool' ? 'bg-[#8B3A1A] text-white shadow-xl scale-105' : 'bg-white text-[#8B3A1A] hover:bg-[#FDFBF7] border border-[#D4956A]/20'}`}
          >
            Piscine & Aqua
          </button>
          <button 
            onClick={() => setActiveTab('sports')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'sports' ? 'bg-[#8B3A1A] text-white shadow-xl scale-105' : 'bg-white text-[#8B3A1A] hover:bg-[#FDFBF7] border border-[#D4956A]/20'}`}
          >
            Sports & Jeux
          </button>
           <button 
            onClick={() => setActiveTab('relax')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'relax' ? 'bg-[#8B3A1A] text-white shadow-xl scale-105' : 'bg-white text-[#8B3A1A] hover:bg-[#FDFBF7] border border-[#D4956A]/20'}`}
          >
            Détente & Spécialités
          </button>
          <button 
            onClick={() => setActiveTab('kids')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'kids' ? 'bg-[#8B3A1A] text-white shadow-xl scale-105' : 'bg-white text-[#8B3A1A] hover:bg-[#FDFBF7] border border-[#D4956A]/20'}`}
          >
            Espace Enfants
          </button>
        </div>

        {/* Content */}
        <div className="animate-fade-in max-w-4xl mx-auto space-y-8">
          <h2 className="font-title text-4xl text-[#8B3A1A] border-b-2 border-[#D4956A] pb-4">
            {activeTab === 'pool' ? 'Complexe Aquatique' : 
             activeTab === 'sports' ? 'Défis & Cohésion' : 
             activeTab === 'relax' ? 'Moments de Grâce' : 
             'Activités Juniors'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             {leisureData[activeTab as keyof typeof leisureData]
                .filter(item => item.site === 'all' || item.site === currentSite)
                .map((item, id) => (
                  <div key={id} className="flex flex-col justify-between p-6 bg-white border border-[#D4956A]/20 rounded-3xl shadow-lg hover:shadow-xl transition-all group">
                    <div className="mb-4">
                      <p className="text-[10px] text-accent uppercase font-bold tracking-[0.2em] mb-2">{item.category}</p>
                      <h3 className="font-bold text-xl text-[#1A1208] group-hover:text-[#8B3A1A] transition-colors">{item.name}</h3>
                    </div>
                    <span className="font-bold text-[#8B3A1A] bg-[#FDFBF7] self-start px-4 py-2 rounded-full border border-[#D4956A]/10">
                      {item.price}
                    </span>
                  </div>
              ))}
          </div>

          {leisureData[activeTab as keyof typeof leisureData].filter(item => item.site === 'all' || item.site === currentSite).length === 0 && (
            <p className="text-center text-gray-400 italic py-12">
              Cette activité n&apos;est pas disponible sur le site de {currentSite}.
            </p>
          )}

        </div>

        <div className="mt-32 text-center p-16 bg-[#1A1208] text-[#FDFBF7] rounded-[4rem] relative overflow-hidden">
           <h2 className="font-title text-5xl font-bold mb-8 italic">Réserver une Activité</h2>
           <p className="max-w-2xl mx-auto mb-10 opacity-70">Privatisez un espace ou réservez un terrain pour vos événements sportifs et vos journées d&apos;entreprise.</p>
           <Link href="/reservations?type=loisirs" className="inline-block bg-[#8B3A1A] text-white px-12 py-5 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-3xl">
             Voir les Disponibilités
           </Link>
           <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-32 -mt-32" />
        </div>
      </main>
    </div>
  );
}
