'use client';

import { useSite } from '@/context/SiteContext';

export default function WebmailPage() {
  const { currentSite } = useSite();
  
  // L'URL de Hostinger avec le paramètre email pré-rempli si possible
  const email = currentSite === 'Azaguié' ? 'azaguie@espacehambol.com' : 'yopougon@espacehambol.com';
  const webmailUrl = `https://mail.hostinger.com/auth/login?_user=${encodeURIComponent(email)}`;

  return (
    <div className="space-y-6 h-[calc(100vh-160px)] flex flex-col">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h1 className="font-title text-3xl font-bold text-primary">Webmail Professionnel</h1>
          <p className="text-gray-500 text-sm">Gestion des emails pour <span className="font-bold text-accent">{email}</span></p>
        </div>
        <div className="flex gap-4">
          <a 
            href={webmailUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-accent hover:bg-accent-dk text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 text-sm"
          >
            <span>🌐</span> Ouvrir dans un nouvel onglet
          </a>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative group">
        <iframe 
          src={webmailUrl}
          className="w-full h-full border-none"
          title="Hostinger Webmail"
          allow="calendar; contacts; mail"
        />
        
        {/* Anti-iframe message overlay if blocked */}
        <div className="absolute inset-0 bg-gray-50 pointer-events-none opacity-0 group-hover:opacity-0 transition-opacity flex flex-col items-center justify-center p-12 text-center -z-10">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-md border border-gray-100">
            <span className="text-6xl mb-6 block">🔒</span>
            <h2 className="text-xl font-bold text-primary mb-4">Sécurité du Webmail</h2>
            <p className="text-gray-500 text-sm mb-6">
              Si le webmail ne s&apos;affiche pas ici, c&apos;est que Hostinger bloque l&apos;intégration directe par mesure de sécurité.
            </p>
            <p className="text-sm font-bold text-accent">
              Utilisez le bouton en haut à droite pour ouvrir le mail en toute sécurité.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
