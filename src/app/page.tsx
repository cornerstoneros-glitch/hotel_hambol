'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSite } from "@/context/SiteContext";

function Slideshow({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((img, i) => (
        <div
          key={img}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          }`}
          style={{ transitionProperty: 'opacity, transform' }}
        >
          <Image
            src={img}
            alt={`Slide ${i}`}
            fill
            className="object-cover"
          />
        </div>
      ))}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.length > 1 && images.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? 'bg-white w-6' : 'bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

function useParallax() {
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const hero = document.getElementById('hero-bg');
      if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

export default function Home() {
  const { currentSite } = useSite();

  const siteData = {
    'Azaguié': {
      title: "L'Évasion Naturelle à Ahoua",
      subtitle: "Détente, sport et célébrations en plein air",
      description: "Au cœur d'Azaguié Ahoua, profitez de nos 11 chambres climatisées, notre piscine et nos terrains de Maracana. Le lieu idéal pour vos mariages et concerts.",
      heroImage: "/images/azaguie/greanland.png",
      roomImage: "/images/azaguie/rooms/room_4.jpg",
      featureImage: "/images/azaguie/bungalow.jpg",
      rooms: ["11 Chambres Climatisées", "Salle de bain moderne", "TV & Wifi", "Accès Piscine"],
      roomPricing: "À partir de 10.000F (Passage) | 15.000F (Nuitée) | 20.000F (24H)",
      activities: ["Terrain de Maracana", "Piscine", "Cour pour Concerts", "Hangar Événements"],
      menu: "Restaurant Plein Air : Spécialités Braisées, Terroir & Soupes (Kédjénou)",
      menuHighlights: ["Carpes & Saint Pierre Braisés", "Lapin Soupe / Kédjénou", "Garnitures (Alloco, Attiéké, Frites)"],
      gastronomyImage: "/images/food/dish_1.jpg",
      gastronomyDishes: [
        { title: "Carpes & Poissons Braisés", sub: "Signature", img: "/images/food/dish_1.png" },
        { title: "Alloco & Bananes Fraîches", sub: "Terroir", img: "/images/food/dish_2.png" },
        { title: "Spécialités de Riz & Soupes", sub: "Tradition", img: "/images/food/dish_3.png" }
      ],
      outdoor: {
        title: "Piscine & Détente Naturelle",
        description: "Plongez dans notre piscine entourée de verdure ou célébrez vos moments forts dans nos jardins luxuriants d'Azaguié. Un cadre enchanteur pour vos mariages et réceptions.",
        features: ["Piscine Olympique", "Jardins de Noces", "Espaces de Concert", "Hangar Polyvalent"],
        images: ["/images/azaguie/outdoor_1.jpg", "/images/azaguie/outdoor_2.jpg", "/images/azaguie/outdoor_3.jpg"]
      }
    },
    'Yopougon': {
      title: "L'Élégance à Ananeraie",
      subtitle: "Confort urbain et détente en altitude",
      description: "Situé à Yopougon Ananeraie, l'Espace Hambol vous accueille avec ses 11 chambres de standing, son bar climatisé et sa terrasse panoramique au 4ème étage.",
      heroImage: "/images/yopougon/hero.jpg",
      roomImage: "/images/yopougon/rooms/room_3.jpg",
      featureImage: "/images/yopougon/lavage.jpg",
      rooms: ["11 Chambres VIP", "Frigidaire individuel", "Balcon Privé", "Room Service"],
      roomPricing: "À partir de 10.000F (Passage) | 15.000F (Nuitée) | 20.000F (24H)",
      activities: ["Bar Climatisé", "Salle Irène Touré", "Terrasse 4è Étage", "Lavage Auto RDC"],
      menu: "Restaurant Gastronomique : Menu du Jour & Grillades de Nuit",
      menuHighlights: ["Plats Africains (Gouaguassou, Sauce Graine)", "Cuisine Ivoirienne & Internationale", "Large Choix de Boissons & Sucreries"],
      gastronomyImage: "/images/food/dish_2.jpg",
      gastronomyDishes: [
        { title: "Gastronomie Fine", sub: "L'Excellence", img: "/images/yopougon/food/cuisine_1.png" },
        { title: "Spécialités du Chef", sub: "Signature", img: "/images/yopougon/food/cuisine_2.png" },
        { title: "Saveurs d'Antan", sub: "Tradition", img: "/images/yopougon/food/cuisine_3.png" }
      ],
      outdoor: {
        title: "Terrasse & Événements Prestige",
        description: "Prenez de la hauteur sur notre terrasse panoramique ou organisez vos événements marquants dans nos salles de cérémonie climatisées et modulables.",
        features: ["Terrasse 4ème Étage", "Salle Irène Touré", "Espace VIP", "Lavage Auto Pro"],
        images: ["/images/common/ceremony.jpg"]
      }
    }
  };

  const currentData = siteData[currentSite];
  const [occupancy, setOccupancy] = useState<number | null>(null);

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        const siteStats = data.sites.find((s: { siteName: string }) => s.siteName === currentSite);
        if (siteStats) setOccupancy(siteStats.occupiedRooms);
      } catch (e) {
        console.error(e);
      }
    };
    getStats();
  }, [currentSite]);

  useReveal();
  useParallax();

  const icons = {
    pool: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
    nature: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" /></svg>,
    luxury: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.082.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.082.477-4.5 1.253" /></svg>,
    events: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  };

  return (
    <div className="flex flex-col min-h-screen bg-sand scroll-smooth relative">
      {/* Hero Section */}
      <section className="relative h-[95vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div id="hero-bg" className="absolute inset-0 z-0">
          <Image
            src={currentData.heroImage} 
            alt="Hero Background"
            fill
            className="object-cover brightness-[0.35] scale-110"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-sand" />
        </div>

        <div className="relative z-10 space-y-6 max-w-4xl">
          <div className="flex justify-center">
             <div className="glass px-6 py-2 rounded-full border border-white/20 flex items-center gap-3 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  {occupancy !== null && occupancy < 11 
                    ? `Disponibilité en Temps Réel : ${11 - occupancy} suites libres` 
                    : "Complet : Prochaines disponibilités sous peu"}
                </span>
             </div>
          </div>
          <span className="font-body text-accent font-bold tracking-[0.4em] uppercase text-sm animate-fade-in block mb-4">
            {currentData.subtitle}
          </span>
          <h1 className="font-title text-6xl sm:text-8xl font-bold text-white leading-tight animate-fade-in-up">
            {currentData.title}
          </h1>
          <p className="font-body text-xl text-white/80 max-w-2xl mx-auto leading-relaxed animate-fade-in delay-500">
            {currentData.description}
          </p>
          <div className="pt-8 flex flex-col sm:flex-row gap-6 justify-center animate-fade-in delay-700">
            <Link href="/chambres" className="bg-primary hover:bg-primary-dk text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-2xl hover:scale-105 active:scale-95">
              Explorer nos Chambres
            </Link>
            <Link href="/restaurant" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-bold text-lg transition-all">
              Découvrir le Restaurant
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Domain: Hébergement */}
      <section id="hebergement" className="py-32 px-6 max-w-7xl mx-auto w-full reveal">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8 order-2 lg:order-1">
            <header>
              <h2 className="font-body text-accent font-bold tracking-widest uppercase text-xs mb-3">Hébergement & Suites</h2>
              <h3 className="font-title text-5xl sm:text-6xl font-bold text-primary leading-tight">Le Sommeil, Élevé au Rang d&apos;Art</h3>
            </header>
            <p className="text-[#6B5C4E] text-lg leading-relaxed">
              Venez vivre une expérience nocturne sans égale. Entre tradition ivoirienne et modernité occidentale, 
              nos suites sont des cocons de sérénité pensés pour votre bien-être absolu.
            </p>
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl">
              <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">Tarification Flexible</p>
              <p className="text-foreground font-bold">{currentData.roomPricing}</p>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8">
              {currentData.rooms.map(room => (
                <div key={room} className="flex items-center gap-3 text-[#1A1208] text-sm font-bold border-l-2 border-[#2E7D1E] pl-3">
                  {room}
                </div>
              ))}
            </div>
            <Link href="/chambres" className="inline-flex items-center gap-2 bg-sand border border-accent text-primary px-8 py-3 rounded-full font-bold hover:bg-primary hover:text-white transition-all">
              Toutes les offres 
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="relative h-[600px] rounded-[4rem] overflow-hidden shadow-2xl group order-1 lg:order-2">
            <Image src={currentData.roomImage} alt="Luxury Room" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
          </div>
        </div>
      </section>

      {/* Domain: Gastronomie */}
      <section id="gastronomie" className="py-32 bg-[#1A1208] text-[#F5EDE0] overflow-hidden reveal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-20">
            <div className="text-center md:text-left space-y-4">
              <h2 className="font-body text-accent font-bold tracking-widest uppercase text-xs">Gastronomie & Vins</h2>
              <h3 className="font-title text-5xl sm:text-6xl font-bold">L&apos;Excellence du Goût</h3>
              <p className="max-w-xl text-white/60 text-lg">De la fourche à la fourchette, nous sublimons les produits de nos régions pour une explosion de saveurs.</p>
            </div>
            <Link href="/restaurant" className="border-2 border-white/20 hover:border-accent text-white px-10 py-4 rounded-full font-bold transition-all">
              Consulter la Carte
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {currentData.gastronomyDishes.map((dish, i) => (
              <div key={i} className="group relative h-[450px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src={dish.img} alt={dish.title} fill className="object-cover transition-transform duration-1000 group-hover:scale-125" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1208] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-8 left-8 right-8">
                  <span className="text-accent text-xs font-bold tracking-widest block mb-2 uppercase">{dish.sub}</span>
                  <h4 className="font-title text-3xl font-bold">{dish.title}</h4>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 p-12 bg-gradient-to-r from-primary to-primary-dk rounded-[3rem] relative overflow-hidden group shadow-3xl">
             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
                <div className="space-y-2">
                  <p className="font-body text-accent font-bold text-sm tracking-widest uppercase mb-4">À l&apos;honneur cette semaine</p>
                  <p className="font-title text-4xl font-bold">Le Choix du Chef à {currentSite}</p>
                  <p className="text-2xl italic opacity-90 font-highlight tracking-wide">{currentData.menu}</p>
                </div>
                <button className="bg-white text-primary px-12 py-5 rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl">
                  Réserver une Table
                </button>
             </div>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          </div>
        </div>
      </section>

      {/* Domain: Loisirs & Activités */}
      <section id="loisirs" className="py-32 px-6 reveal">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
            <div className="sticky top-32 space-y-6">
              <h2 className="font-body text-accent font-bold tracking-widest uppercase text-xs">Expériences & Loisirs</h2>
              <h3 className="font-title text-5xl font-bold text-primary">Redécouvrez la Liberté</h3>
              <p className="text-[#6B5C4E] text-lg">
                Qu&apos;il s&apos;agisse d&apos;un moment de détente au bord de l&apos;eau ou d&apos;une aventure immersive, nous avons conçu chaque activité pour marquer vos esprits.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {currentData.activities.map((act, i) => (
                <div key={act} className="group bg-white p-10 rounded-[2.5rem] shadow-xl border border-[#D4956A]/10 hover:bg-[#8B3A1A] transition-all duration-500">
                  <div className="w-16 h-16 bg-accent/10 group-hover:bg-white/20 text-accent group-hover:text-white rounded-2xl flex items-center justify-center mb-6 transition-colors">
                     {i % 4 === 0 ? icons.pool : i % 4 === 1 ? icons.nature : i % 4 === 2 ? icons.luxury : icons.events}
                  </div>
                  <h4 className="font-title text-2xl font-bold text-[#1A1208] group-hover:text-white transition-colors mb-4">{act}</h4>
                  <p className="text-gray-500 group-hover:text-white/70 transition-colors text-sm">Disponible tous les jours sur réservation préalable.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Domain: L'Engagement d'Excellence - NEW SECTION */}
      <section className="py-24 bg-white reveal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-body text-accent font-bold tracking-widest uppercase text-xs">Standards de Luxe</h2>
            <h3 className="font-title text-5xl font-bold text-primary">L&apos;Engagement d&apos;Excellence</h3>
            <p className="max-w-2xl mx-auto text-foreground/60">
              Derrière chaque séjour mémorable se cache une organisation de précision. 
              Nos départements collaborent en temps réel pour vous offrir le meilleur de l&apos;hospitalité.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: "Réception de Standing", 
                desc: "Disponibilité temps réel et accueil personnalisé pour un check-in sans attente.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              },
              { 
                title: "Gouvernance de Luxe", 
                desc: "Standards de propreté rigoureux et suivi digital de l'état de chaque suite.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
              },
              { 
                title: "Haute Cuisine", 
                desc: "Gestion de stock ultra-fraîche et brigade d'élite pour une gastronomie sans compromis.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.082.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.082.477-4.5 1.253" /></svg>
              },
              { 
                title: "Événements & Tech", 
                desc: "Solution technologique intégrée pour des mariages et séminaires parfaitement orchestrés.",
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              }
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-sand/30 border border-accent/5 hover:border-accent/20 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-accent mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h4 className="font-bold text-primary mb-3">{item.title}</h4>
                <p className="text-xs text-foreground/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain: Piscine & Espaces Ouverts - NEW SECTION */}
      <section id="piscine" className="py-32 bg-white relative overflow-hidden reveal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2 relative h-[500px] rounded-[3rem] overflow-hidden shadow-3xl group">
               <Slideshow images={currentData.outdoor.images} />
               <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none" />
            </div>
            <div className="lg:w-1/2 space-y-8">
               <header className="space-y-4">
                 <h2 className="font-body text-accent font-bold tracking-widest uppercase text-xs">Piscine & Espaces Ouverts</h2>
                 <h3 className="font-title text-5xl sm:text-6xl font-bold text-primary leading-tight">{currentData.outdoor.title}</h3>
               </header>
               <p className="text-foreground/70 text-xl leading-relaxed italic">
                 &quot;{currentData.outdoor.description}&quot;
               </p>
               <div className="grid grid-cols-2 gap-4">
                 {currentData.outdoor.features.map(feat => (
                   <div key={feat} className="flex items-center gap-3 bg-sand/30 p-4 rounded-xl border border-accent/10">
                     <span className="text-secondary text-xl">✨</span>
                     <span className="font-bold text-primary text-sm">{feat}</span>
                   </div>
                 ))}
               </div>
               <button className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-xl">
                 Réserver cet Espace
               </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -mr-48 -mt-48" />
      </section>

      {/* Domain: Événements & Business */}
      <section id="evenements" className="py-32 bg-[#F0EBE3] relative overflow-hidden reveal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
             <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl skew-x-[-2deg]">
                <Image src={currentData.featureImage} alt="Seminar Room" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-primary/20" />
                <div className="absolute top-10 right-10 glass p-8 rounded-2xl shadow-xl">
                   <p className="text-4xl font-bold text-white">100%</p>
                   <p className="text-xs uppercase font-bold tracking-widest text-white/70">Personnalisable</p>
                </div>
             </div>
             <div className="space-y-10 group">
                <header>
                  <h2 className="font-body text-accent font-bold tracking-widest uppercase text-xs mb-3">Événements & Séminaires</h2>
                  <h3 className="font-title text-5xl sm:text-6xl font-bold text-primary">Inspirer, Célébrer, Réunir</h3>
                </header>
                <p className="text-[#6B5C4E] text-xl leading-relaxed">
                  Qu&apos;il s&apos;agisse de noces féeriques ou de séminaires d&apos;entreprise de haut niveau, nos espaces s&apos;adaptent à vos ambitions les plus folles.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-[#D4956A]/20 hover:shadow-lg transition-all">
                    <span className="text-4xl text-[#2E7D1E]">🏛️</span>
                    <div>
                      <p className="font-bold text-[#1A1208]">Salles Modulables</p>
                      <p className="text-sm text-gray-500">Technologie de pointe et confort absolu.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-[#D4956A]/20 hover:shadow-lg transition-all">
                    <span className="text-4xl text-[#8B3A1A]">🍱</span>
                    <div>
                      <p className="font-bold text-[#1A1208]">Service Traiteur</p>
                      <p className="text-sm text-gray-500">Des menus gastronomiques pour vos convives.</p>
                    </div>
                  </div>
                </div>
                <button className="w-full sm:w-auto bg-secondary hover:bg-primary-dk text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl transition-all hover:scale-105 active:scale-95">
                  Demander un Devis Personnalisé
                </button>
             </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </section>

      {/* Social Proof / Quote */}
      <section className="py-40 bg-sand text-center px-6 italic">
          <div className="max-w-3xl mx-auto space-y-8">
            <span className="text-6xl text-accent italic opacity-40">&quot;</span>
            <blockquote className="font-title text-4xl sm:text-5xl text-primary font-medium leading-tight">
              Espace Hambol n&apos;est pas qu&apos;un hôtel, c&apos;est une invitation à redécouvrir l&apos;âme de notre terre dans un confort absolu.
            </blockquote>
            <p className="font-body text-accent font-bold tracking-widest uppercase text-xs">— La Direction</p>
          </div>
      </section>

      {/* Final CTA / Newsletter */}
      <section className="py-32 bg-[#1A1208] text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-12 relative z-10 text-center">
            <h3 className="font-title text-5xl font-bold italic">Prêt pour l&apos;évasion ?</h3>
            <p className="max-w-xl text-white/60 mb-8">Inscrivez-vous à notre newsletter pour recevoir nos offres exclusives et les nouveautés de nos deux domaines.</p>
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                <input 
                  type="email" 
                  placeholder="votre.email@lux.com" 
                  className="flex-1 bg-white/5 border border-white/20 rounded-full px-8 py-5 focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                />
                <button className="bg-accent text-white px-10 py-5 rounded-full font-bold hover:bg-white hover:text-primary transition-all shadow-2xl">
                  S&apos;inscrire
                </button>
            </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px]" />
      </section>

      {/* Detailed Footer */}
      <footer className="bg-[#0C0804] text-sand/40 py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="space-y-6">
            <div className="flex items-center gap-4 justify-center md:justify-start">
              <div className="relative w-14 h-14 overflow-hidden rounded-full border-2 border-accent/40 shrink-0">
                <Image src="/logo_hambol.jpg" alt="Espace Hambol" fill className="object-cover" />
              </div>
              <h4 className="text-white font-title text-2xl font-bold leading-tight">Espace<br/><span className="text-accent">Hambol</span></h4>
            </div>
            <p className="text-sm">L&apos;élégance hospitalière entre terre et forêt.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase">Domaines</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="hover:text-accent">Hambol Azaguié</Link></li>
              <li><Link href="/" className="hover:text-accent">Hambol Yopougon</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase">Navigation</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/chambres" className="hover:text-accent">Hébergement</Link></li>
              <li><Link href="/restaurant" className="hover:text-accent">Gastronomie</Link></li>
              <li><Link href="/loisirs" className="hover:text-accent">Loisirs</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-white text-xs font-bold tracking-widest uppercase">Suivez-nous</h4>
            <div className="flex justify-center md:justify-start gap-6">
              <a href="#" className="hover:text-accent">FB</a>
              <a href="#" className="hover:text-accent">IG</a>
              <a href="#" className="hover:text-accent">WA</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-tighter">
          <p>© 2025 Espace Hambol - Tous droits réservés.</p>
          <div className="flex gap-8">
            <Link href="/auth/client" className="hover:text-white flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Espace Client
            </Link>
            <Link href="/admin" className="hover:text-white text-white/20">Staff</Link>
            <a href="#" className="hover:text-white">Mentions Légales</a>
            <a href="#" className="hover:text-white">Confidentialité</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
