import { useState } from 'react';
import { ArrowLeft, BookOpen, ClipboardList, Printer } from 'lucide-react';
import type { PsychiatricScale } from '../types/scale';
import { useAssessment } from '../hooks/useAssessment';
import { CATEGORY_LABEL, TYPE_LABEL } from '../lib/ui';
import { AssessmentForm } from './AssessmentForm';
import { AboutPanel } from './AboutPanel';
import { PrintView } from './PrintView';
import type { SheetMode } from './PrintSheet';

type Tab = 'apply' | 'about' | 'print';
const TABS: [Tab, string, typeof BookOpen][] = [['apply', 'Aplicar', ClipboardList], ['about', 'Sobre o instrumento', BookOpen], ['print', 'Imprimir e PDF', Printer]];

/** Tela de um instrumento. As respostas vivem aqui, então trocar de aba não perde o preenchimento. */
export function ScaleView({ scale, onBack }: { scale: PsychiatricScale; onBack: () => void }) {
  const [tab, setTab] = useState<Tab>('apply');
  const [sheetMode, setSheetMode] = useState<SheetMode>('blank');
  const assessment = useAssessment(scale);

  return (
    <div>
      <div className="no-print">
        <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-petrol-600 hover:underline dark:text-petrol-300"><ArrowLeft className="h-4 w-4" aria-hidden /> Todas as escalas</button>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{scale.acronym}</h1>
        <p className="mt-1 text-lg text-slate-700 dark:text-slate-300">{scale.name}</p>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{CATEGORY_LABEL[scale.category]}, {TYPE_LABEL[scale.type].toLowerCase()}, cerca de {scale.estimatedMinutes} min</p>

        <div role="tablist" aria-label="Seções do instrumento" className="mt-5 flex gap-1 overflow-x-auto border-b border-line dark:border-slate-700">
          {TABS.map(([id, label, Icon]) => (
            <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}
              className={`-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium ${tab === id ? 'border-petrol-600 text-petrol-700 dark:border-petrol-300 dark:text-petrol-100' : 'border-transparent text-slate-600 hover:text-ink dark:text-slate-400 dark:hover:text-white'}`}>
              <Icon className="h-4 w-4" aria-hidden /> {label}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" className="print-container pt-6">
        {tab === 'apply' && <AssessmentForm scale={scale} assessment={assessment} onReport={() => { setSheetMode('report'); setTab('print'); window.scrollTo(0, 0); }} />}
        {tab === 'about' && <AboutPanel scale={scale} />}
        {tab === 'print' && <PrintView scale={scale} assessment={assessment} mode={sheetMode} onMode={setSheetMode} />}
      </div>
    </div>
  );
}
