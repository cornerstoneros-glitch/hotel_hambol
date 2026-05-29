'use client';

import { useSite } from "@/context/SiteContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function RestaurantPage() {
  const { currentSite } = useSite();
  const [activeTab, setActiveTab] = useState('main'); // main, day, drinks
  const [dishes, setDishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const siteId = currentSite === 'Azaguié' ? 'azaguie' : 'yopougon';
    const fetchMenu = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/admin/menu?siteId=${siteId}`);
        const data = await res.json();
        setDishes(data.dishes);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMenu();
  }, [currentSite]);

  // Static fallback for Menu du Jour (if not in DB yet)
  const menuDuJourStatic = [
    { day: 'Lundi', items: 'Sauce Légume (Pondeuse, Pintade, Poisson), Kédjénou, Soupe de Carpe', price: '2500F - 8000F' },
    { day: 'Mardi', items: 'Tchèp Poulet / Poisson, Soupe Pondeuse, Soupe Carpe', price: '2500F - 8000F' },
    { day: 'Mercredi', items: 'Gouaguassou, Graine, APF / Frites Poulet', price: '2500F - 8000F' },
    { day: 'Jeudi', items: 'Sauce Feuille, Soupe Carpe, Soupe Pondeuse', price: '2500F' },
    { day: 'Vendredi', items: 'Djoumblé Poisson Fumé / Pondeuse, Soupe Carpe', price: '2500F - 3000F' },
    { day: 'Samedi', items: 'Soupe Pondeuse/Carpe, Braisé (Poisson, Poulet), Lapin', price: '5000F - 12000F' },
    { day: 'Dimanche', items: 'Soupe Pondeuse/Carpe, Braisé, Pommes de terre Saucisse', price: '4500F' },
  ];

  // Static fallback for Drinks
  const boissonDataStatic = [
    { name: 'Heineken, Despérados', price: '700F', category: 'Bières' },
    { name: 'Cody\'s, Castel', price: '700F', category: 'Bières' },
    { name: 'Guinness', price: '1000F', category: 'Bières' },
    { name: 'Orangina, Malta', price: '800F', category: 'Sucreries' },
    { name: 'Coca, Sprite', price: '600F', category: 'Softs' },
    { name: 'Vins', price: 'À partir de 2500F', category: 'Vins' },
  ];

  // Filter dynamic dishes
  const grillades = dishes.filter(d => ['Signature', 'Terroir', 'L Excellence'].includes(d.category));
  const kedjenous = dishes.filter(d => d.category === 'Tradition');
  const boissonDataDynamic = dishes.filter(d => ['Boisson', 'Dessert'].includes(d.category));

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
                {grillades.length > 0 ? grillades.map((item, id) => (
                  <div key={id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white overflow-hidden relative shadow-sm border border-[#D4956A]/10">
                        <Image src={item.image || "/images/food/dish_default.png"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[#1A1208] group-hover:text-[#8B3A1A] transition-colors">{item.name}</h3>
                        <p className="text-xs text-[#2E7D1E] uppercase font-bold tracking-tighter">{item.category}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#8B3A1A]">{item.price ? `${item.price.toLocaleString()}F` : 'Sur carte'}</span>
                  </div>
                )) : (
                  <p className="text-gray-400 italic">Chef en préparation...</p>
                )}
              </section>
              <section className="space-y-8">
                <h2 className="font-title text-4xl text-[#8B3A1A] border-b-2 border-[#D4956A] pb-4">Nos Soupes (Kédjénou)</h2>
                {kedjenous.length > 0 ? kedjenous.map((item, id) => (
                  <div key={id} className="flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-white overflow-hidden relative shadow-sm border border-[#D4956A]/10">
                        <Image src={item.image || "/images/food/dish_default.png"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-[#1A1208] group-hover:text-[#8B3A1A] transition-colors">{item.name}</h3>
                        <p className="text-xs text-[#2E7D1E] uppercase font-bold tracking-tighter">{item.category}</p>
                      </div>
                    </div>
                    <span className="font-bold text-[#8B3A1A]">{item.price ? `${item.price.toLocaleString()}F` : 'Sur carte'}</span>
                  </div>
                )) : (
                  <p className="text-gray-400 italic">Saveurs en mijotage...</p>
                )}
              </section>
            </div>
          )}

          {activeTab === 'day' && (
            <div className="max-w-4xl mx-auto space-y-6">
               <h2 className="font-title text-4xl text-center text-[#8B3A1A] mb-12 italic">Le Rendez-vous Quotidien</h2>
               {menuDuJourStatic.map((item, id) => (
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
                    {(boissonDataDynamic.length > 0 ? boissonDataDynamic : boissonDataStatic).filter(i => i.category === cat || (cat === 'Bières' && i.category === 'Bières') || (cat === 'Sucreries' && i.category === 'Sucreries') || (cat === 'Softs' && i.category === 'Softs') || (cat === 'Vins' && i.category === 'Vins')).map((item, id) => (
                      <div key={id} className="flex justify-between items-center gap-4">
                        <span className="font-bold text-sm text-[#1A1208] flex-1">{item.name}</span>
                        <span className="text-[#8B3A1A] font-bold text-sm whitespace-nowrap">{item.price ? (typeof item.price === 'number' ? `${item.price.toLocaleString()}F` : item.price) : 'Sur carte'}</span>
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
