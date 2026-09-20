import { useMemo, useState } from 'react';
import { Clock, Search, ShieldAlert } from 'lucide-react';
import { SCALES } from '../data/scales';
import type { PsychiatricScale, ScaleCategory } from '../types/scale';
import { CATEGORY_LABEL, CATEGORY_ORDER, TYPE_LABEL, norm } from '../lib/ui';

type Filter = 'all' | 'self' | 'clinician' | 'emergency' | ScaleCategory;

const QUICK: [Filter, string][] = [['all', 'Todas'], ['self', 'Autoaplicável'], ['clinician', 'Heteroaplicável'], ['emergency', 'Emergência e risco']];

function matches(s: PsychiatricScale, f: Filter, q: string): boolean {
  const okFilter =
    f === 'all' ? true : f === 'self' ? s.type === 'self_administered' : f === 'clinician' ? s.type === 'clinician_administered'
    : f === 'emergency' ? !!s.emergency || s.category === 'suicide_risk' || s.items.some((i) => i.isRedFlagTrigger) : s.category === f;
  const hay = norm(`${s.acronym} ${s.name} ${s.description} ${CATEGORY_LABEL[s.category]}`);
  return okFilter && norm(q).split(/\s+/).every((w) => hay.includes(w));
}

/** Catálogo: busca por nome, sigla ou categoria e filtros rápidos. Agrupado por domínio clínico. */
export function Dashboard({ onOpen }: { onOpen: (id: string) => void }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const list = useMemo(() => SCALES.filter((s) => matches(s, filter, q)), [q, filter]);

  const chip = (f: Filter, label: string) => (
    <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
      className={`rounded-full border px-3 py-1.5 text-sm font-medium ${filter === f ? 'border-petrol-600 bg-petrol-600 text-white' : 'border-line hover:border-petrol-500 dark:border-slate-600'}`}>{label}</button>
  );

  return (
    <div>
      <h1 className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">Escalas psiquiátricas com cálculo, interpretação e folha para imprimir</h1>
      <p className="mt-2 max-w-prose text-slate-700 dark:text-slate-300">{SCALES.length} instrumentos. Escolha um para aplicar, consultar a base teórica ou gerar o PDF.</p>

      <div className="relative mt-6 max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" aria-hidden />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nome, sigla ou categoria" aria-label="Buscar escala"
          className="w-full rounded-lg border border-line bg-white py-3 pl-10 pr-4 dark:border-slate-600 dark:bg-slate-800" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">{QUICK.map(([f, l]) => chip(f, l))}<span className="mx-1 w-px self-stretch bg-line dark:bg-slate-600" />{CATEGORY_ORDER.map((c) => chip(c, CATEGORY_LABEL[c]))}</div>

      {list.length === 0 && <p className="mt-10 text-slate-600 dark:text-slate-400">Nenhuma escala corresponde à busca. Tente a sigla (por exemplo, "PHQ") ou limpe os filtros.</p>}

      {CATEGORY_ORDER.map((cat) => {
        const group = list.filter((s) => s.category === cat);
        if (!group.length) return null;
        return (
          <section key={cat} className="mt-10">
            <h2 className="mb-3 border-b border-line pb-2 text-lg font-semibold dark:border-slate-700">{CATEGORY_LABEL[cat]}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {group.map((s) => (
                <li key={s.id}>
                  <button onClick={() => onOpen(s.id)} className="group flex h-full w-full flex-col rounded-lg border border-line bg-white p-4 text-left hover:border-petrol-500 dark:border-slate-700 dark:bg-slate-900/60 dark:hover:border-petrol-300">
                    <span className="flex items-center justify-between gap-2">
                      <span className="text-xl font-bold tracking-tight text-petrol-700 dark:text-petrol-100">{s.acronym}</span>
                      {(s.emergency || s.category === 'suicide_risk') && <ShieldAlert className="h-5 w-5 text-red-600" aria-label="Emergência e risco" />}
                    </span>
                    <span className="mt-0.5 text-sm font-medium">{s.name}</span>
                    <span className="mt-2 flex-1 text-sm leading-snug text-slate-600 dark:text-slate-400">{s.description}</span>
                    <span className="mt-3 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <span>{TYPE_LABEL[s.type]}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden />{s.estimatedMinutes} min</span>
                      <span>{s.items.filter((i) => i.scored !== false).length} itens</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
