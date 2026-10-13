import React, { useState } from 'react';
import { 
  Video, 
  Sparkles, 
  Calendar, 
  Layout, 
  TrendingUp, 
  Radio, 
  Settings, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus,
  Play
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('kanban');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-violet-600 to-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                VicioAI Studio
              </h1>
              <span className="text-xs text-indigo-400 font-medium">Content Creator Suite</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Gemini API Conectada
            </div>
            <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 flex flex-col md:flex-row gap-6">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'kanban', label: 'Proyectos Kanban', icon: Layout },
            { id: 'script', label: 'Generador de Guiones', icon: Sparkles },
            { id: 'planner', label: 'Planificador Semanal', icon: Calendar },
            { id: 'analyzer', label: 'Analizador 9:16', icon: Video },
            { id: 'metrics', label: 'Métricas en Vivo', icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Dynamic Content Area */}
        <main className="flex-1 bg-slate-900/40 rounded-2xl border border-slate-800/80 p-6 shadow-xl backdrop-blur-sm">
          {activeTab === 'kanban' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold">Tablero de Producción</h2>
                  <p className="text-sm text-slate-400">Organiza tus videos para TikTok y YouTube Shorts</p>
                </div>
                <button className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-600/20">
                  <Plus className="w-4 h-4" />
                  <span>Nuevo Video</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1 */}
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-sm flex items-center text-amber-400">
                      <Clock className="w-4 h-4 mr-2" /> Ideas / Guion
                    </span>
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded-md text-slate-400">2</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer">
                      <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">GTA 6</span>
                      <h4 className="font-medium text-sm mt-1">Configuración ideal para PS5 Pro y 4K</h4>
                      <p className="text-xs text-slate-400 mt-2">Gancho principal listo para grabar.</p>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-sm flex items-center text-indigo-400">
                      <Play className="w-4 h-4 mr-2" /> En Edición
                    </span>
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded-md text-slate-400">1</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors cursor-pointer">
                      <span className="text-xs text-violet-400 font-semibold uppercase tracking-wider">Meme Gamer</span>
                      <h4 className="font-medium text-sm mt-1">Preparativos para GTA 6 (POV)</h4>
                      <p className="text-xs text-slate-400 mt-2">Agregando subtítulos dinámicos.</p>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="bg-slate-900/80 rounded-xl p-4 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-sm flex items-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4 mr-2" /> Listo para Publicar
                    </span>
                    <span className="text-xs bg-slate-800 px-2 py-1 rounded-md text-slate-400">0</span>
                  </div>
                  <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg">
                    Sin videos pendientes
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'kanban' && (
            <div className="h-64 flex flex-col items-center justify-center text-center">
              <Sparkles className="w-10 h-10 text-indigo-400 mb-3 animate-bounce" />
              <h3 className="text-lg font-semibold">Módulo {activeTab.toUpperCase()} Activo</h3>
              <p className="text-sm text-slate-400 max-w-sm mt-1">
                La estructura base está compilada correctamente y lista para expansión.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
