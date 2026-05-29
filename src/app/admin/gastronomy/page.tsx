'use client';

import { useState } from 'react';
import { useSite } from '@/context/SiteContext';

const MENU_ITEMS = [
  { id: '1', name: 'Poulet Braisé Hambol', category: 'Plats', price: 8500 },
  { id: '2', name: 'Alloco au Poisson', category: 'Plats', price: 6500 },
  { id: '3', name: 'Vin de Palme - Grand Cru', category: 'Boissons', price: 12000 },
  { id: '4', name: 'Attiéké Poisson Grillé', category: 'Plats', price: 7500 },
  { id: '5', name: 'Jus Naturel Gingembre', category: 'Boissons', price: 2500 },
];

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
}

interface CartItem extends MenuItem {
  orderId: string;
}

export default function GastronomyPage() {
  const { currentSite } = useSite();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [roomNumber, setRoomNumber] = useState('');

  const addToCart = (item: MenuItem) => {
    const orderId = `ORD-${cart.length + 1}`;
    setCart([...cart, { ...item, orderId }]);
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-title font-bold text-primary">Gastronomie & POS</h1>
          <p className="text-gray-400 text-sm">Gestion de la Restauration — {currentSite}</p>
        </div>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold hover:bg-sand transition-all">
             Écran Cuisine (KDS)
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Menu Grid */}
        <div className="lg:col-span-2 space-y-8">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {MENU_ITEMS.map((item) => (
               <button 
                 key={item.id} 
                 onClick={() => addToCart(item)}
                 className="p-6 bg-white rounded-[2rem] shadow-sm border border-gray-100 flex justify-between items-center hover:border-accent hover:shadow-lg transition-all text-left"
               >
                 <div>
                   <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">{item.category}</p>
                   <h4 className="font-bold text-primary">{item.name}</h4>
                   <p className="text-accent font-bold mt-1">{item.price.toLocaleString()} FCFA</p>
                 </div>
                 <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center text-xl">+</div>
               </button>
             ))}
           </div>
        </div>

        {/* Current Order / Cart */}
        <div className="bg-[#1A1208] text-white p-10 rounded-[3rem] shadow-xl flex flex-col h-[700px]">
           <h3 className="text-xl font-bold mb-8 border-b border-white/5 pb-4">Commande en Cours</h3>
           
           <div className="flex-1 overflow-y-auto space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/30 space-y-4">
                  <div className="text-5xl">🛒</div>
                  <p className="text-xs uppercase font-bold tracking-widest text-center">Panier vide<br/>en attente de sélection</p>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div className="flex gap-4 items-center">
                       <span className="text-[10px] font-bold text-accent">1x</span>
                       <div>
                         <p className="text-sm font-bold">{item.name}</p>
                         <p className="text-[10px] text-white/40">#{item.orderId}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setCart(cart.filter((_, idx) => idx !== i))}
                      className="text-white/20 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
           </div>

           <div className="mt-10 pt-10 border-t border-white/10 space-y-6">
              <div className="flex justify-between items-end">
                 <span className="text-xs font-bold uppercase tracking-widest text-white/40">Total</span>
                 <span className="text-3xl font-bold text-accent">{total.toLocaleString()} <span className="text-sm">FCFA</span></span>
              </div>

              <div className="space-y-4">
                <input 
                  type="text" 
                  placeholder="Chambre # (ex: 04)" 
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent transition-all"
                />
                <button 
                  disabled={cart.length === 0}
                  className={`w-full py-4 rounded-2xl font-bold text-sm shadow-xl transition-all ${
                    cart.length > 0 ? 'bg-accent text-white hover:bg-accent/80' : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }`}
                >
                  Charger sur la Chambre
                </button>
                <button 
                  disabled={cart.length === 0}
                  className={`w-full py-4 rounded-2xl font-bold text-sm border border-white/10 transition-all ${
                    cart.length > 0 ? 'hover:bg-white/5' : 'text-white/20 cursor-not-allowed'
                  }`}
                >
                  Paiement Comptant (Cash/MoMo)
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
