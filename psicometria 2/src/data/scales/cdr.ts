/**
 * CDR: seis categorias pontuadas em 0, 0,5, 1, 2 e 3.
 * Devolve dois números: a soma das caixas (CDR-SB, usada como total) e o estágio global,
 * calculado pelas regras de Morris, em que a memória é a categoria primária.
 */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { classify, sumItems } from '../../lib/scoring';

const opt = (d: string[]) => [0, 0.5, 1, 2, 3].map((v, i) => ({ label: v === 0.5 ? '0,5' : String(v), value: v, description: d[i] }));

const raw: [string, string[]][] = [
  ['Memória', [
    'Sem perda de memória, ou esquecimento leve e inconstante.',
    'Esquecimento leve e consistente. Lembrança parcial de eventos. Esquecimento "benigno".',
    'Perda de memória moderada, mais acentuada para fatos recentes. O déficit interfere nas atividades do dia a dia.',
    'Perda de memória grave. Retém apenas material muito aprendido. O material novo se perde rapidamente.',
    'Perda de memória grave. Restam apenas fragmentos.',
  ]],
  ['Orientação', [
    'Plenamente orientado.',
    'Plenamente orientado, exceto por leve dificuldade com as relações temporais.',
    'Dificuldade moderada com as relações temporais. Orientado no espaço durante o exame, mas pode ter desorientação geográfica em outros lugares.',
    'Dificuldade grave com as relações temporais. Habitualmente desorientado no tempo e frequentemente no espaço.',
    'Orientado apenas quanto a pessoas.',
  ]],
  ['Julgamento e solução de problemas', [
    'Resolve bem problemas do dia a dia e questões de negócios e finanças. Julgamento bom em relação ao desempenho passado.',
    'Leve prejuízo na solução de problemas e no discernimento de semelhanças e diferenças.',
    'Dificuldade moderada na solução de problemas complexos. Julgamento social habitualmente preservado.',
    'Prejuízo grave na solução de problemas, na análise de semelhanças e diferenças. Julgamento social habitualmente prejudicado.',
    'Incapaz de fazer julgamentos ou de resolver problemas.',
  ]],
  ['Assuntos da comunidade', [
    'Desempenho independente e habitual no trabalho, nas compras e nos grupos sociais.',
    'Leve dificuldade nessas atividades.',
    'Incapaz de desempenhar-se de forma independente, embora ainda participe de algumas. Parece normal à inspeção casual.',
    'Sem possibilidade de desempenho fora de casa. Parece bem o suficiente para ser levado a atividades fora de casa.',
    'Sem possibilidade de desempenho fora de casa. Parece doente demais para ser levado a atividades fora de casa.',
  ]],
  ['Lar e passatempos', [
    'Vida em casa, passatempos e interesses intelectuais mantidos.',
    'Vida em casa, passatempos e interesses intelectuais levemente prejudicados.',
    'Prejuízo leve porém evidente em casa. Tarefas mais difíceis e passatempos mais complexos abandonados.',
    'Apenas tarefas simples preservadas. Interesses muito restritos e mal mantidos.',
    'Nenhuma atividade significativa em casa.',
  ]],
  ['Cuidados pessoais', [
    'Plenamente capaz de cuidar de si.',
    'Plenamente capaz de cuidar de si.',
    'Precisa ser estimulado.',
    'Necessita de ajuda para vestir-se, para a higiene e para cuidar dos próprios pertences.',
    'Necessita de muita ajuda para os cuidados pessoais. Incontinência frequente.',
  ]],
];
const items: ScaleItem[] = raw.map(([text, d], i) => ({ id: `cdr_${i + 1}`, number: i + 1, text, options: i === 5 ? opt(d).filter((o) => o.value !== 0.5) : opt(d) }));

// Faixas da soma das caixas (CDR-SB), conforme O'Bryant et al., 2008.
const cutoffs: CutoffRange[] = [
  { min: 0, max: 0, severity: 'Normal', clinicalImplication: 'Nenhum comprometimento nas seis categorias.', badgeColor: 'green' },
  { min: 0.5, max: 4, severity: 'Comprometimento questionável', clinicalImplication: 'Faixa compatível com comprometimento cognitivo leve. Investigar etiologia e repetir em 6 a 12 meses.', badgeColor: 'yellow' },
  { min: 4.5, max: 9, severity: 'Demência leve', clinicalImplication: 'Prejuízo funcional já evidente em atividades instrumentais.', badgeColor: 'orange' },
  { min: 9.5, max: 15.5, severity: 'Demência moderada', clinicalImplication: 'Necessidade de supervisão contínua. Planejar suporte ao cuidador.', badgeColor: 'red' },
  { min: 16, max: 18, severity: 'Demência grave', clinicalImplication: 'Dependência para cuidados pessoais. Priorizar conforto, prevenção de complicações e suporte ao cuidador.', badgeColor: 'red' },
];

const STAGE: Record<number, string> = { 0: 'CDR 0 (normal)', 0.5: 'CDR 0,5 (questionável)', 1: 'CDR 1 (demência leve)', 2: 'CDR 2 (demência moderada)', 3: 'CDR 3 (demência grave)' };

/** Regras de Morris: a memória é a categoria primária e as outras cinco são secundárias. */
function globalCDR(M: number, sec: number[]): number {
  const eq = sec.filter((s) => s === M).length;
  if (eq >= 3) return M;
  const above = sec.filter((s) => s > M), below = sec.filter((s) => s < M);
  if (M === 0) return below.length + above.length === 0 ? 0 : above.length >= 2 ? 0.5 : 0;
  if (M === 0.5) return sec.filter((s) => s >= 1).length >= 3 ? 1 : 0.5;
  // Três ou mais secundárias de um mesmo lado definem o estágio; empate de 3 contra 2 mantém a memória.
  if (above.length >= 3 && above.length > below.length) return [...above].sort((x, y) => x - y)[Math.floor(above.length / 2)];
  if (below.length >= 3 && below.length > above.length) return [...below].sort((x, y) => x - y)[Math.floor(below.length / 2)];
  return M;
}

export const cdr: PsychiatricScale = {
  id: 'cdr', name: 'Clinical Dementia Rating', acronym: 'CDR', category: 'cognition', type: 'clinician_administered',
  estimatedMinutes: 40, timeframe: 'Desempenho atual comparado ao habitual da pessoa',
  description: 'Estadiamento de demência em seis categorias, a partir de entrevista semiestruturada com o paciente e com um informante.',
  instructions: 'Entreviste separadamente o informante e o paciente. Pontue cada categoria pela perda em relação ao nível prévio da própria pessoa, não em relação a uma norma. O prejuízo deve decorrer de perda cognitiva, e não de limitação física, sensorial ou de humor.',
  scoreLabel: 'Soma das caixas (CDR-SB)', minScore: 0, maxScore: 18,
  licenseNote: 'Uso clínico e acadêmico sem fins lucrativos autorizado pela Washington University (knightadrc.wustl.edu), com treinamento recomendado. Âncoras em tradução de trabalho: para pesquisa, use a versão brasileira de Montaño e Ramos (2005) ou de Chaves et al. (2007).',
  validationInfo: { originalAuthors: 'Hughes CP, Berg L, Danziger WL, Coben LA, Martin RL; Morris JC (revisão de 1993)', year: 1982, brazilianValidation: 'Montaño MBMM, Ramos LR, 2005; Chaves MLF, Camozzato AL, Godinho C, et al., 2007.', psychometrics: 'Concordância entre avaliadores treinados alta (kappa ponderado em torno de 0,80 ou mais).' },
  about: {
    purposes: ['severity', 'monitoring', 'diagnostic_support'],
    objective: 'Estadiar a gravidade da demência de forma independente do desempenho em testes psicométricos. A soma das caixas é sensível à mudança e é desfecho frequente em ensaios clínicos.',
    targetPopulation: 'Pessoas com queixa cognitiva ou demência, com informante disponível. Entrevista por clínico treinado.',
    limitations: [
      'Exige informante confiável e conhecimento do funcionamento prévio. Sem informante, a validade cai muito.',
      'Escolaridade baixa, depressão, déficit sensorial e limitação motora confundem o julgamento funcional.',
      'Foi construída para a doença de Alzheimer. Estadia mal as demências frontotemporais e as de corpos de Lewy, em que comportamento e cognição dissociam-se da memória.',
      'O cálculo automático do estágio global segue as regras publicadas, mas situações incomuns de distribuição das caixas exigem julgamento clínico: confira o resultado.',
    ],
    references: [
      'Hughes CP, Berg L, Danziger WL, Coben LA, Martin RL. A new clinical scale for the staging of dementia. Br J Psychiatry. 1982;140:566-572.',
      'Morris JC. The Clinical Dementia Rating (CDR): current version and scoring rules. Neurology. 1993;43(11):2412-2414.',
      "O'Bryant SE, Waring SC, Cullum CM, et al. Staging dementia using Clinical Dementia Rating Scale Sum of Boxes scores. Arch Neurol. 2008;65(8):1091-1095.",
      'Montaño MBMM, Ramos LR. Validade da versão em português da Clinical Dementia Rating. Rev Saude Publica. 2005;39(6):912-917.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = sumItems(items, a);
    const cutoff = classify(total, cutoffs);
    const M = a.cdr_1, sec = [a.cdr_2, a.cdr_3, a.cdr_4, a.cdr_5, a.cdr_6];
    const complete = M !== undefined && sec.every((v) => v !== undefined);
    const g = complete ? globalCDR(M, sec as number[]) : undefined;
    return {
      total, cutoff, classification: cutoff?.severity ?? 'Sem classificação',
      notes: g !== undefined ? [`Estágio global: ${STAGE[g]}. A soma das caixas (${String(total).replace('.', ',')}) é mais sensível a mudanças ao longo do tempo que o estágio global.`] : undefined,
    };
  },
};
