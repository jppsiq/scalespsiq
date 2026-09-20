import type { CutoffRange } from '../types/scale';
import { BADGE } from '../lib/ui';

interface Props { cutoffs: CutoffRange[]; min: number; max: number; value: number; dimmed?: boolean }

/**
 * Régua de gravidade: cada faixa ocupa largura proporcional ao seu intervalo e o marcador
 * mostra onde o escore caiu. Cores inline (hex) para sair igual na tela, na impressão e no PDF.
 */
export function SeverityRuler({ cutoffs, min, max, value, dimmed }: Props) {
  const span = max - min + 1;
  const pos = Math.min(100, Math.max(0, ((value - min + 0.5) / span) * 100));
  return (
    <div aria-hidden className="avoid-break">
      <div className="relative pt-4">
        <div className="absolute top-0 -translate-x-1/2 text-[10px] leading-none" style={{ left: `${pos}%`, opacity: dimmed ? 0.4 : 1 }}>▼</div>
        <div className="flex h-2.5 w-full overflow-hidden rounded-sm">
          {cutoffs.map((c) => (
            <div key={c.min} style={{ width: `${((c.max - c.min + 1) / span) * 100}%`, background: BADGE[c.badgeColor].hex }} className="border-r border-white/70 last:border-r-0" />
          ))}
        </div>
      </div>
      <div className="mt-1 flex w-full text-[10px] tabular-nums opacity-70">
        {cutoffs.map((c) => (
          <div key={c.min} style={{ width: `${((c.max - c.min + 1) / span) * 100}%` }}>{c.min}</div>
        ))}
        <div className="-ml-4 w-4 text-right">{max}</div>
      </div>
    </div>
  );
}
