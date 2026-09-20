import type { ReactNode } from 'react';
import type { PsychiatricScale } from '../types/scale';
import { BADGE, PURPOSE_LABEL, TYPE_LABEL } from '../lib/ui';

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="border-t border-line py-6 first:border-t-0 first:pt-0 dark:border-slate-700">
    <h2 className="mb-3 text-lg font-semibold">{title}</h2>
    {children}
  </section>
);

const th = 'border-b border-line px-3 py-2 text-left font-semibold dark:border-slate-700';
const td = 'border-b border-line px-3 py-2 align-top dark:border-slate-700';

/** Aba "Sobre o instrumento": ficha técnica, objetivo, aplicação, interpretação, limitações e referências. */
export function AboutPanel({ scale: s }: { scale: PsychiatricScale }) {
  const v = s.validationInfo;
  return (
    <div className="max-w-4xl">
      <Section title="Ficha técnica">
        <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
          {[
            ['Autores originais', v.originalAuthors],
            ['Ano de publicação', String(v.year)],
            ['Versão em português', v.brazilianValidation ?? 'Não disponível'],
            ['Tempo estimado', `${s.estimatedMinutes} minutos`],
            ['Janela avaliada', s.timeframe ?? 'Não se aplica'],
            ['Propriedades psicométricas', v.psychometrics],
          ].map(([k, val]) => (
            <div key={k}><dt className="text-slate-600 dark:text-slate-400">{k}</dt><dd className="mt-0.5 font-medium">{val}</dd></div>
          ))}
        </dl>
        {s.licenseNote && <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">{s.licenseNote}</p>}
      </Section>

      <Section title="Objetivo clínico">
        <div className="mb-2 flex flex-wrap gap-2">
          {s.about.purposes.map((p) => <span key={p} className="rounded bg-petrol-100 px-2 py-0.5 text-sm font-medium text-petrol-700 dark:bg-slate-700 dark:text-petrol-100">{PURPOSE_LABEL[p]}</span>)}
        </div>
        <p className="max-w-prose leading-relaxed">{s.about.objective}</p>
      </Section>

      <Section title="Público-alvo e forma de aplicação">
        <p className="max-w-prose leading-relaxed"><strong className="font-semibold">{TYPE_LABEL[s.type]}. </strong>{s.about.targetPopulation}</p>
      </Section>

      <Section title="Interpretação e pontos de corte">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[32rem] text-sm">
            <thead><tr><th className={th}>Escore</th><th className={th}>Faixa</th><th className={th}>Significado clínico</th></tr></thead>
            <tbody>
              {s.cutoffs.map((c) => (
                <tr key={c.min}>
                  <td className={`${td} whitespace-nowrap tabular-nums`}>{c.min === c.max ? c.min : `${c.min} a ${c.max}`}</td>
                  <td className={td}><span className={`inline-block rounded px-2 py-0.5 font-medium ${BADGE[c.badgeColor].chip}`}>{c.severity}</span></td>
                  <td className={td}>{c.clinicalImplication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {s.about.accuracy && (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[32rem] text-sm">
              <caption className="mb-2 text-left font-semibold">Acurácia diagnóstica</caption>
              <thead><tr><th className={th}>Ponto de corte</th><th className={th}>Sensibilidade</th><th className={th}>Especificidade</th><th className={th}>Fonte</th></tr></thead>
              <tbody>{s.about.accuracy.map((r) => <tr key={r.cutoff}><td className={td}>{r.cutoff}</td><td className={td}>{r.sensitivity}</td><td className={td}>{r.specificity}</td><td className={td}>{r.source}</td></tr>)}</tbody>
            </table>
          </div>
        )}
      </Section>

      <Section title="Limitações e cuidados">
        <ul className="max-w-prose list-disc space-y-2 pl-5 leading-relaxed">
          {s.about.limitations.map((l) => <li key={l}>{l}</li>)}
          <li>Nenhum instrumento substitui a entrevista clínica. Escolaridade, cultura, idioma e o contexto da aplicação influenciam as respostas.</li>
        </ul>
      </Section>

      <Section title="Referências">
        <ol className="max-w-prose list-decimal space-y-2 pl-5 text-sm leading-relaxed">{s.about.references.map((r) => <li key={r}>{r}</li>)}</ol>
      </Section>
    </div>
  );
}
