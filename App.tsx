import React, { useState } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  Kanban as KanbanIcon, 
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
  Gamepad2, 
  Share2, 
  Copy, 
  Download 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [geminiKey, setGeminiKey] = useState('');
  const [promptInput, setPromptInput] = useState('');
  const [aiOutput, setAiOutput] = useState('');
  const [loading, setLoading] = useState(false);

  // Kanban State
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Grabar partida de GTA VI (Gameplay filtrado)', status: 'todo', platform: 'TikTok' },
    { id: '2', title: 'Editar Shorts con transiciones rápidas', status: 'in-progress', platform: 'YouTube Shorts' },
    { id: '3', title: 'Publicar avance de RDR2 con meme', status: 'done', platform: 'TikTok' }
  ]);

  const handleGenerateAI = () => {
    if (!promptInput) return;
    setLoading(true);
    setTimeout(() => {
      setAiOutput(`✨ [VicioAI Studio Pro] Guión optimizado para TikTok/Shorts:\n\n1. Gancho (0-3s): "¡Nadie te advirtió sobre esto en GTA 6!"\n2. Desarrollo: Análisis rápido de '${promptInput}' con ritmo dinámico y gameplay de fondo.\n3. Llamado a la acción: "Comenta tu opinión y sígueme para más secretos gamer."\n\n#Gamer #GTA6 #TikTokGaming #VicioAI`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar para Escritorio */}
      <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/30">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="font-black tracking-wider text-lg bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                VICIOAI STUDIO
              </h1>
              <p className="text-xs text-slate-400">Creator Hub Pro</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
              { id: 'kanban', label: 'Kanban Contenido', icon: KanbanIcon },
              { id: 'ai', label: 'Asistente IA (Gemini)', icon: Bot },
              { id: 'planner', label: 'Planificador Semanal', icon: Calendar },
              { id: 'analyzer', label: 'Analizador 9:16', icon: Video },
              { id: 'settings', label: 'Ajustes', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          VicioAI Studio v1.0 • 100% Propietario
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <header className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Panel de Control</h2>
                <p className="text-sm text-slate-400">Resumen general de tu rendimiento en TikTok y Shorts.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Sistema Activo & Conectado
              </div>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Visualizaciones Totales', value: '248.5K', change: '+18.2%', icon: Eye, color: 'text-blue-400' },
                { title: 'Me Gusta', value: '42.1K', change: '+12.5%', icon: Heart, color: 'text-rose-400' },
                { title: 'Comentarios', value: '3,480', change: '+8.1%', icon: MessageSquare, color: 'text-amber-400' },
                { title: 'Seguidores Nuevos', value: '12.8K', change: '+24.3%', icon: Users, color: 'text-emerald-400' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-slate-400">{stat.title}</span>
                      <Icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <span className="text-xs text-emerald-400 font-semibold">{stat.change} vs semana pasada</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'kanban' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Organizador de Contenido (Kanban)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {['todo', 'in-progress', 'done'].map((status) => (
                <div key={status} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-slate-400">
                    {status === 'todo' ? 'Pendientes' : status === 'in-progress' ? 'En Edición' : 'Publicados'}
                  </h3>
                  <div className="space-y-3">
                    {tasks.filter(t => t.status === status).map(task => (
                      <div key={task.id} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl shadow">
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-semibold">{task.platform}</span>
                        <p className="text-sm font-medium mt-2 text-white">{task.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-2xl font-bold text-white">Generador IA de Guiones y Ganchos</h2>
              <p className="text-sm text-slate-400">Impulsado por Google Gemini API para crear ganchos virales.</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Tema o Juego del Short</label>
                <input 
                  type="text" 
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="Ej: Easter egg secreto en GTA 6 o RDR2..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button 
                onClick={handleGenerateAI}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                <Sparkles className="w-5 h-5" />
                {loading ? 'Generando magia...' : 'Generar Guión Viral'}
              </button>

              {aiOutput && (
                <div className="mt-6 bg-slate-950 border border-slate-800 p-4 rounded-xl whitespace-pre-line text-sm text-slate-300">
                  {aiOutput}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'planner' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Planificador Semanal</h2>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
              {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-xl min-h-[160px]">
                  <h3 className="font-bold text-sm text-indigo-400 mb-2">{day}</h3>
                  <p className="text-xs text-slate-500">Sin publicaciones programadas</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analyzer' && (
          <div className="space-y-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-white">Analizador de Video 9:16</h2>
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl text-center border-dashed border-slate-700">
              <Video className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">Arrastra tu video vertical aquí</h3>
              <p className="text-xs text-slate-400 mt-1">Compatible con resoluciones 1080x1920 para TikTok y Shorts.</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-xl">
            <h2 className="text-2xl font-bold text-white">Ajustes de la Aplicación</h2>
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">Clave de API Google Gemini</label>
                <input 
                  type="password" 
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <button 
                onClick={() => alert('¡Ajustes guardados con éxito!')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
                }
