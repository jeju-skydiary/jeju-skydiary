import { useState, useEffect, useCallback, useMemo, FormEvent } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Play, X, Camera, Coffee, Info, Plus, Save, 
  Map as MapIcon, LogIn, LogOut, Settings, Trash2, Edit3, ChevronRight, Search, Map, Plane
} from 'lucide-react';
import { locations as initialLocations, Location } from './data';

type MapStyle = 'standard' | 'satellite' | 'retro' | 'anime';

const MAP_LAYERS: Record<MapStyle, { url: string; attribution: string }> = {
  standard: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EBP, and the GIS User Community'
  },
  retro: {
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  anime: {
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">HOT</a>'
  }
};

// Fix for Leaflet default icon issues in React/Vite
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customIcon = (type: 'tourist' | 'cafe') => new L.DivIcon({
  html: `<div class="group flex items-center justify-center">
    <div class="relative w-10 h-10 flex items-center justify-center rounded-2xl shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:-translate-y-1 ${type === 'tourist' ? 'bg-gradient-to-br from-indigo-500 to-purple-600' : 'bg-gradient-to-br from-rose-400 to-orange-500'} border-2 border-white/50 backdrop-blur-sm">
      ${type === 'tourist' ? 
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>' : 
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>'
      }
      <div class="absolute -bottom-1 w-2 h-2 bg-white rounded-full blur-[1px] opacity-50"></div>
    </div>
  </div>`,
  className: '',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

// Component to handle map clicks
function MapEvents({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// --- Shared State Hook ---
function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('jeju_drone_locations');
    if (saved) {
      setLocations(JSON.parse(saved));
    } else {
      setLocations(initialLocations);
    }
  }, []);

  const saveLocations = (newLocs: Location[]) => {
    setLocations(newLocs);
    localStorage.setItem('jeju_drone_locations', JSON.stringify(newLocs));
  };

  return { locations, saveLocations };
}

// --- Public Map View ---
function PublicMap({ locations }: { locations: Location[] }) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isHeaderExpanded, setIsHeaderExpanded] = useState(false);
  const [mapStyle, setMapStyle] = useState<MapStyle>('standard');
  const [showStyleSelector, setShowStyleSelector] = useState(true);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Header Overlay */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-[1000] flex flex-col items-start gap-1">
        <button 
          onClick={() => setIsHeaderExpanded(!isHeaderExpanded)}
          className="flex items-center gap-3 sm:gap-4 px-4 py-2 sm:px-6 sm:py-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40 hover:bg-white transition-all group cursor-pointer"
        >
          <Camera className="text-indigo-600 drop-shadow-sm" size={20} />
          <div className="text-left">
            <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tighter leading-none">
              드론여지도
            </h1>
            <p className="text-[8px] sm:text-[10px] font-black text-indigo-600 tracking-widest uppercase mt-0.5 sm:mt-1">
              Drone Yeojido
            </p>
          </div>
          <motion.div
            animate={{ rotate: isHeaderExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={20} className="text-slate-400" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {isHeaderExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/40 max-w-[220px] ml-1 mt-1"
            >
              <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                제주의 숨겨진 비경을 드론으로 만나보세요.
              </p>
              <div className="mt-3 flex flex-col gap-2 text-[10px] font-bold uppercase tracking-tight">
                <div className="flex items-center gap-2 bg-indigo-50 text-indigo-600 px-2 py-1.5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-sm"></div>
                  <span>관광명소</span>
                </div>
                <div className="flex items-center gap-2 bg-rose-50 text-rose-600 px-2 py-1.5 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shadow-sm"></div>
                  <span>카페/맛집</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map Style Switcher */}
      <div className="absolute bottom-8 left-4 sm:bottom-10 sm:left-6 z-[1000] flex flex-wrap gap-1.5 sm:gap-2 max-w-[calc(100vw-32px)]">
        {(['standard', 'satellite', 'retro', 'anime'] as MapStyle[]).map((style) => (
          <button
            key={style}
            onClick={() => setMapStyle(style)}
            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider transition-all shadow-lg ${
              mapStyle === style 
                ? 'bg-slate-900 text-white scale-105' 
                : 'bg-white/90 text-slate-600 hover:bg-white'
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Initial Style Selector Modal */}
      <AnimatePresence>
        {showStyleSelector && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3000] flex items-center justify-center bg-slate-900/40 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-2xl rounded-[2.5rem] sm:rounded-[3rem] overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 sm:p-10 text-center">
                <div className="inline-flex p-3 sm:p-4 bg-sky-50 rounded-2xl sm:rounded-3xl text-sky-500 mb-4 sm:mb-6">
                  <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 sm:w-12 sm:h-12">
                    {/* Main Star Shape */}
                    <path d="M50 15C55 35 65 45 85 50C65 55 55 65 50 85C45 65 35 55 15 50C35 45 45 35 50 15Z" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="4" strokeLinejoin="round"/>
                    
                    {/* Propeller Arcs */}
                    <path d="M42 10C45 8 55 8 58 10" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M42 90C45 92 55 92 58 90" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M10 42C8 45 8 55 10 58" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    <path d="M90 42C92 45 92 55 90 58" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
                    
                    {/* Cloud Details in Center */}
                    <path d="M40 52C40 48 44 46 47 46C49 44 53 44 55 46C58 46 60 49 60 52C60 55 58 58 55 58H45C42 58 40 55 40 52Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M45 45C45 43 47 42 49 42C51 40 54 40 56 42C58 42 59 44 59 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                  "드론여지도" 어떤 지도스타일로 관광할까요?
                </h2>
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-4">
                  Drone Yeojido: Which map style would you like to explore?
                </p>
                
                <div className="mb-10">
                  <p className="text-slate-600 font-bold leading-tight">
                    제주카페와 관광지의 드론촬영소를 탐험해 보세요
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    Explore drone filming spots at Jeju's cafes and tourist attractions.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: 'standard', name: 'Standard', desc: '깔끔한 기본 지도', en: 'Clean & Basic', icon: <MapIcon size={20} /> },
                    { id: 'satellite', name: 'Satellite', desc: '생생한 위성 사진', en: 'Vivid Satellite', icon: <Camera size={20} /> },
                    { id: 'retro', name: 'Retro', desc: '깔끔한 미니멀 스타일', en: 'Minimal White', icon: <Search size={20} /> },
                    { id: 'anime', name: 'Anime', desc: '지브리 스타일의 감성', en: 'Ghibli Aesthetic', icon: <Play size={20} /> }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setMapStyle(item.id as MapStyle);
                        setShowStyleSelector(false);
                      }}
                      className="group p-6 rounded-[2rem] border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center text-slate-600 mb-4 transition-colors">
                        {item.icon}
                      </div>
                      <h3 className="font-black text-slate-900">{item.name}</h3>
                      <p className="text-[10px] text-slate-500 font-bold leading-tight">{item.desc}</p>
                      <p className="text-[9px] text-slate-400 font-medium uppercase tracking-tighter">{item.en}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Component */}
      <MapContainer 
        center={[33.38, 126.55]} 
        zoom={11} 
        className={`w-full h-full ${mapStyle === 'anime' ? 'anime-map-filter' : ''}`} 
        zoomControl={false}
      >
        <TileLayer url={MAP_LAYERS[mapStyle].url} attribution={MAP_LAYERS[mapStyle].attribution} />
        {locations.map((loc) => (
          <Marker 
            key={loc.id} 
            position={[loc.lat, loc.lng]} 
            icon={customIcon(loc.type)}
            eventHandlers={{ click: () => setSelectedLocation(loc) }}
          >
            <Tooltip 
              direction="top" 
              offset={[0, -40]} 
              opacity={1} 
              permanent={false}
              className="custom-tooltip"
            >
              <div className="px-2 py-1 font-black text-xs">{loc.name}</div>
            </Tooltip>
            <Popup className="custom-popup">
              <div className="p-0 min-w-[220px] bg-white rounded-2xl overflow-hidden">
                <div className="relative h-32 w-full">
                  <img src={loc.imageUrl} alt={loc.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-sm ${loc.type === 'tourist' ? 'bg-indigo-500 text-white' : 'bg-rose-500 text-white'}`}>
                      {loc.type === 'tourist' ? 'Spot' : 'Cafe'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-black text-slate-900 text-lg leading-tight mb-1">{loc.name}</h3>
                  <p className="text-[11px] text-slate-500 mb-4 line-clamp-2 leading-relaxed font-medium">{loc.description}</p>
                  <button 
                    onClick={() => setShowVideo(true)}
                    className={`w-full py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${loc.type === 'tourist' ? 'bg-indigo-600 text-white shadow-indigo-200 hover:bg-indigo-700' : 'bg-rose-500 text-white shadow-rose-200 hover:bg-rose-600'}`}
                  >
                    <Play size={14} fill="currentColor" />
                    드론 영상 감상하기
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideo && selectedLocation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative bg-slate-900 w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <button onClick={() => setShowVideo(false)} className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors">
                <X size={24} />
              </button>
              <div className="aspect-video w-full bg-black">
                <iframe src={selectedLocation.videoUrl} title={selectedLocation.name} className="w-full h-full" allowFullScreen></iframe>
              </div>
              <div className="p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">{selectedLocation.name}</h2>
                <p className="text-slate-400">{selectedLocation.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Login Link */}
      <Link to="/login" className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[1000] p-2 sm:p-3 bg-white/80 backdrop-blur-md rounded-full shadow-lg hover:bg-white transition-all">
        <Settings size={18} className="text-slate-600" />
      </Link>
    </div>
  );
}

// --- Admin Login Page ---
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'admin1234') { // Example Password
      onLogin();
      navigate('/admin');
    } else {
      setError('비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="p-4 bg-blue-100 rounded-full mb-4">
            <Settings size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">관리자 로그인</h1>
          <p className="text-slate-500 text-sm">관리자 전용 대시보드에 접속합니다.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">관리자 비밀번호</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="비밀번호를 입력하세요"
            />
          </div>
          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            로그인
          </button>
        </form>
        <Link to="/" className="block text-center mt-6 text-sm text-slate-400 hover:text-slate-600">
          지도로 돌아가기
        </Link>
      </motion.div>
    </div>
  );
}

// --- Admin Dashboard ---
function AdminDashboard({ locations, saveLocations, onLogout }: { locations: Location[], saveLocations: (l: Location[]) => void, onLogout: () => void }) {
  const [editingLoc, setEditingLoc] = useState<Location | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredLocations = useMemo(() => 
    locations.filter(l => l.name.toLowerCase().includes(search.toLowerCase())),
    [locations, search]
  );

  const handleDelete = (id: string) => {
    if (window.confirm('정말 이 장소를 삭제하시겠습니까?')) {
      saveLocations(locations.filter(l => l.id !== id));
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    let videoUrl = formData.get('videoUrl') as string;
    if (videoUrl.includes('v=')) videoUrl = `https://www.youtube.com/embed/${videoUrl.split('v=')[1].split('&')[0]}`;
    else if (videoUrl.includes('youtu.be/')) videoUrl = `https://www.youtube.com/embed/${videoUrl.split('youtu.be/')[1].split('?')[0]}`;

    const updatedLoc: Location = {
      id: editingLoc ? editingLoc.id : Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as 'tourist' | 'cafe',
      lat: parseFloat(formData.get('lat') as string),
      lng: parseFloat(formData.get('lng') as string),
      videoUrl: videoUrl,
      imageUrl: formData.get('imageUrl') as string || `https://picsum.photos/seed/${Date.now()}/400/300`,
      description: formData.get('description') as string,
    };

    if (editingLoc) {
      saveLocations(locations.map(l => l.id === editingLoc.id ? updatedLoc : l));
    } else {
      saveLocations([...locations, updatedLoc]);
    }
    setShowModal(false);
    setEditingLoc(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <Camera className="text-blue-400" />
          <span className="font-bold text-lg">Jeju Admin</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-blue-600 rounded-xl font-medium">
            <MapIcon size={18} /> 장소 관리
          </button>
        </nav>
        <button onClick={() => { onLogout(); navigate('/'); }} className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors">
          <LogOut size={18} /> 로그아웃
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">장소 관리</h1>
            <p className="text-slate-500">제주도 드론 투어 맵의 장소들을 관리합니다.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowExportModal(true)}
              className="bg-emerald-500 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition-all"
            >
              <Save size={20} /> 데이터 내보내기
            </button>
            <button 
              onClick={() => { setEditingLoc(null); setShowModal(true); }}
              className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
            >
              <Plus size={20} /> 새 장소 추가
            </button>
          </div>
        </div>

        {/* Search & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="장소 이름으로 검색..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <span className="text-slate-500 font-medium">총 장소 수</span>
            <span className="text-2xl font-bold text-blue-600">{locations.length}</span>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">장소</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">유형</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">좌표</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLocations.map(loc => (
                <tr key={loc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={loc.imageUrl} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <div className="font-bold text-slate-800">{loc.name}</div>
                        <div className="text-xs text-slate-400 truncate max-w-[200px]">{loc.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${loc.type === 'tourist' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      {loc.type === 'tourist' ? '관광지' : '카페'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                    {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditingLoc(loc); setShowModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => handleDelete(loc.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h2 className="text-xl font-bold text-slate-800">{editingLoc ? '장소 수정' : '새 장소 등록'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">장소 이름</label>
                    <input required name="name" defaultValue={editingLoc?.name} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">유형</label>
                    <select name="type" defaultValue={editingLoc?.type} className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="tourist">관광명소</option>
                      <option value="cafe">카페/맛집</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">위도</label>
                      <input required name="lat" type="number" step="any" defaultValue={editingLoc?.lat} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">경도</label>
                      <input required name="lng" type="number" step="any" defaultValue={editingLoc?.lng} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">이미지 URL</label>
                  <input name="imageUrl" defaultValue={editingLoc?.imageUrl} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">YouTube URL</label>
                  <input required name="videoUrl" defaultValue={editingLoc?.videoUrl} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none" placeholder="https://youtube.com/..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">설명</label>
                  <textarea required name="description" defaultValue={editingLoc?.description} className="w-full px-4 py-2 rounded-xl border border-slate-200 outline-none h-24 resize-none" />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  {editingLoc ? '변경사항 저장' : '장소 등록하기'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-emerald-50">
                <h2 className="text-xl font-bold text-emerald-800">데이터 내보내기</h2>
                <button onClick={() => setShowExportModal(false)} className="p-2 hover:bg-emerald-100 rounded-full transition-colors"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 font-medium">아래의 텍스트를 모두 복사해서 AI 채팅창에 붙여넣어 주세요.</p>
                <textarea 
                  readOnly 
                  value={localStorage.getItem('jeju_drone_locations') || '[]'} 
                  className="w-full h-64 p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs outline-none focus:ring-2 focus:ring-emerald-500"
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
                <button 
                  onClick={() => {
                    const textarea = document.querySelector('textarea[readOnly]');
                    if (textarea instanceof HTMLTextAreaElement) {
                      textarea.select();
                      document.execCommand('copy');
                      alert('복사되었습니다!');
                    }
                  }}
                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200"
                >
                  클립보드에 복사하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Main App Component ---
export default function App() {
  const { locations, saveLocations } = useLocations();
  const [isAdmin, setIsAdmin] = useState(false);

  // Check session on mount
  useEffect(() => {
    const session = sessionStorage.getItem('admin_session');
    if (session === 'true') setIsAdmin(true);
  }, []);

  const handleLogin = () => {
    setIsAdmin(true);
    sessionStorage.setItem('admin_session', 'true');
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('admin_session');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicMap locations={locations} />} />
        <Route path="/login" element={<AdminLogin onLogin={handleLogin} />} />
        <Route 
          path="/admin" 
          element={
            isAdmin ? (
              <AdminDashboard locations={locations} saveLocations={saveLocations} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
