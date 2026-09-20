import type { ScaleItem } from '../types/scale';
import { Stimulus } from './Stimulus';

interface Props { item: ScaleItem; value: number | undefined; missing: boolean; onChange: (v: number) => void }

/** Um item da escala. Usa <input type="radio"> nativo (teclado e leitor de tela) com rótulo estilizado. */
export function ItemCard({ item, value, missing, onChange }: Props) {
  // Opções com âncora descritiva (HAM-D, YMRS, MADRS...) são empilhadas: o texto da âncora é o conteúdo principal.
  const anchored = item.options.some((o) => o.description);
  const compact = !anchored && item.options.every((o) => o.label.length <= 3);
  return (
    <fieldset
      id={`item-${item.id}`}
      className={`scroll-mt-40 rounded-lg border bg-white p-4 dark:bg-slate-900/60 ${
        missing ? 'border-amber-500 ring-1 ring-amber-500' : item.isRedFlagTrigger ? 'border-red-300 dark:border-red-900' : 'border-line dark:border-slate-700'
      }`}
    >
      <legend className="sr-only">Item {item.number}</legend>
      <div className="flex gap-3">
        {item.number > 0 && <span className="w-6 shrink-0 text-right font-semibold tabular-nums text-petrol-600 dark:text-petrol-300">{item.number}</span>}
        <div className="min-w-0 flex-1">
          <p className="max-w-prose font-medium leading-snug">{item.text}</p>
          {item.hint && <p className="mt-1 max-w-prose text-sm text-slate-600 dark:text-slate-400">{item.hint}</p>}
          {item.stimulus && <div className="mt-3"><Stimulus stimulus={item.stimulus} /></div>}
          {missing && <p className="mt-1 text-sm font-medium text-amber-700 dark:text-amber-400">Item sem resposta.</p>}

          <div className={`mt-3 flex gap-2 ${anchored ? 'flex-col' : 'flex-wrap'}`}>
            {item.options.map((o) => {
              const checked = value === o.value;
              return (
                <label
                  key={o.value}
                  className={`flex cursor-pointer gap-2 rounded-md ${anchored ? 'items-start' : 'items-center'} border px-3 py-2 text-sm transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-petrol-500 ${
                    checked
                      ? 'border-petrol-600 bg-petrol-600 text-white dark:border-petrol-300 dark:bg-petrol-500'
                      : 'border-line bg-paper hover:border-petrol-500 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-petrol-300'
                  }`}
                >
                  <input type="radio" className="sr-only" name={item.id} value={o.value} checked={checked} onChange={() => onChange(o.value)} />
                  {!compact && !anchored && <span className={`tabular-nums text-xs ${checked ? 'opacity-80' : 'text-slate-500 dark:text-slate-400'}`}>{o.value}</span>}
                  {anchored ? <span className="leading-snug"><strong className="mr-2 font-semibold tabular-nums">{o.value}</strong>{o.description ?? <em className="opacity-70">Grau intermediário</em>}</span> : <span>{o.label}</span>}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </fieldset>
  );
}
