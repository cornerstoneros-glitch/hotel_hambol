'use client';

import { useSite } from '@/context/SiteContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentSite, setCurrentSite } = useSite();
  const { logout, user } = useAuth();
  const pathname = usePathname();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { name: 'Tableau de Bord', path: '/admin', icon: '📊' },
    { name: 'Réservations', path: '/admin/reservations', icon: '📅' },
    { name: 'Gouvernance', path: '/admin/housekeeping', icon: '🧹' },
    { name: 'Restauration', path: '/admin/gastronomy', icon: '🍽️' },
    { name: 'Événements', path: '/admin/events', icon: '🎪' },
    { name: 'Stock / Inventaire', path: '/admin/inventory', icon: '📦' },
    { name: 'Comptabilité', path: '/admin/finance', icon: '💰' },
    { name: 'Clients (CRM)', path: '/admin/clients', icon: '🤝' },
    { name: 'Ressources Humaines', path: '/admin/hr', icon: '👥' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F9FA] text-[#1A1208]">
      {/* Sidebar */}
      <aside className={`bg-[#1A1208] text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col`}>
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && <span className="font-title text-xl font-bold tracking-tighter">Hambol Admin</span>}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-white/50 hover:text-white">
            {isSidebarOpen ? '❮' : '❯'}
          </button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                pathname === item.path ? 'bg-accent text-white shadow-lg' : 'hover:bg-white/5 text-white/60'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {isSidebarOpen && <span className="font-medium text-sm">{item.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
           {isSidebarOpen && <p className="text-[10px] uppercase font-bold text-white/30 tracking-widest">Site Actif</p>}
           <div className={`flex flex-col gap-2 ${!isSidebarOpen && 'items-center'}`}>
             <button 
               onClick={() => setCurrentSite('Azaguié')}
               className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                 currentSite === 'Azaguié' ? 'bg-[#2E7D1E] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
               }`}
             >
               {isSidebarOpen ? 'Azaguié' : 'A'}
             </button>
             <button 
               onClick={() => setCurrentSite('Yopougon')}
               className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                 currentSite === 'Yopougon' ? 'bg-[#8B3A1A] text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
               }`}
             >
               {isSidebarOpen ? 'Yopougon' : 'Y'}
             </button>
           </div>
           <div className="flex flex-col gap-1 pt-2 border-t border-white/5">
             <Link href="/" className={`flex items-center gap-3 px-3 py-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-bold`}>
               <span>🏠</span>{isSidebarOpen && 'Accueil Public'}
             </Link>
             <button onClick={logout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-all text-xs font-bold">
               <span>🚪</span>{isSidebarOpen && 'Déconnexion'}
             </button>
             {isSidebarOpen && user && <p className="text-[10px] text-white/20 px-3 pt-1">{user.name}</p>}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Département :</span>
             <span className="font-bold text-primary">
               {menuItems.find(i => i.path === pathname)?.name || 'Espace Admin'}
             </span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold">{user?.name || 'Admin'}</span>
              <span className="text-[10px] text-accent uppercase font-bold">Hambol Group</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-sand flex items-center justify-center font-bold text-primary border border-accent/20 uppercase">
              {user?.name?.[0] || 'A'}
            </div>
          </div>
        </header>

        <div className="p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
