import { useRef, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import type { PatientInfo, PsychiatricScale } from '../types/scale';
import type { Assessment } from '../hooks/useAssessment';
import { downloadPdf, printSheet } from '../lib/pdf';
import { PrintSheet, type SheetMode } from './PrintSheet';

interface Props { scale: PsychiatricScale; assessment: Assessment; mode: SheetMode; onMode: (m: SheetMode) => void }

const input = 'mt-1 w-full rounded-md border border-line bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800';

/** Aba de impressão: escolhe o modo, coleta identificação (só em memória) e mostra a folha A4. */
export function PrintView({ scale, assessment: a, mode, onMode }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [patient, setPatient] = useState<PatientInfo>({ name: '', identifier: '', professional: '', notes: '', date: new Date().toISOString().slice(0, 10) });
  const set = (k: keyof PatientInfo) => (e: { target: { value: string } }) => setPatient((p) => ({ ...p, [k]: e.target.value }));

  const save = async () => {
    if (!sheetRef.current) return;
    setBusy(true); setError('');
    try {
      await downloadPdf(sheetRef.current, `${scale.acronym}_${mode === 'report' ? 'relatorio' : 'em-branco'}_${patient.date}.pdf`);
    } catch {
      setError('Não foi possível gerar o arquivo. Use "Imprimir" e escolha "Salvar como PDF" na janela do navegador.');
    } finally { setBusy(false); }
  };

  return (
    <div className="print-container grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <div className="no-print space-y-5 lg:sticky lg:top-28 lg:self-start">
        <div role="radiogroup" aria-label="Tipo de documento" className="grid grid-cols-2 gap-1 rounded-lg bg-petrol-50 p-1 dark:bg-slate-800">
          {([['blank', 'Instrumento em branco'], ['report', 'Relatório preenchido']] as const).map(([m, label]) => (
            <button key={m} role="radio" aria-checked={mode === m} onClick={() => onMode(m)} className={`rounded-md px-2 py-2 text-sm font-medium ${mode === m ? 'bg-white shadow-sm dark:bg-slate-600' : 'text-slate-600 dark:text-slate-300'}`}>{label}</button>
          ))}
        </div>

        {mode === 'report' && (
          <div className="space-y-3">
            {!a.complete && <p className="rounded-md border border-amber-400 bg-amber-50 p-3 text-sm text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">Faltam {a.progress.total - a.progress.done} itens. O relatório sairá marcado como incompleto.</p>}
            <label className="block text-sm font-medium">Nome do paciente<input className={input} value={patient.name} onChange={set('name')} autoComplete="off" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-medium">Data<input type="date" className={input} value={patient.date} onChange={set('date')} /></label>
              <label className="block text-sm font-medium">Identificador<input className={input} value={patient.identifier} onChange={set('identifier')} placeholder="Opcional" autoComplete="off" /></label>
            </div>
            <label className="block text-sm font-medium">Profissional e registro<input className={input} value={patient.professional} onChange={set('professional')} placeholder="Nome, CRM ou CRP" /></label>
            <label className="block text-sm font-medium">Observações<textarea className={input} rows={3} value={patient.notes} onChange={set('notes')} /></label>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">Os dados do paciente ficam apenas na memória desta aba e somem ao fechar ou recarregar a página. Nada é enviado nem salvo.</p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button onClick={printSheet} className="inline-flex items-center justify-center gap-2 rounded-md bg-petrol-600 px-4 py-2.5 font-semibold text-white hover:bg-petrol-700"><Printer className="h-4 w-4" aria-hidden /> Imprimir ou salvar como PDF</button>
          <button onClick={save} disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-md border border-line px-4 py-2.5 font-medium hover:bg-petrol-50 disabled:opacity-50 dark:border-slate-600 dark:hover:bg-slate-800"><Download className="h-4 w-4" aria-hidden /> {busy ? 'Gerando arquivo…' : 'Baixar arquivo PDF'}</button>
          {error && <p role="alert" className="text-sm text-red-700 dark:text-red-400">{error}</p>}
          <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">"Imprimir" gera PDF com texto nítido e pesquisável. Na janela do navegador, desative cabeçalhos e rodapés.</p>
        </div>
      </div>

      <div className="print-container overflow-x-auto rounded-lg bg-slate-200 p-4 dark:bg-slate-800 sm:p-8">
        <PrintSheet ref={sheetRef} scale={scale} mode={mode} answers={a.answers} result={a.result} complete={a.complete} patient={patient} />
      </div>
    </div>
  );
}
