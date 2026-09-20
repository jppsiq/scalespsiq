import { useState } from 'react';
import { FileText, RotateCcw } from 'lucide-react';
import type { PsychiatricScale } from '../types/scale';
import type { Assessment } from '../hooks/useAssessment';
import { AlertBanner } from './AlertBanner';
import { ItemCard } from './ItemCard';
import { ResultPanel } from './ResultPanel';

interface Props { scale: PsychiatricScale; assessment: Assessment; onReport: () => void }

/** Preenchimento interativo: progresso, itens, validação de pendências, alerta imediato e resultado ao vivo. */
export function AssessmentForm({ scale, assessment: a, onReport }: Props) {
  const [showMissing, setShowMissing] = useState(false);
  const pct = a.progress.total ? Math.round((a.progress.done / a.progress.total) * 100) : 0;
  const missing = a.items.filter((it) => !it.optional && a.answers[it.id] === undefined);

  const review = () => {
    setShowMissing(true);
    document.getElementById(`item-${missing[0]?.id}`)?.scrollIntoView({ block: 'center' });
  };

  let lastSection: string | undefined;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
        {/* Barra de progresso fixa no topo enquanto rola */}
        <div className="sticky top-14 z-10 -mx-4 mb-4 border-b border-line bg-paper/95 px-4 py-2 backdrop-blur dark:border-slate-700 dark:bg-petrol-900/95">
          <div className="flex items-center gap-3 text-sm">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-petrol-100 dark:bg-slate-700" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progresso do preenchimento">
              <div className="h-full bg-petrol-600 transition-[width] dark:bg-petrol-300" style={{ width: `${pct}%` }} />
            </div>
            <span className="tabular-nums text-slate-600 dark:text-slate-400">{a.progress.done} de {a.progress.total}</span>
            <span className="font-semibold tabular-nums lg:hidden">{a.result.total}/{scale.maxScore}</span>
          </div>
        </div>

        {/* O alerta aparece no instante em que o gatilho é marcado, sem esperar o fim do preenchimento */}
        {a.result.clinicalAlert && <div className="sticky top-24 z-10 mb-4"><AlertBanner message={a.result.clinicalAlert} /></div>}

        <p className="mb-4 max-w-prose rounded-lg bg-petrol-50 p-4 text-sm leading-relaxed dark:bg-slate-800">
          {scale.timeframe && <strong className="font-semibold">{scale.timeframe}. </strong>}
          {scale.instructions}
        </p>

        <div className="space-y-3">
          {a.items.map((item) => {
            const header = item.section && item.section !== lastSection ? item.section : null;
            lastSection = item.section;
            return (
              <div key={item.id}>
                {header && <h3 className="mb-2 mt-6 text-base font-semibold">{header}</h3>}
                <ItemCard item={item} value={a.answers[item.id]} missing={showMissing && !item.optional && a.answers[item.id] === undefined} onChange={(v) => a.setAnswer(item.id, v)} />
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {a.complete ? (
            <button onClick={onReport} className="inline-flex items-center gap-2 rounded-md bg-petrol-600 px-4 py-2.5 font-semibold text-white hover:bg-petrol-700">
              <FileText className="h-4 w-4" aria-hidden /> Gerar relatório
            </button>
          ) : (
            <button onClick={review} className="rounded-md border border-amber-600 px-4 py-2.5 font-semibold text-amber-800 hover:bg-amber-50 dark:text-amber-300 dark:hover:bg-amber-950">
              Revisar {missing.length} {missing.length === 1 ? 'item pendente' : 'itens pendentes'}
            </button>
          )}
          <button onClick={() => { a.reset(); setShowMissing(false); window.scrollTo(0, 0); }} disabled={!a.started} className="inline-flex items-center gap-2 rounded-md border border-line px-4 py-2.5 font-medium hover:bg-petrol-50 disabled:opacity-40 dark:border-slate-600 dark:hover:bg-slate-800">
            <RotateCcw className="h-4 w-4" aria-hidden /> Limpar respostas
          </button>
        </div>
      </div>

      <aside className="lg:sticky lg:top-28 lg:self-start">
        <ResultPanel scale={scale} result={a.result} complete={a.complete} progress={a.progress} />
      </aside>
    </div>
  );
}
