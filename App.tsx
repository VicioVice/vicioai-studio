import React, { useState } from 'react';
import { 
  Video, 
  Settings, 
  LayoutDashboard, 
  Sparkles, 
  Plus, 
  Clock, 
  Play, 
  CheckCircle2, 
  MoreVertical, 
  X, 
  Sliders, 
  Film,
  FolderPlus
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'idea' | 'editing' | 'ready';
  tag: string;
}

export function App() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'generator'>('kanban');
  const [isNewVideoOpen, setIsNewVideoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Estado para el formulario de nuevo video
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTag, setNewTag] = useState('GTA 6');

  // Lista de tareas iniciales del Kanban
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'GTA 6',
      description: 'Configuración ideal para PS5 Pro y 4K. Gancho principal listo para grabar.',
      status: 'idea',
      tag: 'Ideas / Guion'
    },
    {
      id: '2',
      title: 'MEME GAMER',
      description: 'Preparativos para GTA 6 (POV). Agregando subtítulos dinámicos.',
      status: 'editing',
      tag: 'En Edición'
    }
  ]);

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc || 'Sin descripción adicional.',
      status: 'idea',
      tag: newTag
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewDesc('');
    setIsNewVideoOpen(false);
  };

  const ideaTasks = tasks.filter(t => t.status === 'idea');
  const editingTasks = tasks.filter(t => t.status === 'editing');
  const readyTasks = tasks.filter(t => t.status === 'ready');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Header Superior */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-indigo-600 to-violet-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
            <Video className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              VicioAI Studio
            </h1>
            <p className="text-xs text-slate-400 font-medium">Content Creator Suite</p>
          </div>
        </div>

        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-all shadow-sm active:scale-95"
          title="Configuración"
        >
          <Settings className="w-5 h-5" />
        </button>
      </header>

      {/* Barra de Pestañas / Navegación */}
      <nav className="px-4 py-4 max-w-5xl w-full mx-auto flex flex-wrap gap-3 items-center">
        <button
          onClick={() => setActiveTab('kanban')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-medium text-sm transition-all shadow-lg active:scale-95 ${
            activeTab === 'kanban'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/25 ring-1 ring-indigo-400/30'
              : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Proyectos Kanban</span>
        </button>

        <button
          onClick={() => setActiveTab('generator')}
          className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-medium text-sm transition-all shadow-lg active:scale-95 ${
            activeTab === 'generator'
              ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-indigo-500/25 ring-1 ring-indigo-400/30'
              : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Generador de Guiones</span>
        </button>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-1 px-4 pb-12 max-w-5xl w-full mx-auto">
        {activeTab === 'kanban' ? (
          <div className="space-y-6">
            
            {/* Cabecera del Tablero */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl backdrop-blur-sm">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Tablero de Producción</h2>
                <p className="text-xs text-slate-400 mt-1">Organiza tus videos para TikTok y YouTube Shorts</p>
              </div>
              <button
                onClick={() => setIsNewVideoOpen(true)}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium px-4 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Video</span>
              </button>
            </div>

            {/* Columnas del Kanban */}
            <div className="space-y-4">
              
              {/* Columna 1: Ideas / Guion */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold text-sm">Ideas / Guion</span>
                  </div>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
                    {ideaTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {ideaTasks.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs">
                      Sin ideas pendientes
                    </div>
                  ) : (
                    ideaTasks.map(task => (
                      <div key={task.id} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-indigo-500/50 transition-all group">
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{task.title}</span>
                          <button className="text-slate-500 hover:text-slate-300 p-1">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-slate-200 mt-1">{task.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Columna 2: En Edición */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center space-x-2 text-indigo-400">
                    <Play className="w-4 h-4" />
                    <span className="font-semibold text-sm">En Edición</span>
                  </div>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
                    {editingTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {editingTasks.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs">
                      Sin videos en edición
                    </div>
                  ) : (
                    editingTasks.map(task => (
                      <div key={task.id} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-indigo-500/50 transition-all group">
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{task.title}</span>
                          <button className="text-slate-500 hover:text-slate-300 p-1">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-slate-200 mt-1">{task.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Columna 3: Listo para Publicar */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-semibold text-sm">Listo para Publicar</span>
                  </div>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full font-bold">
                    {readyTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {readyTasks.length === 0 ? (
                    <div className="border border-dashed border-slate-800/80 rounded-xl p-6 text-center text-slate-500 text-xs">
                      Sin videos pendientes
                    </div>
                  ) : (
                    readyTasks.map(task => (
                      <div key={task.id} className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-4 hover:border-indigo-500/50 transition-all group">
                        <div className="flex items-start justify-between">
                          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">{task.title}</span>
                          <button className="text-slate-500 hover:text-slate-300 p-1">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-slate-200 mt-1">{task.description}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Vista del Generador de Guiones */
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Generador de Guiones con IA</h2>
                <p className="text-xs text-slate-400 mt-0.5">Crea ganchos virales y estructuras optimizadas para tus cortos</p>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tema o Título del Video</label>
                <input 
                  type="text" 
                  placeholder="Ej. Configuración secreta en PS5 Pro..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Plataforma Objetivo</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-all">
                  <option>TikTok / YouTube Shorts (Vertical 9:16)</option>
                  <option>Instagram Reels</option>
                  <option>YouTube Longform</option>
                </select>
              </div>

              <button 
                onClick={() => alert("¡Generador listo para integrar con tu API Key o lógica de IA!")}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 text-sm flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generar Guión Viral</span>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Nuevo Video */}
      {isNewVideoOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-400">
                <FolderPlus className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Nuevo Proyecto de Video</h3>
              </div>
              <button 
                onClick={() => setIsNewVideoOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVideo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Nombre del Proyecto</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. GTA 6, Gameplay, Vlog..."
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">Detalles / Gancho</label>
                <textarea 
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Describe brevemente el objetivo del video..."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewVideoOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium py-2.5 rounded-xl transition-all text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-xl shadow-lg shadow-indigo-600/20 transition-all text-sm"
                >
                  Crear Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Configuración */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-indigo-400">
                <Sliders className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Configuración de Studio</h3>
              </div>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span>Modo Oscuro Automático</span>
                <span className="text-emerald-400 font-semibold text-xs bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/20">Activado</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <span>Versión de la App</span>
                <span className="text-slate-400 text-xs">v1.2.0 Production</span>
              </div>
            </div>

            <button
              onClick={() => setIsSettingsOpen(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 rounded-xl transition-all text-sm"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
