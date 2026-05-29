'use client';

import { useSite } from '@/context/SiteContext';
import { useState } from 'react';
import Image from 'next/image';

type Step = 'search' | 'selection' | 'confirmation' | 'success';

export default function ReservationPage() {
  const { currentSite } = useSite();
  const [step, setStep] = useState<Step>('search');
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '1',
    roomTypeId: '',
    clientName: '',
    clientEmail: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roomTypes = [
    { id: '1', name: 'Chambre Standard', price: 25000, capacity: 2 },
    { id: '2', name: 'Suite Deluxe', price: 45000, capacity: 2 },
    { id: '3', name: 'Chambre Familiale', price: 35000, capacity: 4 },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('selection');
  };

  const handleSelectRoom = (id: string) => {
    setFormData({ ...formData, roomTypeId: id });
    setStep('confirmation');
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const selectedRoom = roomTypes.find(r => r.id === formData.roomTypeId);
    const totalPrice = selectedRoom ? selectedRoom.price : 0;

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          siteName: currentSite,
          totalPrice
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStep('success');
      } else {
        setError(data.error || 'Une erreur est survenue.');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#F5EDE0] min-h-screen pt-32 pb-20 px-6 font-body">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="font-title text-4xl sm:text-5xl font-bold text-[#8B3A1A] mb-4">
            Réserver votre Séjour
          </h1>
          <p className="text-[#6B5C4E] text-lg">
            Vivez l'expérience Espace Hambol à <span className="font-bold text-[#2E7D1E]">{currentSite}</span>.
          </p>
        </header>

        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-12 max-w-lg mx-auto">
          {['search', 'selection', 'confirmation', 'success'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                step === s ? 'bg-[#8B3A1A] text-white scale-110 shadow-lg' : 
                i < ['search', 'selection', 'confirmation', 'success'].indexOf(step) ? 'bg-[#2E7D1E] text-white' : 'bg-gray-300 text-gray-500'
              }`}>
                {i + 1}
              </div>
              {i < 3 && <div className={`w-12 sm:w-20 h-1 mx-2 rounded-full ${
                i < ['search', 'selection', 'confirmation', 'success'].indexOf(step) ? 'bg-[#2E7D1E]' : 'bg-gray-300'
              }`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 border border-[#D4956A]/10">
          {step === 'search' && (
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[#8B3A1A] mb-2">Arrivée</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B3A1A] outline-none"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#8B3A1A] mb-2">Départ</label>
                  <input 
                    type="date" 
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B3A1A] outline-none"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#8B3A1A] mb-2">Nombre de Personnes</label>
                <select 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B3A1A] outline-none"
                  value={formData.guests}
                  onChange={(e) => setFormData({...formData, guests: e.target.value})}
                >
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4+</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-[#8B3A1A] hover:bg-[#5C2410] text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl active:scale-[0.98]">
                Vérifier la Disponibilité
              </button>
            </form>
          )}

          {step === 'selection' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-title font-bold text-[#8B3A1A] mb-4">Choisissez votre type de chambre</h2>
              <div className="grid grid-cols-1 gap-4">
                {roomTypes.map((room) => (
                  <button 
                    key={room.id}
                    onClick={() => handleSelectRoom(room.id)}
                    className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl border-2 border-gray-100 hover:border-[#D4956A] transition-all hover:bg-[#F5EDE044] text-left group"
                  >
                    <div className="relative w-full sm:w-40 h-32 rounded-xl overflow-hidden shrink-0">
                      <Image src="/logo.jpg" alt={room.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#8B3A1A] group-hover:text-[#2E7D1E] transition-colors">{room.name}</h3>
                      <p className="text-sm text-[#6B5C4E] mt-1">Capacité: {room.capacity} personnes</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-[#8B3A1A]">{room.price.toLocaleString()} FCFA</div>
                      <div className="text-xs text-gray-500">Par nuit</div>
                    </div>
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setStep('search')}
                className="text-[#8B3A1A] font-bold hover:underline"
              >
                ← Retour
              </button>
            </div>
          )}

          {step === 'confirmation' && (
            <form onSubmit={handleConfirm} className="space-y-6">
              <h2 className="text-2xl font-title font-bold text-[#8B3A1A] mb-4">Vos Coordonnées</h2>
              {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">{error}</div>}
              <div>
                <label className="block text-sm font-bold text-[#8B3A1A] mb-2">Nom Complet</label>
                <input 
                  type="text" 
                  required
                  placeholder="Jean Dupont"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B3A1A] outline-none"
                  value={formData.clientName}
                  onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#8B3A1A] mb-2">Adresse Email</label>
                <input 
                  type="email" 
                  required
                  placeholder="jean.dupont@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#8B3A1A] outline-none"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({...formData, clientEmail: e.target.value})}
                />
              </div>
              <div className="p-6 bg-[#F5EDE0] rounded-2xl border border-[#D4956A]/20">
                <h3 className="font-bold text-[#8B3A1A] mb-2">Récapitulatif</h3>
                <div className="flex justify-between text-sm text-[#6B5C4E]">
                  <span>Site:</span><span className="font-bold">{currentSite}</span>
                </div>
                <div className="flex justify-between text-sm text-[#6B5C4E]">
                  <span>Du:</span><span className="font-bold font-mono">{formData.checkIn}</span>
                </div>
                <div className="flex justify-between text-sm text-[#6B5C4E]">
                  <span>Au:</span><span className="font-bold font-mono">{formData.checkOut}</span>
                </div>
                <div className="flex justify-between text-sm text-[#6B5C4E] mt-2 pt-2 border-t border-[#D4956A]/20">
                  <span>Chambre:</span><span className="font-bold text-[#8B3A1A]">{roomTypes.find(r => r.id === formData.roomTypeId)?.name}</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setStep('selection')}
                  className="flex-1 text-[#8B3A1A] font-bold py-4 rounded-2xl border-2 border-[#8B3A1A] hover:bg-[#F5EDE0] transition-all"
                >
                  Précédent
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-[2] bg-[#2E7D1E] hover:bg-[#1E5614] text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-xl disabled:opacity-50"
                >
                  {loading ? 'Traitement...' : 'Confirmer la Réservation'}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-12 space-y-6 animate-fade-in">
              <div className="w-24 h-24 bg-[#2E7D1E] text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-3xl font-title font-bold text-[#8B3A1A]">Demande Confirmée !</h2>
              <p className="text-[#6B5C4E] max-w-md mx-auto">
                Votre demande de réservation pour <span className="font-bold">{currentSite}</span> a été transmise à notre équipe. 
                Vous recevrez une confirmation par email très prochainement.
              </p>
              <button 
                onClick={() => window.location.href = '/'}
                className="inline-block bg-[#8B3A1A] text-white px-8 py-4 rounded-2xl font-bold hover:bg-[#5C2410] transition-all"
              >
                Retour à l'Accueil
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
