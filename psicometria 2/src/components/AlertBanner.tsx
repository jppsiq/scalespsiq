import { useState } from 'react';
import { ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';

/**
 * Banner vermelho de alerta clínico (hard stop).
 * role="alert" faz leitores de tela anunciarem na hora. O banner pode ser recolhido para
 * liberar a tela (importante no celular), mas nunca dispensado enquanto o gatilho estiver ativo.
 */
export function AlertBanner({ message }: { message: string }) {
  const [open, setOpen] = useState(true);
  return (
    <div role="alert" className="no-print rounded-lg border-2 border-red-700 bg-red-600 text-white shadow-lg">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <ShieldAlert className="h-6 w-6 shrink-0" aria-hidden />
        <span className="flex-1 font-bold">Alerta clínico: avaliação de risco necessária</span>
        <span className="inline-flex items-center gap-1 text-sm font-medium underline-offset-2 hover:underline">
          {open ? <>Recolher <ChevronUp className="h-4 w-4" aria-hidden /></> : <>Ver orientações <ChevronDown className="h-4 w-4" aria-hidden /></>}
        </span>
      </button>
      {open && <p className="px-4 pb-4 pl-[3.25rem] text-sm leading-relaxed">{message}</p>}
    </div>
  );
}
