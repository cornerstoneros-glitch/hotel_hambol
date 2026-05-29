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

export default function ReservationsGrid() {
  const { currentSite } = useSite();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewDate, setViewDate] = useState(new Date());

  const daysCount = 14; // Showing 2 weeks
  const days = Array.from({ length: daysCount }).map((_, i) => {
    const d = new Date(viewDate);
    d.setDate(d.getDate() + i);
    return d;
  });

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reservations');
      const data = await res.json();
      setReservations(data.reservations || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchReservations();
    };
    init();
  }, []);

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
          <p className="text-gray-400 text-sm">Gestion visuelle des 11 suites — {currentSite}</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg hover:bg-primary-dk transition-all">
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
                {days.map((day, i) => (
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
              {Array.from({ length: 11 }).map((_, i) => {
                const roomNum = (i + 1 < 10 ? '0' + (i + 1) : '' + (i + 1));
                return (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/30 transition-colors">
                    <td className="p-4 border-r border-gray-100 sticky left-0 bg-white z-10 font-bold text-primary">
                      Suite {roomNum}
                    </td>
                    {days.map((day, j) => {
                      const res = getOccupancy(roomNum, day);
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
    </div>
  );
}
