'use client';

import { useSite } from "@/context/SiteContext";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RestaurantPage() {
  const { currentSite } = useSite();
  const [activeTab, setActiveTab] = useState('main'); // main, day, drinks

  const menuData = {
    'Menu du Jour': [
      { day: 'Lundi', items: 'Sauce Légume (Pondeuse, Pintade, Poisson), Kédjénou, Soupe de Carpe', price: '2500F - 8000F' },
      { day: 'Mardi', items: 'Tchèp Poulet / Poisson, Soupe Pondeuse, Soupe Carpe', price: '2500F - 8000F' },
      { day: 'Mercredi', items: 'Gouaguassou, Graine, APF / Frites Poulet', price: '2500F - 8000F' },
      { day: 'Jeudi', items: 'Sauce Feuille, Soupe Carpe, Soupe Pondeuse', price: '2500F' },
      { day: 'Vendredi', items: 'Djoumblé Poisson Fumé / Pondeuse, Soupe Carpe', price: '2500F - 3000F' },
      { day: 'Samedi', items: 'Soupe Pondeuse/Carpe, Braisé (Poisson, Poulet), Lapin', price: '5000F - 12000F' },
      { day: 'Dimanche', items: 'Soupe Pondeuse/Carpe, Braisé, Pommes de terre Saucisse', price: '4500F' },
    ],
    'Grillades & Braises': [
      { name: 'Carpes / Saint Pierre Braisés', price: '4000F - 8000F', category: 'Poisson' },
      { name: 'Capitaine / Sosso / Sol', price: '3000F - 10000F', category: 'Poisson' },
      { name: 'Poulet Braisé (Entier)', price: '6000F', category: 'Viande' },
      { name: 'Pintade / Lapin (Entier)', price: '12000F', category: 'Viande' },
      { name: 'Brochettes (Bœuf, Poulet, Gésiers)', price: '1500F / brochette', category: 'Snack' },
    ],
    'Nos Soupes (Kédjénou)': [
      { name: 'Lapin / Pintade', price: '6500F (1/2) / 12000F', category: 'Spécialité' },
      { name: 'Pondeuse', price: '4500F (1/2) / 8000F', category: 'Spécialité' },
      { name: 'Poissons (Carpe / Saint Pierre)', price: '5000F - 8000F', category: 'Poisson' },
    ],
    'Boissons & Sucreries': [
      { name: 'Heineken, Despérados, Beaufort', price: '700F', category: 'Bières' },
      { name: 'Cody\'s, Castel, Bock 66', price: '700F', category: 'Bières' },
      { name: 'Guinness, Budweiser', price: '1000F', category: 'Bières' },
      { name: 'Chill, Orangina, Malta, Smirnoff Ice', price: '800F', category: 'Sucreries' },
      { name: 'Coca, Sprite, Fanta, Tonic', price: '600F - 700F', category: 'Softs' },
      { name: 'Vins', price: 'À partir de 2500F', category: 'Vins' },
    ]
  };

  return (
    <div className="min-h-screen bg-[#F5EDE0]">
      {/* Hero Header */}
      <div className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <Image 
          src={currentSite === 'Azaguié' ? "/images/azaguie/hero.jpg" : "/images/yopougon/hero.jpg"} 
          alt="Restaurant Hero" 
          fill 
          className="object-cover brightness-50"
        />
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="font-title text-6xl font-bold mb-4">L&apos;Art du Goût</h1>
          <p className="font-body text-xl tracking-widest uppercase opacity-80">La Gastronomie de {currentSite}</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto py-20 px-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <button 
            onClick={() => setActiveTab('main')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'main' ? 'bg-[#8B3A1A] text-white shadow-xl scale-105' : 'bg-white text-[#8B3A1A] hover:bg-[#F5EDE0] border border-[#D4956A]/20'}`}
          >
            Grillades & Kédjénous
          </button>
          <button 
            onClick={() => setActiveTab('day')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'day' ? 'bg-[#8B3A1A] text-white shadow-xl scale-105' : 'bg-white text-[#8B3A1A] hover:bg-[#F5EDE0] border border-[#D4956A]/20'}`}
          >
            Menu du Jour
          </button>
          <button 
            onClick={() => setActiveTab('drinks')}
            className={`px-8 py-3 rounded-full font-bold transition-all ${activeTab === 'drinks' ? 'bg-[#8B3A1A] text-white shadow-xl scale-105' : 'bg-white text-[#8B3A1A] hover:bg-[#F5EDE0] border border-[#D4956A]/20'}`}
          >
            Boissons & Sucreries
          </button>
        </div>

        {/* Menu Content */}
        <div className="animate-fade-in">
          {activeTab === 'main' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <section className="space-y-8">
                <h2 className="font-title text-4xl text-[#8B3A1A] border-b-2 border-[#D4956A] pb-4">Nos Grillades & Braises</h2>
                {menuData['Grillades & Braises'].map((item, id) => (
                  <div key={id} className="flex justify-between items-center group">
                    <div>
                      <h3 className="font-bold text-lg text-[#1A1208] group-hover:text-[#8B3A1A] transition-colors">{item.name}</h3>
                      <p className="text-xs text-[#2E7D1E] uppercase font-bold tracking-tighter">{item.category}</p>
                    </div>
                    <span className="font-bold text-[#8B3A1A]">{item.price}</span>
                  </div>
                ))}
              </section>
              <section className="space-y-8">
                <h2 className="font-title text-4xl text-[#8B3A1A] border-b-2 border-[#D4956A] pb-4">Nos Soupes (Kédjénou)</h2>
                {menuData['Nos Soupes (Kédjénou)'].map((item, id) => (
                  <div key={id} className="flex justify-between items-center group">
                    <div>
                      <h3 className="font-bold text-lg text-[#1A1208] group-hover:text-[#8B3A1A] transition-colors">{item.name}</h3>
                      <p className="text-xs text-[#2E7D1E] uppercase font-bold tracking-tighter">{item.category}</p>
                    </div>
                    <span className="font-bold text-[#8B3A1A]">{item.price}</span>
                  </div>
                ))}
              </section>
            </div>
          )}

          {activeTab === 'day' && (
            <div className="max-w-4xl mx-auto space-y-6">
               <h2 className="font-title text-4xl text-center text-[#8B3A1A] mb-12 italic">Le Rendez-vous Quotidien</h2>
               {menuData['Menu du Jour'].map((item, id) => (
                  <div key={id} className="flex flex-col sm:flex-row gap-4 justify-between items-center p-8 bg-white border-l-8 border-[#2E7D1E] rounded-2xl shadow-lg hover:shadow-2xl transition-all">
                    <span className="font-title text-3xl font-bold text-[#8B3A1A] w-32">{item.day}</span>
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-[#1A1208] font-medium leading-relaxed">{item.items}</p>
                    </div>
                    <span className="font-bold bg-[#F5EDE0] text-[#8B3A1A] px-6 py-2 rounded-full border border-[#D4956A]">{item.price}</span>
                  </div>
               ))}
               <p className="text-center text-gray-500 italic mt-8 text-sm">Servis tous les jours de 12h00 à 15h00.</p>
            </div>
          )}

          {activeTab === 'drinks' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {['Bières', 'Sucreries', 'Softs', 'Vins'].map(cat => (
                  <section key={cat} className="space-y-6">
                    <h2 className="font-title text-3xl text-[#8B3A1A] border-b border-[#D4956A]/30 pb-2">{cat}</h2>
                    {menuData['Boissons & Sucreries'].filter(i => i.category === cat || (cat === 'Bières' && i.category === 'Bières')).map((item, id) => (
                      <div key={id} className="flex justify-between items-center gap-4">
                        <span className="font-bold text-sm text-[#1A1208] flex-1">{item.name}</span>
                        <span className="text-[#8B3A1A] font-bold text-sm whitespace-nowrap">{item.price}</span>
                      </div>
                    ))}
                  </section>
               ))}
            </div>
          )}
        </div>

        <div className="mt-32 text-center p-16 bg-[#1A1208] text-[#F5EDE0] rounded-[4rem] relative overflow-hidden">
           <h2 className="font-title text-5xl font-bold mb-8 italic">Réserver une Table</h2>
           <p className="max-w-2xl mx-auto mb-10 opacity-70">Venez vivre l&apos;expérience culinaire Hambol. Privatisation possible pour vos événements (mariages, dîners d&apos;affaires).</p>
           <Link href="/contact" className="inline-block bg-[#8B3A1A] text-white px-12 py-5 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-3xl">
             Contacter le Maître d&apos;Hôtel
           </Link>
           <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E7D1E]/10 rounded-full blur-3xl -mr-32 -mt-32" />
        </div>
      </main>
    </div>
  );
}
