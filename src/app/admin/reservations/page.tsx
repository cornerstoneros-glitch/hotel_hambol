'use client';

import { useEffect, useState } from 'react';
import { useSite } from '@/context/SiteContext';

interface Reservation {
  id: string;
  checkIn: string;
  checkOut: string;
  status: string;
  client: { name: string };
  room: { number: string };
}

interface Room {
  id: string;
  number: string;
}

export default function ReservationsGrid() {
  const { currentSite } = useSite();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const daysCount = 14; 
  const days = Array.from({ length: daysCount }).map((_, i) => {
    const d = new Date(viewDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const siteId = currentSite.toLowerCase().includes('azaguie') || currentSite.toLowerCase().includes('azaguié') 
          ? 'azaguie' 
          : 'yopougon';
        const res = await fetch(`/api/admin/reservations?siteId=${siteId}`);
        const data = await res.json();
        setReservations(data.reservations || []);
        setRooms(data.rooms || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [currentSite, viewDate]); // Added viewDate as dependency if needed for future filtering

  const getOccupancy = (roomNum: string, date: Date) => {
    return reservations.find(res => {
      const start = new Date(res.checkIn);
      const end = new Date(res.checkOut);
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      return res.room.number === roomNum && d >= start && d < end;
    });
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-title font-bold text-primary text-primary-content">Planning des Chambres</h1>
          <p className="text-gray-400 text-sm">Gestion visuelle des {rooms.length} suites — {currentSite}</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setIsModalOpen(true)} className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg hover:bg-primary-dk transition-all">
            + Nouvelle Réservation
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-sand/20">
          <div className="flex gap-2">
            <button 
              onClick={() => {
                const d = new Date(viewDate);
                d.setDate(d.getDate() - 7);
                setViewDate(d);
              }}
              className="p-2 hover:bg-white rounded-lg transition-all"
            >
              ◀
            </button>
            <button 
              onClick={() => setViewDate(new Date())}
              className="px-4 py-1 bg-white rounded-lg text-xs font-bold border border-gray-100"
            >
              Aujourd&apos;hui
            </button>
            <button 
              onClick={() => {
                const d = new Date(viewDate);
                d.setDate(d.getDate() + 7);
                setViewDate(d);
              }}
              className="p-2 hover:bg-white rounded-lg transition-all"
            >
              ▶
            </button>
          </div>
          <span className="text-sm font-bold text-primary">
            {viewDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="p-4 border-r border-gray-100 sticky left-0 bg-gray-50 z-10 w-24 text-left text-[10px] font-bold text-gray-400 uppercase">Chambre</th>
                {days.map((day, i: number) => (
                  <th key={i} className={`p-4 border-r border-gray-100 min-w-[120px] text-center ${day.toDateString() === new Date().toDateString() ? 'bg-accent/5' : ''}`}>
                    <div className="text-[10px] font-bold text-gray-400 uppercase">{day.toLocaleDateString('fr-FR', { weekday: 'short' })}</div>
                    <div className={`text-lg font-bold ${day.toDateString() === new Date().toDateString() ? 'text-accent' : 'text-primary'}`}>
                      {day.getDate()}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={daysCount + 1} className="p-12 text-center text-gray-400">Chargement du planning...</td>
                </tr>
              ) : rooms.length === 0 ? (
                <tr>
                  <td colSpan={daysCount + 1} className="p-12 text-center text-gray-400">Aucune chambre trouvée pour ce site.</td>
                </tr>
              ) : rooms.map((room) => {
                return (
                  <tr key={room.id} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <td className="p-4 border-r border-gray-100 sticky left-0 bg-white z-10 font-bold text-primary">
                      Suite {room.number}
                    </td>
                    {days.map((day, j: number) => {
                      const res = getOccupancy(room.number, day);

                      return (
                        <td key={j} className="p-2 border-r border-gray-50 relative h-16">
                          {res && (
                            <div className={`absolute inset-1 rounded-lg p-2 text-[10px] font-bold flex flex-col justify-center overflow-hidden transition-all hover:scale-[1.02] cursor-pointer shadow-sm ${
                              res.status === 'CONFIRMED' ? 'bg-primary text-white' : 'bg-amber-100 text-amber-800'
                            }`}>
                              <span className="truncate">{res.client.name}</span>
                              <span className="opacity-70 font-normal">#{res.id.slice(-4)}</span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


      <div className="flex gap-8">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-primary" />
          <span className="text-xs text-gray-500 font-medium">Confirmée</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-amber-100" />
          <span className="text-xs text-gray-500 font-medium">En attente</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded border border-gray-100" />
          <span className="text-xs text-gray-500 font-medium">Libre</span>
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
            <h2 className="text-2xl font-bold font-title text-primary mb-6">Nouvelle Réservation</h2>
            <form onSubmit={(e) => { e.preventDefault(); alert('Action simulée avec succès.'); setIsModalOpen(false); }} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Nom du client</label>
                <input type="text" required placeholder="Ex: Koffi Marc" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-accent outline-none" />
              </div>
              <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl mt-4 hover:bg-primary-dk transition-all">
                Créer la Réservation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
