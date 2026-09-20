import type { PsychiatricScale, ScoreResult } from '../types/scale';
import { BADGE } from '../lib/ui';
import { SeverityRuler } from './SeverityRuler';

interface Props { scale: PsychiatricScale; result: ScoreResult; complete: boolean; progress: { done: number; total: number } }

/** Painel de resultado em tempo real. Enquanto houver pendências, o escore é rotulado como parcial. */
export function ResultPanel({ scale, result, complete, progress }: Props) {
  const c = result.cutoff;
  return (
    <section aria-live="polite" className="rounded-lg border border-line bg-white p-5 dark:border-slate-700 dark:bg-slate-900/60">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-semibold text-slate-600 dark:text-slate-400">{scale.scoreLabel ?? 'Escore total'}{complete ? '' : ' (parcial)'}</h2>
        <span className="text-sm tabular-nums text-slate-500">{progress.done}/{progress.total} itens</span>
      </div>
      <p className="mt-1 text-5xl font-bold tabular-nums tracking-tight">
        {result.total}
        <span className="ml-1 text-lg font-medium text-slate-500">/ {scale.maxScore}</span>
      </p>

      <div className="mt-3"><SeverityRuler cutoffs={scale.cutoffs} min={scale.minScore} max={scale.maxScore} value={result.total} dimmed={!complete} /></div>

      {complete && c ? (
        <div className="mt-4">
          <span className={`inline-block rounded px-2.5 py-1 text-sm font-semibold ${BADGE[c.badgeColor].chip}`}>{result.classification}</span>
          {c.clinicalImplication && <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{c.clinicalImplication}</p>}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">A classificação aparece quando todos os itens estiverem respondidos.</p>
      )}

      {complete && result.notes?.map((n) => <p key={n} className="mt-2 text-sm text-slate-700 dark:text-slate-300">{n}</p>)}

      {result.subscores && scale.subscales && (
        <dl className="mt-4 space-y-1.5 border-t border-line pt-3 text-sm dark:border-slate-700">
          {scale.subscales.map((s) => (
            <div key={s.key} className="flex justify-between gap-3">
              <dt className="text-slate-600 dark:text-slate-400">{s.label}</dt>
              <dd className="font-semibold tabular-nums">{result.subscores?.[s.key] ?? 0}{s.max ? ` / ${s.max}` : ''}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}
