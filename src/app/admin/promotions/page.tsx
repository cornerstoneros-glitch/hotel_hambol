'use client';

import { useState, useEffect, useRef } from 'react';

type SiteName = 'Azaguié' | 'Yopougon';

interface PromoItem {
  enabled: boolean;
  imageUrl: string;
  link: string;
  title: string;
  delayMs?: number;
  intervalMs?: number;
}

interface SitePromos {
  popup: PromoItem;
  floatingAd: PromoItem;
}

interface PromosData {
  Azaguié: SitePromos;
  Yopougon: SitePromos;
}

type TabKey = 'popup' | 'floatingAd';

const SITES: SiteName[] = ['Azaguié', 'Yopougon'];
const SITE_COLORS: Record<SiteName, string> = {
  Azaguié: '#1B4332',
  Yopougon: '#8B3A1A',
};

const DEFAULT_DATA: PromosData = {
  Azaguié: {
    popup: { enabled: false, imageUrl: '', link: '', title: '' },
    floatingAd: { enabled: false, imageUrl: '', link: '', title: '', delayMs: 6000, intervalMs: 45000 },
  },
  Yopougon: {
    popup: { enabled: false, imageUrl: '', link: '', title: '' },
    floatingAd: { enabled: false, imageUrl: '', link: '', title: '', delayMs: 6000, intervalMs: 45000 },
  },
};

export default function PromotionsAdmin() {
  const [data, setData] = useState<PromosData>(DEFAULT_DATA);
  const [activeTab, setActiveTab] = useState<TabKey>('popup');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const fileRef = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetch('/api/admin/promotions')
      .then(r => r.json())
      .then(d => {
        if (d && d.Azaguié) setData(d);
      })
      .catch(console.error);
  }, []);

  const update = (site: SiteName, tab: TabKey, field: string, value: unknown) => {
    setData(prev => ({
      ...prev,
      [site]: {
        ...prev[site],
        [tab]: { ...prev[site][tab], [field]: value },
      },
    }));
  };

  const handleUpload = async (site: SiteName, tab: TabKey, file: File) => {
    const key = `${site}-${tab}`;
    setUploading(p => ({ ...p, [key]: true }));
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/admin/upload/promotions', { method: 'POST', body: fd });
      const json = await res.json();
      if (json.url) update(site, tab, 'imageUrl', json.url);
    } finally {
      setUploading(p => ({ ...p, [key]: false }));
    }
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch('/api/admin/promotions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const tabLabel: Record<TabKey, string> = {
    popup: '🪟 Popup d\'accueil',
    floatingAd: '📢 Pub flottante',
  };

  return (
    <div style={{ maxWidth: 860, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1A1208', marginBottom: 6 }}>
          📢 Gestion des Promotions
        </h1>
        <p style={{ color: '#6B7280', fontSize: 14 }}>
          Configurez le popup d&apos;accueil et la publicité flottante pour chaque site.
          Les modifications sont actives immédiatement après sauvegarde.
        </p>
      </div>

      {/* Tab switcher */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, borderBottom: '2px solid #E5E7EB', paddingBottom: 0 }}>
        {(Object.keys(tabLabel) as TabKey[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 22px',
              border: 'none',
              background: 'transparent',
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              borderBottom: activeTab === tab ? '3px solid #1A1208' : '3px solid transparent',
              color: activeTab === tab ? '#1A1208' : '#9CA3AF',
              transition: 'all .2s',
              marginBottom: -2,
            }}
          >
            {tabLabel[tab]}
          </button>
        ))}
      </div>

      {/* Cards per site */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {SITES.map(site => {
          const item = data[site][activeTab];
          const key = `${site}-${activeTab}`;
          const isLoading = uploading[key];

          return (
            <div
              key={site}
              style={{
                background: '#fff',
                border: '1.5px solid #E5E7EB',
                borderRadius: 18,
                overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
              }}
            >
              {/* Site header */}
              <div
                style={{
                  background: SITE_COLORS[site],
                  color: '#fff',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <span style={{ fontWeight: 800, fontSize: 16 }}>
                  {site === 'Azaguié' ? '🌿' : '🏙️'} {site}
                </span>
                {/* Toggle enabled */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <span style={{ fontSize: 12, opacity: 0.85 }}>Actif</span>
                  <div
                    onClick={() => update(site, activeTab, 'enabled', !item.enabled)}
                    style={{
                      width: 42, height: 24, borderRadius: 12, background: item.enabled ? '#4ADE80' : '#6B7280',
                      position: 'relative', cursor: 'pointer', transition: 'background .25s',
                    }}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: 9, background: '#fff',
                      position: 'absolute', top: 3, left: item.enabled ? 21 : 3,
                      transition: 'left .25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
                    }} />
                  </div>
                </label>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Image preview */}
                {item.imageUrl && (
                  <div style={{ textAlign: 'center', borderRadius: 12, overflow: 'hidden', border: '1px solid #E5E7EB', background: '#F9FAFB' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt="Aperçu"
                      style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain', display: 'block', margin: '0 auto' }}
                    />
                  </div>
                )}

                {/* Upload zone */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                    Image
                  </label>
                  <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                    <input
                      ref={el => { fileRef.current[key] = el; }}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={e => { if (e.target.files?.[0]) handleUpload(site, activeTab, e.target.files[0]); }}
                    />
                    <button
                      onClick={() => fileRef.current[key]?.click()}
                      disabled={isLoading}
                      style={{
                        padding: '9px 16px', border: '2px dashed #D1D5DB', borderRadius: 10,
                        background: '#F9FAFB', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                        color: '#374151', transition: 'border-color .2s',
                      }}
                    >
                      {isLoading ? '⏳ Upload en cours…' : '📁 Choisir une image'}
                    </button>
                    <span style={{ fontSize: 11, color: '#6B7280', textAlign: 'center' }}>ou</span>
                    <input
                      type="url"
                      placeholder="https://… (URL externe)"
                      value={item.imageUrl}
                      onChange={e => update(site, activeTab, 'imageUrl', e.target.value)}
                      style={{
                        border: '1.5px solid #E5E7EB', borderRadius: 10, padding: '9px 12px',
                        fontSize: 13, outline: 'none', color: '#1F2937',
                      }}
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                    Titre / Message
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Offre spéciale du mois…"
                    value={item.title}
                    onChange={e => update(site, activeTab, 'title', e.target.value)}
                    style={{
                      width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10,
                      padding: '9px 12px', fontSize: 13, outline: 'none', color: '#1F2937', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Link */}
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                    Lien (optionnel)
                  </label>
                  <input
                    type="url"
                    placeholder="https://…"
                    value={item.link}
                    onChange={e => update(site, activeTab, 'link', e.target.value)}
                    style={{
                      width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10,
                      padding: '9px 12px', fontSize: 13, outline: 'none', color: '#1F2937', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Floating ad extra fields */}
                {activeTab === 'floatingAd' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                        Délai initial (ms)
                      </label>
                      <input
                        type="number"
                        min={1000}
                        step={1000}
                        value={item.delayMs ?? 6000}
                        onChange={e => update(site, activeTab, 'delayMs', Number(e.target.value))}
                        style={{
                          width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10,
                          padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>
                        Intervalle (ms)
                      </label>
                      <input
                        type="number"
                        min={5000}
                        step={1000}
                        value={item.intervalMs ?? 45000}
                        onChange={e => update(site, activeTab, 'intervalMs', Number(e.target.value))}
                        style={{
                          width: '100%', border: '1.5px solid #E5E7EB', borderRadius: 10,
                          padding: '9px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save button */}
      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={save}
          disabled={saving}
          style={{
            padding: '13px 36px',
            background: saved ? '#16A34A' : '#1A1208',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 15,
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'background .3s, transform .1s',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}
        >
          {saving ? '⏳ Sauvegarde…' : saved ? '✅ Sauvegardé !' : '💾 Sauvegarder les modifications'}
        </button>
      </div>
    </div>
  );
}
