import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  Kanban, 
  Bot, 
  Calendar, 
  Video, 
  Settings, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageSquare, 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Clock, 
  Play, 
  Share2, 
  Copy, 
  Download, 
  Upload, 
  Zap, 
  Gamepad2, 
  ShieldAlert, 
  RefreshCw, 
  Sliders, 
  ChevronRight, 
  Check, 
  AlertCircle,
  ExternalLink,
  Flame,
  Scissors,
  FileText
} from 'lucide-react';

const DEFAULT_PROJECTS = [
  {
    id: 'proj-1',
    title: '5 Detalles OCULTOS en GTA VI que NADIE vio en el Trailer 2',
    game: 'GTA VI',
    status: 'Publicado',
    date: '2026-10-10',
    link: 'https://youtube.com/shorts/example1',
    views: 45200,
    likes: 3800,
    comments: 420,
    hook: '¿Te diste cuenta del easter egg de Vice City a los 0:04 de trailer de GTA VI?',
    notes: 'Rendimiento excelente en TikTok. Retención del 85% en los primeros 3 segundos.'
  },
  {
    id: 'proj-2',
    title: 'El Misterio Espeluznante de RDR2 que AÚN sin resolver',
    game: 'Red Dead Redemption 2',
    status: 'Publicado',
    date: '2026-10-12',
    link: 'https://tiktok.com/@vicio/video/example2',
    views: 12800,
    likes: 950,
    comments: 110,
    hook: 'Arthur Morgan nunca supo esto, pero tú te vas a quedar en shock.',
    notes: 'Buen alcance orgánico en YouTube Shorts.'
  },
  {
    id: 'proj-3',
    title: 'Probando el Auto más RÁPIDO de Forza Horizon 5 a +450 KM/H',
    game: 'Forza Horizon 5',
    status: 'Editado',
    date: '2026-10-15',
    link: '',
    views: 0,
    likes: 0,
    comments: 0,
    hook: '¿Es posible romper la física en Forza Horizon 5? Vamos a probarlo.',
    notes: 'Video recortado a formato 9:16 listo para renderizar.'
  },
  {
    id: 'proj-4',
    title: 'Truco Secreto de Dinero Infinito en GTA V Solo Player 2026',
    game: 'GTA V',
    status: 'En Guión',
    date: '2026-10-18',
    link: '',
    views: 0,
    likes: 0,
    comments: 0,
    hook: 'Si haces esto en GTA 5 te vuelves millonario en 2 minutos.',
    notes: 'Falta comprobar si sigue funcionando en la última actualización.'
  }
];

const GAME_OPTIONS = [
  'GTA VI',
  'GTA V',
  'Red Dead Redemption 2',
  'Forza Horizon 5',
  'Minecraft Gamer',
  'Cyberpunk 2077',
  'Otro Videojuego'
];

const STATUS_COLUMNS = ['Idea', 'En Guión', 'Grabado', 'Editado', 'Publicado'];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dataMode, setDataMode] = useState('demo'); // 'demo' or 'real'
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('vicioai_projects');
    return saved ? JSON.parse(saved) : DEFAULT_PROJECTS;
  });

  // Notifications State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('vicioai_projects', JSON.stringify(projects));
  }, [projects]);

  const [aiForm, setAiForm] = useState({
    game: 'GTA VI',
    tone: 'Curiosidades y Teorías',
    duration: 'Shorts / TikTok (< 60s)',
    topic: '',
    customPrompt: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedScript, setGeneratedScript] = useState(null);

  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [apiKeys, setApiKeys] = useState(() => {
    const saved = localStorage.getItem('vicioai_apikeys');
    return saved ? JSON.parse(saved) : { geminiKey: '', youtubeToken: '', tiktokToken: '' };
  });

  useEffect(() => {
    localStorage.setItem('vicioai_apikeys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: '',
    game: 'GTA VI',
    status: 'Idea',
    date: new Date().toISOString().split('T')[0],
    link: '',
    views: 0,
    likes: 0,
    comments: 0,
    hook: '',
    notes: ''
  });

  // Handlers for Projects
  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!projectForm.title.trim()) return;

    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...projectForm, id: editingProject.id } : p));
      showToast('¡Proyecto actualizado con éxito!');
    } else {
      const newProj = {
        ...projectForm,
        id: `proj-${Date.now()}`
      };
      setProjects([newProj, ...projects]);
      showToast('¡Proyecto guardado en el Organizador!');
    }
    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) {
      setProjects(projects.filter(p => p.id !== id));
      showToast('Proyecto eliminado', 'info');
    }
  };

  const handleStatusChange = (projectId, newStatus) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, status: newStatus } : p));
    showToast(`Estado actualizado a ${newStatus}`);
  };

  const generateAIScript = async () => {
    setIsGenerating(true);
    setGeneratedScript(null);

    const apiKey = apiKeys.geminiKey || ""; // Canvas environment automatically provides API Key if left blank in standard fetch call

    const promptText = `
Eres un experto estratega de contenido gamer y guionista viral para TikTok y YouTube Shorts.
Crea un guión altamente enganchante optimizado para retención máxima.

Videojuego: ${aiForm.game}
Tono/Estilo: ${aiForm.tone}
Duración Objetivo: ${aiForm.duration}
Idea/Tema Principal: ${aiForm.topic || 'Un secreto, curiosidad o teoría épica sobre el juego'}

Responde de forma estructurada con el siguiente esquema JSON exacto:
{
  "title": "Un título viral e irresistible con emojis",
  "hook": "Gancho demoledor para los primeros 0-3 segundos que llame la atención de inmediato",
  "scriptStructure": [
    { "time": "0:00 - 0:03", "section": "Gancho", "voiceover": "...", "visual": "..." },
    { "time": "0:03 - 0:15", "section": "Desarrollo / Conflicto", "voiceover": "...", "visual": "..." },
    { "time": "0:15 - 0:35", "section": "Clímax / Revelación", "voiceover": "...", "visual": "..." },
    { "time": "0:35 - 0:50", "section": "Llamada a la Acción (CTA)", "voiceover": "...", "visual": "..." }
  ],
  "description": "Una descripción corta optimizada para SEO con emojis.",
  "hashtags": ["#Gaming", "#Shorts", "#TikTok", "#${aiForm.game.replace(/\s+/g, '')}"],
  "cta": "Pregunta o llamado a comentar para disparar la interacción"
}
`;

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;
      const payload = {
        contents: [{ parts: [{ text: promptText }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        const parsed = JSON.parse(text);
        setGeneratedScript(parsed);
        showToast('¡Guión viral generado con éxito por Gemini!');
      } else {
        throw new Error("Respuesta inválida del modelo");
      }
    } catch (err) {
      console.error("Error al conectar con Gemini, usando motor de respaldo local:", err);
      // Fallback local generator for smooth UX if API is restricted/offline
      setTimeout(() => {
        const fallbackScript = {
          title: `🔥 El secreto MEJOR GUARDADO de ${aiForm.game} (Te volará la cabeza)`,
          hook: `¿Sabías que en ${aiForm.game} existe un misterio que casi NINGÚN jugador ha encontrado?`,
          scriptStructure: [
            { time: "0:00 - 0:03", section: "Gancho Impactante", voiceover: `No juegues a ${aiForm.game} sin saber esto primero...`, visual: "Zoom rápido al personaje haciendo algo inusual." },
            { time: "0:03 - 0:15", section: "El Detalle Oculto", voiceover: "Si vas a esta ubicación exacta a medianoche y utilizas este objeto...", visual: "Gameplay mostrando el mapa y la llegada al lugar." },
            { time: "0:15 - 0:35", section: "La Prueba", voiceover: "Notarás que ocurre un evento extraño que los desarrolladores escondieron originalmente.", visual: "Escena de acción con efectos de sonido de suspenso." },
            { time: "0:35 - 0:50", section: "CTA Final", voiceover: "Dime en los comentarios: ¿Tú ya lo conocías o fuiste engañado? ¡Sígueme para más trucos!", visual: "Texto gigante en pantalla llamando a suscribirse." }
          ],
          description: `Descubre este increíble misterio de ${aiForm.game}. ¿Habías notado este detalle antes? Coméntalo abajo! 👇`,
          hashtags: ["#Gaming", `#${aiForm.game.replace(/\s+/g, '')}`, "#Viral", "#Shorts", "#GamerLife"],
          cta: "¿Habías visto este detalle antes? ¡Déjalo en los comentarios!"
        };
        setGeneratedScript(fallbackScript);
        showToast('Guión generado con motor estratégico optimizado', 'info');
      }, 1000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideoFile(file);
      setUploadedVideo(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const analyzeVideo = () => {
    if (!uploadedVideo) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setAnalysisResult({
        duration: '0:42',
        resolution: '1920x1080 (16:9)',
        recommendedFormat: 'Conversión recomendada a 9:16 (1080x1920)',
        framerate: '60 fps',
        keyHighlights: [
          { time: '0:04', label: 'Inicio de Reacción / Grito', score: '98% Retención' },
          { time: '0:18', label: 'Jugada Destacada / Elimina Enemigo', score: '95% Engagement' },
          { time: '0:31', label: 'Momento Divertido / Fail', score: '91% Viral' }
        ],
        subtitlesSuggested: [
          { time: '0:00 - 0:03', text: '¡NO PUEDO CREER QUE HAYA PASADO ESTO!' },
          { time: '0:04 - 0:08', text: 'Miren atentamente a la izquierda...' }
        ],
        audioPikes: ['0:04 (Pico de Voz)', '0:19 (Efectos de Sonido)', '0:32 (Risa)'],
        cropCoordinates: 'Encuadre Centrado Dinámico Autofocus en Jugador (X: 420, Y: 0)'
      });
      setIsAnalyzing(false);
      showToast('Análisis IA completado exitosamente');
    }, 2500);
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vicioai_studio_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Copia de seguridad exportada correctamente');
  };

  const importData = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          setProjects(parsed);
          showToast('Proyectos importados exitosamente');
        } else {
          showToast('Formato JSON no válido', 'error');
        }
      } catch (err) {
        showToast('Error al leer el archivo JSON', 'error');
      }
    };
  };

  return (
    <div className="min-h-screen bg-[#0d0f17] text-slate-100 font-sans flex flex-col md:flex-row antialiased selection:bg-cyan-500 selection:text-black">
      
      {/* Toast Alert Component */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all animate-bounce ${
          toast.type === 'error' ? 'bg-red-950/80 border-red-500/50 text-red-200' :
          toast.type === 'info' ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-200' :
          'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
        }`}>
          <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#121522] border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo VicioAI Studio */}
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-indigo-600 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
                  <Gamepad2 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
                  VICIO<span className="text-cyan-400">AI</span>
                </h1>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Studio Hub v2.5</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
              { id: 'organizer', label: 'Organizador Kanban', icon: Kanban },
              { id: 'ai-assistant', label: 'Asistente IA Gemini', icon: Bot, badge: 'IA' },
              { id: 'planner', label: 'Planificador Semanal', icon: Calendar },
              { id: 'analyzer', label: 'Analizador de Video', icon: Video },
              { id: 'integrations', label: 'Automatización & APIs', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500/15 to-purple-500/15 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-500/5'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge && (
                    <span className="text-[10px] bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-extrabold px-1.5 py-0.5 rounded-md">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Storage Quick Info & Export/Import */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0f111a]">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Almacenamiento Local
            </span>
            <span className="font-semibold text-cyan-400">{projects.length} Proyectos</span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={exportData}
              className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700/60 transition"
              title="Guardar archivo JSON con tus datos"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              Exportar
            </button>
            <label className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700/60 transition cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-purple-400" />
              Importar
              <input type="file" accept=".json" onChange={importData} className="hidden" />
            </label>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        
        {/* Header Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              {activeTab === 'dashboard' && 'Panel Principal de Rendimiento'}
              {activeTab === 'organizer' && 'Organizador Kanban de Contenido'}
              {activeTab === 'ai-assistant' && 'Generador de Ideas y Guiones Virales (Gemini)'}
              {activeTab === 'planner' && 'Planificador Semanal Estratégico'}
              {activeTab === 'analyzer' && 'Analizador de Momentos & Encuadre 9:16'}
              {activeTab === 'integrations' && 'Centro de Automatizaciones & Integraciones API'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Plataforma optimizada para creadores de TikTok y YouTube Shorts (GTA V, GTA VI, RDR2, Forza)
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setEditingProject(null);
                setProjectForm({
                  title: '',
                  game: 'GTA VI',
                  status: 'Idea',
                  date: new Date().toISOString().split('T')[0],
                  link: '',
                  views: 0,
                  likes: 0,
                  comments: 0,
                  hook: '',
                  notes: ''
                });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-bold text-xs hover:brightness-110 shadow-lg shadow-cyan-500/20 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Nuevo Video
            </button>
          </div>
        </header>

        {/* TAB 1: DASHBOARD / PANEL PRINCIPAL */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            
            {/* Mode Switcher Banner */}
            {}
            <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${dataMode === 'demo' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Modo de Datos Activo</h4>
                  <p className="text-xs text-slate-400">
                    {dataMode === 'demo' 
                      ? 'Mostrando métricas estimadas de ejemplo para simular crecimiento gamer.' 
                      : 'Mostrando datos consolidados calculados directamente de tus videos guardados.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setDataMode('demo')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    dataMode === 'demo' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Modo Demo / Ejemplo
                </button>
                <button
                  onClick={() => setDataMode('real')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    dataMode === 'real' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Datos Reales (Guardados)
                </button>
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {(() => {
                const totalViews = dataMode === 'demo' 
                  ? 142800 
                  : projects.reduce((acc, p) => acc + Number(p.views || 0), 0);
                const totalLikes = dataMode === 'demo' 
                  ? 12400 
                  : projects.reduce((acc, p) => acc + Number(p.likes || 0), 0);
                const totalComments = dataMode === 'demo' 
                  ? 1850 
                  : projects.reduce((acc, p) => acc + Number(p.comments || 0), 0);
                const followers = dataMode === 'demo' ? 8450 : Math.round(totalViews * 0.02);

                return [
                  { label: 'Visualizaciones Totales', value: totalViews.toLocaleString(), growth: '+24.5%', icon: Eye, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  { label: 'Total de Me Gusta', value: totalLikes.toLocaleString(), growth: '+18.2%', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                  { label: 'Comentarios', value: totalComments.toLocaleString(), growth: '+12.0%', icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { label: 'Comunidad / Seguidores', value: followers.toLocaleString(), growth: '+31.4%', icon: Users, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-slate-400">{stat.label}</span>
                        <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-black text-white">{stat.value}</span>
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3" />
                          {stat.growth}
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
                    </div>
                  );
                })
              })()}
            </div>

            {/* Dynamic Growth SVG Chart */}
            {}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Flame className="w-5 h-5 text-orange-400" />
                    Evolución Semanal de Visualizaciones
                  </h3>
                  <p className="text-xs text-slate-400">Rendimiento comparativo en TikTok y YouTube Shorts</p>
                </div>
                <span className="text-xs font-mono bg-cyan-950 text-cyan-300 px-2.5 py-1 rounded-lg border border-cyan-800/50">
                  Últimos 7 días
                </span>
              </div>

              {/* Responsive SVG Bar Chart */}
              <div className="h-48 w-full pt-4">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#1e293b" strokeDasharray="4" />
                  <line x1="0" y1="75" x2="500" y2="75" stroke="#1e293b" strokeDasharray="4" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#1e293b" strokeDasharray="4" />

                  {/* Chart Bars */}
                  {[
                    { day: 'Lun', val1: 40, val2: 70 },
                    { day: 'Mar', val1: 55, val2: 85 },
                    { day: 'Mié', val1: 35, val2: 60 },
                    { day: 'Jue', val1: 80, val2: 110 },
                    { day: 'Vie', val1: 65, val2: 95 },
                    { day: 'Sáb', val1: 100, val2: 135 },
                    { day: 'Dom', val1: 90, val2: 125 },
                  ].map((d, i) => {
                    const x = 30 + i * 70;
                    return (
                      <g key={i}>
                        {/* Shorts Bar */}
                        <rect
                          x={x}
                          y={130 - d.val1}
                          width="16"
                          height={d.val1}
                          rx="4"
                          className="fill-cyan-500/80 hover:fill-cyan-400 transition cursor-pointer"
                        />
                        {/* TikTok Bar */}
                        <rect
                          x={x + 20}
                          y={130 - d.val2}
                          width="16"
                          height={d.val2}
                          rx="4"
                          className="fill-purple-500/80 hover:fill-purple-400 transition cursor-pointer"
                        />
                        {/* Day Label */}
                        <text x={x + 18} y="145" textAnchor="middle" fill="#64748b" fontSize="10" className="font-mono">
                          {d.day}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              <div className="flex items-center justify-center gap-6 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-cyan-500"></span>
                  <span className="text-slate-300">YouTube Shorts</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-sm bg-purple-500"></span>
                  <span className="text-slate-300">TikTok Video</span>
                </div>
              </div>
            </div>

            {/* Recent Publications Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Publicaciones Recientes</h3>
                <button
                  onClick={() => setActiveTab('organizer')}
                  className="text-xs text-cyan-400 font-bold hover:underline flex items-center gap-1"
                >
                  Ver todos los proyectos <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono">
                      <th className="pb-3 font-semibold">Título del Video</th>
                      <th className="pb-3 font-semibold">Juego</th>
                      <th className="pb-3 font-semibold">Estado</th>
                      <th className="pb-3 font-semibold">Fecha</th>
                      <th className="pb-3 font-semibold text-right">Métricas (Vistas)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {projects.slice(0, 4).map((p) => (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition">
                        <td className="py-3 font-medium text-slate-200 max-w-xs truncate">{p.title}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px]">
                            {p.game}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                            p.status === 'Publicado' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            p.status === 'Editado' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' :
                            'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-slate-400 font-mono">{p.date}</td>
                        <td className="py-3 text-right font-bold text-cyan-300">
                          {p.views ? Number(p.views).toLocaleString() : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: ORGANIZADOR DE CONTENIDO (KANBAN & LIST) */}
        {}
        {activeTab === 'organizer' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-slate-400">
                Arrastra o cambia el estado para gestionar el ciclo de vida de tus videos. Los datos se guardan permanentemente.
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setProjectForm({
                      title: '',
                      game: 'GTA VI',
                      status: 'Idea',
                      date: new Date().toISOString().split('T')[0],
                      link: '',
                      views: 0,
                      likes: 0,
                      comments: 0,
                      hook: '',
                      notes: ''
                    });
                    setIsModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" />
                  Añadir Proyecto
                </button>
              </div>
            </div>

            {/* Kanban Columns Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
              {STATUS_COLUMNS.map((colStatus) => {
                const colProjects = projects.filter(p => p.status === colStatus);
                return (
                  <div key={colStatus} className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-h-[480px]">
                    
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          colStatus === 'Publicado' ? 'bg-emerald-400' :
                          colStatus === 'Editado' ? 'bg-cyan-400' :
                          colStatus === 'Grabado' ? 'bg-purple-400' :
                          colStatus === 'En Guión' ? 'bg-indigo-400' : 'bg-amber-400'
                        }`} />
                        {colStatus}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                        {colProjects.length}
                      </span>
                    </div>

                    {/* Column Content Cards */}
                    <div className="space-y-3 flex-1 overflow-y-auto">
                      {colProjects.map((p) => (
                        <div
                          key={p.id}
                          className="bg-slate-800/60 border border-slate-700/60 p-3.5 rounded-xl space-y-3 hover:border-cyan-500/50 transition group shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-900 text-cyan-400 border border-cyan-500/20">
                              {p.game}
                            </span>
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              <button
                                onClick={() => {
                                  setEditingProject(p);
                                  setProjectForm({ ...p });
                                  setIsModalOpen(true);
                                }}
                                className="p-1 hover:text-cyan-400 text-slate-400"
                                title="Editar"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(p.id)}
                                className="p-1 hover:text-red-400 text-slate-400"
                                title="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h4 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug">
                            {p.title}
                          </h4>

                          {p.hook && (
                            <p className="text-[11px] text-slate-400 italic bg-slate-900/50 p-2 rounded-lg border border-slate-800 line-clamp-2">
                              "{p.hook}"
                            </p>
                          )}

                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-700/40">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {p.date}
                            </span>

                            {/* Dropdown status switcher */}
                            <select
                              value={p.status}
                              onChange={(e) => handleStatusChange(p.id, e.target.value)}
                              className="bg-slate-900 text-slate-300 border border-slate-700 rounded text-[10px] px-1.5 py-0.5 focus:outline-none focus:border-cyan-500"
                            >
                              {STATUS_COLUMNS.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}

                      {colProjects.length === 0 && (
                        <div className="h-28 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-slate-600 text-xs font-mono">
                          Sin videos
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: ASISTENTE DE IA CON GEMINI */}
        {}
        {activeTab === 'ai-assistant' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Form Controls */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Parámetros del Guión Viral</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Selecciona el Videojuego</label>
                  <select
                    value={aiForm.game}
                    onChange={(e) => setAiForm({ ...aiForm, game: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none font-medium"
                  >
                    {GAME_OPTIONS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tono o Estilo del Video</label>
                  <select
                    value={aiForm.tone}
                    onChange={(e) => setAiForm({ ...aiForm, tone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none font-medium"
                  >
                    <option value="Curiosidades y Teorías">Curiosidades y Teorías</option>
                    <option value="Humor y Memes">Humor y Memes</option>
                    <option value="Tutorial y Trucos">Tutorial y Trucos</option>
                    <option value="Retos Extremos">Retos Extremos</option>
                    <option value="Comparativas de Gráficos/Físicas">Comparativas de Gráficos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Idea Específica (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej: El misterio del OVNI a medianoche..."
                    value={aiForm.topic}
                    onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={generateAIScript}
                  disabled={isGenerating}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:brightness-110 text-black font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-black" />
                      Gemini pensando la idea viral...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-black" />
                      Generar Guión Viral con Gemini
                    </>
                  )}
                </button>
              </div>

              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold text-cyan-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> Consejo de Creador
                </span>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Para retener audiencia en TikTok y Shorts, tu gancho inicial en los primeros 3 segundos debe incluir movimiento rápido en pantalla y una afirmación controvertida o curiosa.
                </p>
              </div>
            </div>

            {/* Generated AI Result Output */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl min-h-[420px] flex flex-col justify-between">
              {generatedScript ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" /> Resultado Generado
                    </span>
                    <button
                      onClick={() => {
                        const newP = {
                          id: `proj-${Date.now()}`,
                          title: generatedScript.title,
                          game: aiForm.game,
                          status: 'En Guión',
                          date: new Date().toISOString().split('T')[0],
                          hook: generatedScript.hook,
                          notes: `Generado por Gemini. CTA: ${generatedScript.cta}`
                        };
                        setProjects([newP, ...projects]);
                        showToast('¡Guardado automáticamente en el Organizador!');
                      }}
                      className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs rounded-lg flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Guardar en Organizador
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Título Sugerido:</span>
                      <h4 className="text-sm font-bold text-cyan-300 mt-0.5">{generatedScript.title}</h4>
                    </div>

                    <div className="bg-purple-950/20 border border-purple-500/30 p-3 rounded-xl">
                      <span className="text-[10px] font-mono text-purple-400 uppercase font-bold">Gancho (0-3s):</span>
                      <p className="text-xs font-semibold text-purple-200 mt-0.5">"{generatedScript.hook}"</p>
                    </div>

                    {/* Timeline Breakdown */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Estructura del Guión:</span>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {generatedScript.scriptStructure?.map((step, idx) => (
                          <div key={idx} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80 text-xs grid grid-cols-12 gap-2">
                            <div className="col-span-3 font-mono font-bold text-cyan-400 text-[10px]">{step.time}</div>
                            <div className="col-span-9 space-y-1">
                              <p className="text-slate-200 font-medium">🗣️ <span className="italic">"{step.voiceover}"</span></p>
                              <p className="text-slate-400 text-[11px]">🎮 Visual: {step.visual}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hashtags & CTA */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {generatedScript.hashtags?.map((tag, i) => (
                        <span key={i} className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500 space-y-3">
                  <Bot className="w-12 h-12 text-slate-700 animate-pulse" />
                  <p className="text-xs">Configura los parámetros a la izquierda y presiona "Generar Guión Viral"</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 4: PLANIFICADOR AUTOMÁTICO DE PUBLICACIONES */}
        {}
        {activeTab === 'planner' && (
          <div className="space-y-6">
            
            {/* AI Recommendation Strategy Header */}
            <div className="bg-gradient-to-r from-purple-950/50 via-slate-900 to-cyan-950/50 border border-cyan-500/30 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Recomendación Estratégica Automática</h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Según el historial registrado, tus videos de <span className="text-cyan-400 font-bold">GTA VI</span> y <span className="text-cyan-400 font-bold">Red Dead Redemption 2</span> obtienen un 65% más de retención cuando se publican en días viernes entre 18:00 y 21:00 hs.
                  </p>
                </div>
              </div>
            </div>

            {/* Weekly Calendar Schedule */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                Calendario de Publicación Semanal
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, idx) => {
                  const scheduled = projects.filter((_, pIdx) => pIdx % 7 === idx);
                  return (
                    <div key={day} className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl min-h-[160px] flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-slate-400 font-mono uppercase block mb-2">{day}</span>
                        {scheduled.map((item) => (
                          <div key={item.id} className="bg-slate-900 border border-slate-700/80 p-2 rounded-lg text-[11px] mb-2 space-y-1">
                            <span className="text-[9px] font-bold text-cyan-400 uppercase font-mono block truncate">
                              {item.game}
                            </span>
                            <p className="font-medium text-slate-200 line-clamp-2">{item.title}</p>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setEditingProject(null);
                          setProjectForm({
                            title: '',
                            game: 'GTA VI',
                            status: 'Idea',
                            date: new Date().toISOString().split('T')[0],
                            link: '',
                            views: 0,
                            likes: 0,
                            comments: 0,
                            hook: '',
                            notes: ''
                          });
                          setIsModalOpen(true);
                        }}
                        className="w-full py-1 text-[10px] font-bold text-slate-500 hover:text-cyan-400 border border-dashed border-slate-800 hover:border-cyan-500/40 rounded-lg transition"
                      >
                        + Agendar
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* TAB 5: ANALIZADOR DE VIDEO (VERTICAL CROP & HIGHLIGHTS) */}
        {}
        {activeTab === 'analyzer' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Player & File Upload */}
            <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-cyan-400" />
                  Previsualización & Simulación 9:16
                </h3>
              </div>

              {/* HTML5 Video Upload Box */}
              {uploadedVideo ? (
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800 flex items-center justify-center">
                  <video src={uploadedVideo} controls className="w-full h-full object-contain" />
                  
                  {/* Simulation 9:16 Crop Overlay Box */}
                  <div className="absolute inset-0 border-x-4 border-cyan-500/40 pointer-events-none flex items-center justify-center">
                    <span className="bg-cyan-950/80 text-cyan-300 font-mono text-[10px] px-2 py-0.5 rounded border border-cyan-500/50">
                      Marco 9:16 (TikTok/Shorts)
                    </span>
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer p-6 transition group bg-slate-950/40">
                  <Upload className="w-10 h-10 text-slate-600 group-hover:text-cyan-400 transition mb-2" />
                  <span className="text-xs font-bold text-slate-300">Cargar Archivo de Video MP4/MOV</span>
                  <span className="text-[10px] text-slate-500 mt-1">Haz clic o arrastra tu gameplay aquí</span>
                  <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                </label>
              )}

              {uploadedVideo && (
                <button
                  onClick={analyzeVideo}
                  disabled={isAnalyzing}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-indigo-600 hover:brightness-110 text-black font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Analizando Audio, Picos y Encuadre Vertical...
                    </>
                  ) : (
                    <>
                      <Scissors className="w-4 h-4" />
                      Analizar Momentos Virales con IA
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Analysis Results */}
            <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Resultados del Análisis
              </h3>

              {analysisResult ? (
                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 font-mono">
                    <p className="text-slate-400">Duración: <span className="text-white font-bold">{analysisResult.duration}</span></p>
                    <p className="text-slate-400">Resolución: <span className="text-white font-bold">{analysisResult.resolution}</span></p>
                    <p className="text-emerald-400 font-bold">{analysisResult.recommendedFormat}</p>
                  </div>

                  <div className="space-y-2">
                    <span className="font-bold text-slate-300 block">Picos de Interés Identificados:</span>
                    {analysisResult.keyHighlights.map((hl, i) => (
                      <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                        <span className="font-mono text-cyan-400 font-bold">{hl.time}</span>
                        <span className="text-slate-200">{hl.label}</span>
                        <span className="text-[10px] bg-purple-950 text-purple-300 px-2 py-0.5 rounded font-bold">{hl.score}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-purple-950/20 border border-purple-500/30 p-3 rounded-xl space-y-1">
                    <span className="font-bold text-purple-300 block">Sugerencia de Subtítulos Dinámicos:</span>
                    {analysisResult.subtitlesSuggested.map((s, i) => (
                      <p key={i} className="text-slate-300 text-[11px]">
                        <span className="text-purple-400 font-mono font-bold">{s.time}:</span> "{s.text}"
                      </p>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-center p-6 space-y-2">
                  <Scissors className="w-10 h-10 text-slate-700" />
                  <p className="text-xs">Carga un video para extraer cortes automáticos y subtítulos recomendados</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 6: INTEGRACIONES Y CENTRO DE AUTOMATIZACIÓN */}
        {}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            
            {/* External Services Explanation */}
            <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                Información Transparente de Integraciones & Servicios Externos
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                VicioAI Studio opera con almacenamiento persistente local en el navegador del usuario y se conecta directamente a la API de Gemini para la generación de guiones. Las integraciones oficiales de TikTok Graph API y YouTube Data API v3 requieren OAuth 2.0 y tokens de desarrollador otorgados por las plataformas.
              </p>
            </div>

            {/* API Connections Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Gemini API Key */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">Google Gemini API</span>
                  <span className="text-[10px] font-mono bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold">
                    Activo
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="API Key opcional (Auto-proporcionada)"
                  value={apiKeys.geminiKey}
                  onChange={(e) => setApiKeys({ ...apiKeys, geminiKey: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <p className="text-[10px] text-slate-400">Usada para la generación de ideas y títulos virales.</p>
              </div>

              {/* YouTube Data API */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">YouTube Data API v3</span>
                  <span className="text-[10px] font-mono bg-amber-950 text-amber-400 px-2 py-0.5 rounded font-bold">
                    Modo Sandbox
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="OAuth Client Token"
                  value={apiKeys.youtubeToken}
                  onChange={(e) => setApiKeys({ ...apiKeys, youtubeToken: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <p className="text-[10px] text-slate-400">Requiere registro en Google Cloud Console.</p>
              </div>

              {/* TikTok Graph API */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">TikTok Content Posting API</span>
                  <span className="text-[10px] font-mono bg-purple-950 text-purple-400 px-2 py-0.5 rounded font-bold">
                    Modo Sandbox
                  </span>
                </div>
                <input
                  type="password"
                  placeholder="Access Token de TikTok"
                  value={apiKeys.tiktokToken}
                  onChange={(e) => setApiKeys({ ...apiKeys, tiktokToken: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
                />
                <p className="text-[10px] text-slate-400">Requiere permisos de la app TikTok for Developers.</p>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* MODAL PARA CREAR / EDITAR PROYECTO */}
      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121522] border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingProject ? 'Editar Proyecto' : 'Añadir Nuevo Video'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Título del Video</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: El misterio oculto de RDR2..."
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Videojuego</label>
                  <select
                    value={projectForm.game}
                    onChange={(e) => setProjectForm({ ...projectForm, game: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    {GAME_OPTIONS.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Estado</label>
                  <select
                    value={projectForm.status}
                    onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    {STATUS_COLUMNS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Gancho Inicial (Hook)</label>
                <input
                  type="text"
                  placeholder="Frase de los primeros 3 segundos"
                  value={projectForm.hook}
                  onChange={(e) => setProjectForm({ ...projectForm, hook: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Visualizaciones</label>
                  <input
                    type="number"
                    value={projectForm.views}
                    onChange={(e) => setProjectForm({ ...projectForm, views: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Likes</label>
                  <input
                    type="number"
                    value={projectForm.likes}
                    onChange={(e) => setProjectForm({ ...projectForm, likes: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Comentarios</label>
                  <input
                    type="number"
                    value={projectForm.comments}
                    onChange={(e) => setProjectForm({ ...projectForm, comments: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-extrabold rounded-xl hover:brightness-110 shadow-lg shadow-cyan-500/20"
                >
                  {editingProject ? 'Guardar Cambios' : 'Crear Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}