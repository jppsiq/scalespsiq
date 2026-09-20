import { forwardRef } from 'react';
import type { Answers, PatientInfo, PsychiatricScale, ScoreResult } from '../types/scale';
import { BADGE, TYPE_LABEL } from '../lib/ui';
import { SeverityRuler } from './SeverityRuler';
import { Stimulus } from './Stimulus';

export type SheetMode = 'blank' | 'report';

interface Props { scale: PsychiatricScale; mode: SheetMode; answers: Answers; result: ScoreResult; complete: boolean; patient: PatientInfo }

const Line = ({ label, value, grow = 1 }: { label: string; value?: string; grow?: number }) => (
  <div style={{ flex: grow }} className="flex min-w-0 items-end gap-1.5">
    <span className="shrink-0 text-[9pt] text-gray-600">{label}</span>
    <span className="min-h-[5mm] flex-1 truncate border-b border-gray-500 font-medium">{value}</span>
  </div>
);

/** Itens binários curtos (Sim/Não, Correto/Incorreto) saem em uma linha só: texto à esquerda, marcações à direita. */
const rowLayout = (item: { options: { label: string }[]; stimulus?: unknown; responseSpaceMm?: number }, report: boolean) =>
  item.options.length <= 2 && item.options.every((o) => o.label.length <= 12) && (report || (!item.stimulus && !item.responseSpaceMm));

const fmtDate = (iso: string) => (iso ? iso.split('-').reverse().join('/') : '');

/**
 * Folha A4. Serve aos dois modos:
 *  - blank: instrumento em branco. Mostra TODOS os itens (inclusive os condicionais) e nenhuma interpretação.
 *  - report: relatório com respostas assinaladas, escores, faixa, interpretação e assinatura.
 * Cores fixas e claras: é papel, não segue o tema da interface.
 */
export const PrintSheet = forwardRef<HTMLDivElement, Props>(function PrintSheet({ scale, mode, answers, result, complete, patient }, ref) {
  const report = mode === 'report';
  const items = report ? scale.items.filter((it) => (it.showIf ? it.showIf(answers) : true)) : scale.items;
  let lastSection: string | undefined;

  // Instrumento com formulário original (ex.: MoCA): a folha em branco é o próprio formulário, em página inteira.
  if (!report && scale.formImage) {
    return (
      <div ref={ref} className="sheet sheet-form">
        <img src={scale.formImage} alt={`Formulário de aplicação: ${scale.name}`} className="block h-auto w-full" />
      </div>
    );
  }

  return (
    <div ref={ref} className="sheet">
      <header className="avoid-break">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1>{scale.acronym}</h1>
            <p className="text-[10pt] text-gray-700">{scale.name}</p>
          </div>
          <p className="shrink-0 text-right text-[8.5pt] text-gray-600">
            {report ? 'Relatório clínico' : 'Folha de aplicação'}<br />{TYPE_LABEL[scale.type]}{scale.timeframe ? ` | ${scale.timeframe}` : ''}
          </p>
        </div>
        <div className="mt-4 flex gap-4"><Line label="Nome" value={report ? patient.name : ''} grow={3} /><Line label="Data" value={report ? fmtDate(patient.date) : ''} /></div>
        <div className="mt-2 flex gap-4"><Line label="Identificador / prontuário" value={report ? patient.identifier : ''} grow={2} /><Line label="Aplicador" value={report ? patient.professional : ''} grow={2} /></div>
      </header>

      {/* No relatório o resultado vem primeiro: é o que o leitor procura. */}
      {report && (
        <section className="avoid-break">
          <h2>Resultado</h2>
          {!complete && <p className="mb-2 border border-gray-800 p-2 text-[9.5pt] font-semibold">Avaliação incompleta: o escore abaixo é parcial e não deve ser interpretado.</p>}
          <div className="flex items-start gap-6">
            <div className="shrink-0">
              <p className="text-[8.5pt] text-gray-600">{scale.scoreLabel ?? 'Escore total'}</p>
              <p className="text-[22pt] font-bold leading-none tabular-nums">{result.total}<span className="text-[10pt] font-medium text-gray-600"> / {scale.maxScore}</span></p>
            </div>
            <div className="min-w-0 flex-1">
              <SeverityRuler cutoffs={scale.cutoffs} min={scale.minScore} max={scale.maxScore} value={result.total} />
              {complete && result.cutoff && (
                <p className="mt-1.5">
                  <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: BADGE[result.cutoff.badgeColor].hex }} />
                  <strong>{result.classification}</strong>
                </p>
              )}
            </div>
          </div>
          {complete && result.cutoff?.clinicalImplication && <p className="mt-2"><strong>Interpretação: </strong>{result.cutoff.clinicalImplication}</p>}
          {complete && result.notes?.map((n) => <p key={n} className="mt-1">{n}</p>)}
          {result.subscores && scale.subscales && (
            <table className="mt-3 w-full text-[9.5pt]">
              <tbody>
                {scale.subscales.map((s) => (
                  <tr key={s.key} className="border-b border-gray-300"><td className="py-1">{s.label}</td><td className="py-1 text-right font-semibold tabular-nums">{result.subscores?.[s.key] ?? 0}{s.max ? ` / ${s.max}` : ''}</td></tr>
                ))}
              </tbody>
            </table>
          )}
          {result.clinicalAlert && (
            <p className="mt-3 border-2 border-red-700 p-2.5 text-[9.5pt]"><strong className="text-red-700">Alerta clínico. </strong>{result.clinicalAlert}</p>
          )}
        </section>
      )}

      <section>
        <h2>{report ? 'Respostas' : 'Instrumento'}</h2>
        <p className="mb-3 text-[9.5pt] text-gray-700">{scale.instructions}</p>
        {items.map((item) => {
          const header = item.section && item.section !== lastSection ? item.section : null;
          lastSection = item.section;
          return (
            <div key={item.id}>
              {header && <h3 className="mb-1 mt-3 text-[10pt] font-bold">{header}</h3>}
              <div className={`avoid-break border-b border-gray-300 ${rowLayout(item, report) ? 'flex items-start justify-between gap-4 py-1' : 'py-2'}`}>
                <div className="min-w-0"><p className="font-medium">{item.number > 0 && <span className="mr-1.5 tabular-nums">{item.number}.</span>}{item.text}</p>
                {item.hint && scale.type === 'clinician_administered' && <p className="text-[8.5pt] text-gray-600">{item.hint}</p>}
                </div>
                {!report && item.stimulus && <Stimulus stimulus={item.stimulus} print />}
                {!report && item.responseSpaceMm && <div className="my-1 border border-gray-400" style={{ height: `${item.responseSpaceMm}mm` }} />}
                <div className={`flex gap-x-4 gap-y-1 text-[9.5pt] ${rowLayout(item, report) ? 'shrink-0' : 'mt-1.5'} ${item.options.some((o) => o.description) ? 'flex-col' : 'flex-wrap'}`}>
                  {item.options.filter((o) => !(report && item.options.some((x) => x.description)) || answers[item.id] === o.value).map((o) => (
                    <span key={o.value} className={item.options.some((x) => x.description) ? '' : 'whitespace-nowrap'}>
                      <span className={`mark ${report && answers[item.id] === o.value ? 'on' : ''}`} />
                      {item.options.some((x) => x.description) ? <><strong>{o.value}</strong> {o.description ?? 'Grau intermediário.'}</> : o.label}{!item.options.some((x) => x.description) && o.label !== String(o.value) && <span className="text-gray-500"> ({o.value})</span>}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {!report && (
        <section className="avoid-break">
          <h2>Para uso do profissional</h2>
          <div className="flex gap-4"><Line label={scale.scoreLabel ?? 'Escore total'} grow={1} /><Line label="Classificação" grow={3} /></div>
        </section>
      )}

      {report && (
        <section className="avoid-break">
          <h2>Observações do profissional</h2>
          <p className="min-h-[18mm] whitespace-pre-wrap">{patient.notes}</p>
          <div className="mt-10 flex justify-end">
            <div className="w-[75mm] border-t border-gray-800 pt-1 text-center text-[9pt]">
              {patient.professional || 'Profissional responsável'}<br /><span className="text-gray-600">Assinatura e carimbo</span>
            </div>
          </div>
        </section>
      )}

      <footer className="mt-6 border-t border-gray-300 pt-2 text-[7.5pt] leading-snug text-gray-600">
        {scale.validationInfo.originalAuthors}, {scale.validationInfo.year}.
        {report && ' Instrumento de apoio: o resultado não estabelece diagnóstico e deve ser interpretado no contexto da avaliação clínica.'}
      </footer>
    </div>
  );
});
