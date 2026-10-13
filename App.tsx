import React, { useState, useEffect } from 'react';
import { Video, Settings, LayoutDashboard, Sparkles, Plus, Clock, Play, CheckCircle2, Trash2, ChevronRight, ChevronLeft, Copy, Check, X } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'idea' | 'editing' | 'ready';
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'generator'>('kanban');
  const [isNewVideoOpen, setIsNewVideoOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  
  const [scriptTopic, setScriptTopic] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [copied, setCopied] = useState(false);

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('vicioai_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'GTA 6 LLEGA PRONTO', description: 'Los 3 personajes de GTA V despidiéndose.', status: 'idea' },
      { id: '2', title: 'CONFIGURACIÓN PS5 PRO 4K', description: 'Ajustes gráficos ideales para OLED.', status: 'editing' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('vicioai_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setTasks([{ id: Date.now().toString(), title: newTitle.toUpperCase(), description: newDesc || 'Sin detalles.', status: 'idea' }, ...tasks]);
    setNewTitle(''); setNewDesc(''); setIsNewVideoOpen(false);
  };

  const moveTask = (id: string, status: 'idea' | 'editing' | 'ready') => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id: string) => {
    if (confirm('¿Eliminar proyecto?')) setTasks(tasks.filter(t => t.id !== id));
  };

  const generateScript = () => {
    if (!scriptTopic.trim()) return;
    setGeneratedScript(`🔥 GUION VIRAL: ${scriptTopic.toUpperCase()}\n\n🎣 GANCHO (0-3s):\n"¡No cometas este error si esperas ${scriptTopic}!"\n\n💡 DESARROLLO (3-40s):\n- Punto clave 1 sobre ${scriptTopic}.\n- Demostración en pantalla.\n\n🚀 CALL TO ACTION:\n"¡Comenta y sígueme para más!"`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-4 max-w-2xl mx-auto pb-12">
      <header className="flex justify-between items-center pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-600 p-2 rounded-xl"><Video className="w-5 h-5 text-white" /></div>
          <h1 className="font-bold text-lg">VicioAI Studio</h1>
        </div>
      </header>

      <nav className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('kanban')} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 ${activeTab === 'kanban' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
          <LayoutDashboard className="w-4 h-4" /> <span>Kanban</span>
        </button>
        <button onClick={() => setActiveTab('generator')} className={`flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 ${activeTab === 'generator' ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'}`}>
          <Sparkles className="w-4 h-4 text-amber-400" /> <span>Guiones IA</span>
        </button>
      </nav>

      {activeTab === 'kanban' ? (
        <div className="space-y-4">
          <button onClick={() => setIsNewVideoOpen(true)} className="w-full bg-indigo-600 hover:bg-indigo-500 py-3 rounded-xl font-medium text-sm flex items-center justify-center space-x-2 shadow-lg">
            <Plus className="w-4 h-4" /> <span>Nuevo Video</span>
          </button>

          {[
            { key: 'idea', name: 'Ideas / Guion', icon: Clock, color: 'text-amber-400', list: tasks.filter(t => t.status === 'idea') },
            { key: 'editing', name: 'En Edición', icon: Play, color: 'text-indigo-400', list: tasks.filter(t => t.status === 'editing') },
            { key: 'ready', name: 'Listo para Publicar', icon: CheckCircle2, color: 'text-emerald-400', list: tasks.filter(t => t.status === 'ready') }
          ].map(col => (
            <div key={col.key} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
              <div className={`flex items-center justify-between mb-3 ${col.color} font-bold text-xs uppercase tracking-wider`}>
                <div className="flex items-center space-x-2"><col.icon className="w-4 h-4" /><span>{col.name}</span></div>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">{col.list.length}</span>
              </div>
              <div className="space-y-2">
                {col.list.map(t => (
                  <div key={t.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-indigo-400 text-xs">{t.title}</span>
                      <button onClick={() => deleteTask(t.id)} className="text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <p className="text-xs text-slate-300 mb-3">{t.description}</p>
                    <div className="flex justify-between text-xs pt-2 border-t border-slate-900">
                      {t.status !== 'idea' && <button onClick={() => moveTask(t.id, t.status === 'ready' ? 'editing' : 'idea')} className="text-slate-400 flex items-center"><ChevronLeft className="w-3 h-3"/> Atrás</button>}
                      {t.status !== 'ready' && <button onClick={() => moveTask(t.id, t.status === 'idea' ? 'editing' : 'ready')} className="text-indigo-400 font-semibold flex items-center ml-auto">Avanzar <ChevronRight className="w-3 h-3"/></button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <h2 className="font-bold text-sm text-amber-400 flex items-center space-x-2"><Sparkles className="w-4 h-4"/> <span>Generador Rápido</span></h2>
          <input type="text" value={scriptTopic} onChange={(e) => setScriptTopic(e.target.value)} placeholder="Tema del video..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200" />
          <button onClick={generateScript} className="w-full bg-indigo-600 py-2.5 rounded-xl font-medium text-sm">Generar Guion</button>
          {generatedScript && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap">
              {generatedScript}
            </div>
          )}
        </div>
      )}

      {isNewVideoOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center"><h3 className="font-bold text-sm">Nuevo Video</h3><button onClick={() => setIsNewVideoOpen(false)}><X className="w-4 h-4"/></button></div>
            <form onSubmit={handleCreate} className="space-y-3">
              <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Título..." required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm" />
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Descripción..." rows={2} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm resize-none" />
              <button type="submit" className="w-full bg-indigo-600 py-2 rounded-xl text-sm font-medium">Guardar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
