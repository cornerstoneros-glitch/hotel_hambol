'use client';

import { useState, useEffect } from 'react';
import { useSite } from '@/context/SiteContext';

interface Dish {
  id: string;
  name: string;
  category: string;
  price: number | null;
  image: string;
  siteId: string;
}

const CATEGORIES = ['Signature', 'Terroir', 'Tradition', 'L Excellence', 'Dessert', 'Boisson'];

export default function GastronomyAdmin() {
  const { currentSite } = useSite();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ name: '', category: 'Signature', price: '', image: '' });

  const siteId = currentSite === 'Azaguié' ? 'azaguie' : 'yopougon';

  const fetchDishes = async () => {
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

  useEffect(() => {
    fetchDishes();
  }, [currentSite]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, siteId }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setForm({ name: '', category: 'Signature', price: '', image: '' });
        fetchDishes();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce plat ?')) return;
    try {
      const res = await fetch(`/api/admin/menu?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchDishes();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-title font-bold text-primary">Gestion Gastronomique</h1>
          <p className="text-gray-400 text-sm">Menus & Carte du Restaurant — {currentSite}</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-dk transition-all">
          + Ajouter un Plat
        </button>
      </header>

      <div className="bg-white rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-lg">Menu Actuel</h3>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{dishes.length} Plats Affichés</span>
        </div>
        
        {isLoading ? (
          <div className="p-20 text-center text-gray-400">Chargement du menu...</div>
        ) : dishes.length === 0 ? (
          <div className="p-20 text-center text-gray-400 italic">Aucun plat configuré pour ce site.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-50">
                  <th className="px-8 py-4 font-bold">Plat</th>
                  <th className="px-8 py-4 font-bold">Catégorie</th>
                  <th className="px-8 py-4 font-bold">Prix</th>
                  <th className="px-8 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {dishes.map((dish) => (
                  <tr key={dish.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
                          <img src={dish.image || '/images/food/dish_default.png'} alt={dish.name} className="object-cover w-full h-full" />
                        </div>
                        <span className="font-bold text-primary">{dish.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className="px-3 py-1 bg-accent/10 text-accent text-[10px] font-bold rounded-full uppercase">{dish.category}</span>
                    </td>
                    <td className="px-8 py-4 font-mono font-bold text-gray-500">
                      {dish.price ? `${dish.price.toLocaleString()} F` : 'Sur carte'}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <button onClick={() => handleDelete(dish.id)} className="text-red-400 hover:text-red-600 font-bold text-xs p-2">Supprimer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-red-500">✕</button>
            <h2 className="text-2xl font-bold font-title text-primary mb-8">Nouveau Plat</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Nom du Plat</label>
                <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Ex: Saint-Pierre Braisé" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Catégorie</label>
                  <select title="category" value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none bg-white">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Prix (CFA)</label>
                  <input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="15000" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Image (Chemin ou URL)</label>
                <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="/images/food/plat_special.png" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none" />
                <p className="text-[10px] text-gray-400 mt-2 italic">Laissez vide pour utiliser l&apos;image par défaut.</p>
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-4 hover:bg-primary-dk transition-all shadow-lg active:scale-95">
                Valider & Publier au Menu
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
