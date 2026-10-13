import React, { useState, useEffect } from 'react';
import { 
  Video, 
  Settings, 
  LayoutDashboard, 
  Sparkles, 
  Plus, 
  Clock, 
  Play, 
  CheckCircle2, 
  X, 
  Sliders, 
  FolderPlus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Key
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'idea' | 'editing' | 'ready';
  createdAt: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'generator'>('kanban');
  const [isNewVideoOpen, setIsNewVideoOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Clave API de Gemini cargada desde almacenamiento local
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('vicioai_gemini_key') || '';
  });

  // Cargar tareas iniciales desde localStorage o usar las predeterminadas
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('vicioai_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: '1',
        title: 'GTA 6 LLEGA PRONTO',
        description: 'Los Tres personajes de GTA V despidiéndose porque ya llega GTA VI.',
        status: 'idea',
        createdAt: new Date().toLocaleDateString('es-AR')
      },
      {
        id: '2',
        title: 'CONFIGURACIÓN PS5 PRO 4K',
        description: 'Ajustes gráficos ideales para máximo rendimiento en pantallas OLED.',
        status: 'editing',
        createdAt: new Date().toLocaleDateString('es-AR')
      }
    ];
  });

  // Guardar tareas automáticamente cada vez que cambien
  useEffect(() => {
    localStorage.setItem('vicioai_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Guardar clave API
  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('vicioai_gemini_key', key);
  };

  // Estados del Formulario de Nuevo Video
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Estados del Generador de Guiones con IA
  const [scriptTopic, setScriptTopic] = useState('');
  const [scriptPlatform, setScriptPlatform] = useState('TikTok / Shorts (Vertical 9:16)');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Crear nuevo video
  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle.toUpperCase().trim(),
      description: newDesc.trim() || 'Sin detalles adicionales.',
      status: 'idea',
      createdAt: new Date().toLocaleDateString('es-AR')
    };

    setTasks([newTask, ...tasks]);
    setNewTitle('');
    setNewDesc('');
    setIsNewVideoOpen(false);
  };

  // Mover estado de tarea
  const moveTask = (id: string, newStatus: 'idea' | 'editing' | 'ready') => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  // Eliminar tarea
  const deleteTask = (id: string) => {
    if (confirm('¿Deseas eliminar este proyecto del tablero?')) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  // Generar guion automático (Soporta Gemini API o Generación Inteligente Local)
  const handleGenerateScript = async () => {
    if (!scriptTopic.trim()) {
      alert('Ingresa un tema o título para generar el guión.');
      return;
    }

    setIsGenerating(true);
    setGeneratedScript('');

    if (apiKey.trim()) {
      // Uso con API Key real de Google Gemini
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Eres un experto creador de contenido viral. Genera un guión estructurado e impactante para la plataforma "${scriptPlatform}" sobre el tema: "${scriptTopic}".
Incluye:
1. HOOK / GANCHO VIRAL (primeros 3 segundos)
2. DESARROLLO (puntos clave dinámicos)
3. CALL TO ACTION (Llamado a la acción rápido)
Formato limpio y directo con emojis.`
              }]
            }]
          })
        });

        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          setGeneratedScript(data.candidates[0].content.parts[0].text);
        } else {
          throw new Error('Respuesta inválida de API');
        }
      } catch (err) {
        alert('Error con la clave de API. Se generará una estructura simulada.');
        generateFallbackScript();
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Generación plantilla estructurada
      setTimeout(() => {
        generateFallbackScript();
        setIsGenerating(false);
      }, 1000);
    }
  };

  const generateFallbackScript = () => {
    setGeneratedScript(`🔥 GUION VIRAL PARA: ${scriptTopic.toUpperCase()}
📱 Formato: ${scriptPlatform}

🎣 GANCHO (0:00 - 0:03):
"¡No cometas este error si estás esperando ${scriptTopic}! Miren esto..."

💡 DESARROLLO (0:03 - 0:40):
- Dato clave 1: Lo que nadie te está contando sobre ${scriptTopic}.
- Dato clave 2: La mejor configuración/método comprobado para optimizarlo.
- Demostración en pantalla / Reacción visual rápida.

🚀 LLAMADO A LA ACCIÓN (0:40 - 0:50):
"¿Qué opínas de esto? Déjalo en los comentarios y sígueme para más contenido gamer daily!"`);
  };

  // Copiar guión generado
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convertir guión en tarea
  const sendScriptToKanban = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: scriptTopic.toUpperCase().trim(),
      description: generatedScript,
      status: 'idea',
      createdAt: new Date().toLocaleDateString('es-AR')
    };

    setTasks([newTask, ...tasks]);
    alert('¡Guión enviado al Tablero Kanban como nuevo proyecto!');
    setActiveTab('kanban');
  };

  const ideaTasks = tasks.filter(t => t.status === 'idea');
  const editingTasks = tasks.filter(t => t.status === 'editing');
  const readyTasks = tasks.filter(t => t.status === 'ready');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white pb-12">
      
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

      {/* Navegación Pestañas */}
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
      <main className="flex-1 px-4 max-w-5xl w-full mx-auto">
        {activeTab === 'kanban' ? (
          <div className="space-y-6">
            
            {/* Cabecera del Tablero */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 border border-slate-800/60 p-5 rounded-2xl backdrop-blur-sm">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Tablero de Producción</h2>
                <p className="text-xs text-slate-400 mt-1">Organiza tus videos para TikTok, Reels y YouTube Shorts</p>
              </div>
              <button
                onClick={() => setIsNewVideoOpen(true)}
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium px-4 py-3 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Video</span>
              </button>
            </div>

            {/* Columnas Kanban */}
            <div className="space-y-6">
              
              {/* Columna 1: Ideas / Guion */}
              <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center space-x-2 text-amber-400">
                    <Clock className="w-4 h-4" />
                    <span className="font-semibold text-sm">Ideas / Guion</span>
                  </div>
                  <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
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
                      <div key={task.id} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 hover:border-indigo-500/50 transition-all space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{task.title}</span>
                          <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-red-400 p-1 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-slate-200 whitespace-pre-wrap">{task.description}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs text-slate-500">
                          <span>{task.createdAt}</span>
                          <button 
                            onClick={() => moveTask(task.id, 'editing')}
                            className="flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-300 font-medium bg-indigo-500/10 hover:bg-indigo-500/20 px-2.5 py-1 rounded-lg transition-all"
                          >
                            <span>Pasar a Edición</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
                  <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
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
                      <div key={task.id} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 hover:border-indigo-500/50 transition-all space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{task.title}</span>
                          <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-red-400 p-1 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-slate-200 whitespace-pre-wrap">{task.description}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                          <button 
                            onClick={() => moveTask(task.id, 'idea')}
                            className="flex items-center space-x-1 text-slate-400 hover:text-slate-200"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Idea</span>
                          </button>
                          <button 
                            onClick={() => moveTask(task.id, 'ready')}
                            className="flex items-center space-x-1 text-xs text-emerald-400 hover:text-emerald-300 font-medium bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg transition-all"
                          >
                            <span>Marcar Listo</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
                  <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-0.5 rounded-full font-bold">
                    {readyTasks.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {readyTasks.length === 0 ? (
                    <div className="border border-dashed border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs">
                      Sin videos pendientes
                    </div>
                  ) : (
                    readyTasks.map(task => (
                      <div key={task.id} className="bg-slate-950/80 border border-emerald-900/30 rounded-xl p-4 transition-all space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{task.title}</span>
                          <button onClick={() => deleteTask(task.id)} className="text-slate-500 hover:text-red-400 p-1 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm font-medium text-slate-200 whitespace-pre-wrap">{task.description}</p>
                        <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                          <button 
                            onClick={() => moveTask(task.id, 'editing')}
                            className="flex items-center space-x-1 text-slate-400 hover:text-slate-200"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                            <span>Regresar a Edición</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          /* Vista del Generador de Guiones */
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 space-y-6 backdrop-blur-sm">
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
                  value={scriptTopic}
                  onChange={(e) => setScriptTopic(e.target.value)}
                  placeholder="Ej. Configuración gráfica ideal en GTA 6..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Plataforma Objetivo</label>
                <select 
                  value={scriptPlatform}
    
