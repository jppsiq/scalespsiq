import { Moon, Sun } from 'lucide-react';
import { getScale } from './data/scales';
import { useHashRoute } from './hooks/useHashRoute';
import { useTheme } from './hooks/useTheme';
import { Dashboard } from './components/Dashboard';
import { ScaleView } from './components/ScaleView';

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const { scaleId, go } = useHashRoute();
  const scale = scaleId ? getScale(scaleId) : undefined;

  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur dark:border-slate-700 dark:bg-petrol-900/95">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
          <button onClick={() => go(null)} className="flex items-center gap-2 font-bold tracking-tight">
            <span aria-hidden className="flex h-7 w-7 items-end gap-0.5 rounded bg-petrol-600 p-1.5">
              <span className="h-1/3 flex-1 bg-white/90" /><span className="h-2/3 flex-1 bg-white/90" /><span className="h-full flex-1 bg-white/90" />
            </span>
            Psicometria Clínica
          </button>
          <button onClick={toggleTheme} aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'} className="rounded-md p-2 hover:bg-petrol-50 dark:hover:bg-slate-800">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      <main className="print-container mx-auto max-w-7xl px-4 py-8">
        {/* key força estado novo ao trocar de escala */}
        {scale ? <ScaleView key={scale.id} scale={scale} onBack={() => go(null)} /> : <Dashboard onOpen={go} />}
      </main>

      <footer className="no-print mx-auto max-w-7xl px-4 pb-10 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
        Ferramenta de apoio à decisão para profissionais de saúde. Não substitui a entrevista clínica nem estabelece diagnóstico. Confira a redação dos itens com a versão validada oficial e respeite as licenças de cada instrumento.
      </footer>
    </div>
  );
}
