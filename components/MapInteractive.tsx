import React, { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { Atendimento } from '../types';
import { MapPin, Flame, Loader2 } from 'lucide-react';
import L from 'leaflet';
import 'leaflet.heat';

// Fix for Leaflet icons if needed (though we use CircleMarkers mostly)
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

interface MapInteractiveProps {
  data: Atendimento[];
  selectedBairro: string;
}

type ViewMode = 'points' | 'heatmap';

// Coordenadas Reais de Valparaíso de Goiás
const REAL_COORDS: Record<string, [number, number]> = {
  'Centro': [-16.0683, -47.9767],
  'Jardim das Flores': [-16.0750, -47.9850],
  'Vila Nova': [-16.0550, -47.9650],
  'São José': [-16.0600, -47.9900],
  'Boa Vista': [-16.0800, -47.9700],
  'Industrial': [-16.0400, -47.9500],
  'Alto da Glória': [-16.0700, -48.0000]
};

const DEFAULT_CENTER: [number, number] = [-16.0683, -47.9767];

// Component to handle Heatmap Layer
const HeatmapLayer = ({ points }: { points: [number, number, number][] }) => {
  const map = useMap();

  useEffect(() => {
    if (!points.length) return;

    // @ts-ignore - leaflet.heat is not typed
    const heat = L.heatLayer(points, {
      radius: 25,
      blur: 15,
      maxZoom: 14,
      minOpacity: 0.4,
      gradient: {
        0.2: '#8b00ff',
        0.4: '#0000ff',
        0.5: '#00ffff',
        0.6: '#00ff00',
        0.8: '#ffff00',
        1.0: '#ff0000'
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };
  }, [points, map]);

  return null;
};

// Component to handle FlyTo animation
const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
};

export const MapInteractive: React.FC<MapInteractiveProps> = ({ data, selectedBairro }) => {
  const [viewMode, setViewMode] = React.useState<ViewMode>('points');

  // Memoize processed data to avoid recalculation on every render
  const processedPoints = useMemo(() => {
    return data.map(d => {
      const bairroNome = typeof d.bairro === 'object' && d.bairro ? d.bairro.nome : String(d.bairro || '');
      const temaNome = typeof d.tema === 'object' && d.tema ? d.tema.nome : String(d.tema || '');

      const baseCoords = REAL_COORDS[bairroNome] || DEFAULT_CENTER;
      // Stable jitter based on ID hash or similar would be better, but random is fine for now if memoized
      // We use a simple pseudo-random based on string length to keep it somewhat stable during this session if data doesn't change
      const pseudoRandom = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return (Math.abs(hash) % 100) / 100; // 0 to 1
      };

      const lat = baseCoords[0] + (pseudoRandom(d.id + 'lat') - 0.5) * 0.008;
      const lng = baseCoords[1] + (pseudoRandom(d.id + 'lng') - 0.5) * 0.008;

      let color = '#1A73E8';
      if (temaNome === 'Saúde') color = '#D93025';
      if (temaNome === 'Segurança') color = '#F9AB00';
      if (temaNome === 'Iluminação') color = '#A142F4';
      if (temaNome === 'Transporte') color = '#00ACC1';

      return { ...d, lat, lng, color, bairroNome, temaNome };
    });
  }, [data]);

  const heatPoints = useMemo(() => {
    return processedPoints.map(p => [p.lat, p.lng, 1] as [number, number, number]);
  }, [processedPoints]);

  const mapCenter = useMemo(() => {
    if (selectedBairro !== 'Todos' && REAL_COORDS[selectedBairro]) {
      return REAL_COORDS[selectedBairro];
    }
    return DEFAULT_CENTER;
  }, [selectedBairro]);

  const mapZoom = selectedBairro !== 'Todos' ? 15 : 13;

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden group border border-border bg-slate-100 dark:bg-slate-900">

      {/* Map Controls */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2">
        <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur rounded-lg shadow-looker border border-border p-1 flex flex-col">
          <button
            onClick={() => setViewMode('points')}
            className={`p-2 rounded-md transition-all flex items-center justify-center gap-2 text-xs font-medium ${viewMode === 'points'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-primary'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            title="Visualização de Pontos"
          >
            <MapPin size={18} />
          </button>
          <div className="h-[1px] w-full bg-gray-200 dark:bg-slate-700 my-1"></div>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`p-2 rounded-md transition-all flex items-center justify-center gap-2 text-xs font-medium ${viewMode === 'heatmap'
              ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'
              }`}
            title="Mapa de Calor"
          >
            <Flame size={18} />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/95 dark:bg-slate-800/95 backdrop-blur p-3 rounded-lg shadow-looker border border-border text-xs z-[400]">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-bold text-gray-700 dark:text-gray-200">Legenda</h4>
        </div>

        {viewMode === 'points' ? (
          <div className="flex flex-col gap-1.5 text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#D93025]"></div><span>Saúde</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#F9AB00]"></div><span>Segurança</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#A142F4]"></div><span>Iluminação</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#00ACC1]"></div><span>Transporte</span></div>
          </div>
        ) : (
          <div className="flex flex-col gap-1 w-32">
            <div className="w-full h-3 rounded bg-gradient-to-r from-purple-600 via-green-500 to-red-600"></div>
            <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400 font-medium px-0.5">
              <span>Baixa</span>
              <span>Alta</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1 leading-tight">Densidade de demandas por região</p>
          </div>
        )}
      </div>

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapUpdater center={mapCenter} zoom={mapZoom} />

        <MapUpdater center={mapCenter} zoom={mapZoom} />

        {viewMode === 'points' && (
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={(cluster) => {
              return L.divIcon({
                html: `<div class="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full font-bold text-xs border-2 border-white shadow-md">${cluster.getChildCount()}</div>`,
                className: 'custom-marker-cluster',
                iconSize: L.point(32, 32)
              });
            }}
          >
            {processedPoints.map((point) => (
              <CircleMarker
                key={point.id}
                center={[point.lat, point.lng]}
                radius={8}
                pathOptions={{
                  fillColor: point.color,
                  color: '#fff',
                  weight: 2,
                  opacity: 1,
                  fillOpacity: 0.9
                }}
              >
                <Popup>
                  <div className="p-1 min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase text-gray-500">{point.bairroNome}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
                        {point.status_demanda || 'Nova'}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-sm mb-1">{point.temaNome}</h4>
                    <p className="text-xs text-gray-600 leading-snug">{point.resumo_demanda}</p>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </MarkerClusterGroup>
        )}

        {viewMode === 'heatmap' && <HeatmapLayer points={heatPoints} />}
      </MapContainer>
    </div>
  );
};