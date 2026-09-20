import type { CutoffRange, PsychiatricScale, ScaleItem, ScaleOption } from '../../types/scale';
import { simpleSum, sumItems } from '../../lib/scoring';

const FREQ: ScaleOption[] = ['Nunca', 'Menos que mensalmente', 'Mensalmente', 'Semanalmente', 'Todos ou quase todos os dias'].map((label, value) => ({ label, value }));
const YES_3: ScaleOption[] = [{ label: 'Não', value: 0 }, { label: 'Sim, mas não nos últimos 12 meses', value: 2 }, { label: 'Sim, nos últimos 12 meses', value: 4 }];
const Y = 'Quantas vezes, ao longo dos últimos 12 meses, ';

const items: ScaleItem[] = [
  { text: 'Com que frequência você consome bebidas alcoólicas?', subscale: 'consumo', options: ['Nunca', 'Mensalmente ou menos', 'De 2 a 4 vezes por mês', 'De 2 a 3 vezes por semana', '4 ou mais vezes por semana'].map((label, value) => ({ label, value })) },
  { text: 'Quantas doses de álcool você consome tipicamente ao beber?', hint: 'Uma dose padrão tem cerca de 10 a 12 g de álcool: 1 lata de cerveja (350 mL), 1 taça de vinho (140 mL) ou 1 dose de destilado (40 mL).', subscale: 'consumo', options: ['1 ou 2', '3 ou 4', '5 ou 6', '7 a 9', '10 ou mais'].map((label, value) => ({ label, value })) },
  { text: 'Com que frequência você consome seis ou mais doses em uma única ocasião?', subscale: 'consumo', options: FREQ },
  { text: Y + 'você achou que não conseguiria parar de beber uma vez tendo começado?', subscale: 'dependencia', options: FREQ },
  { text: Y + 'você, por causa do álcool, não conseguiu fazer o que era esperado de você?', subscale: 'dependencia', options: FREQ },
  { text: Y + 'você precisou beber pela manhã para se sentir bem ao longo do dia, após ter bebido bastante no dia anterior?', subscale: 'dependencia', options: FREQ },
  { text: Y + 'você se sentiu culpado(a) ou com remorso depois de ter bebido?', subscale: 'consequencias', options: FREQ },
  { text: Y + 'você foi incapaz de lembrar o que aconteceu na noite anterior por causa da bebida?', subscale: 'consequencias', options: FREQ },
  { text: 'Você já causou ferimentos ou prejuízos a você mesmo(a) ou a outra pessoa após ter bebido?', subscale: 'consequencias', options: YES_3 },
  { text: 'Algum parente, amigo, médico ou outro profissional de saúde já se preocupou com o fato de você beber ou sugeriu que você parasse?', subscale: 'consequencias', options: YES_3 },
].map((it, i) => ({ id: `audit_${i + 1}`, number: i + 1, ...it }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 7, severity: 'Zona I: baixo risco', clinicalImplication: 'Educação sobre consumo de álcool.', badgeColor: 'green' },
  { min: 8, max: 15, severity: 'Zona II: uso de risco', clinicalImplication: 'Orientação básica e intervenção breve.', badgeColor: 'yellow' },
  { min: 16, max: 19, severity: 'Zona III: uso nocivo', clinicalImplication: 'Intervenção breve, aconselhamento e monitoramento continuado.', badgeColor: 'orange' },
  { min: 20, max: 40, severity: 'Zona IV: provável dependência', clinicalImplication: 'Encaminhar para avaliação diagnóstica e tratamento especializado. Avaliar risco de abstinência (CIWA-Ar).', badgeColor: 'red' },
];

export const audit: PsychiatricScale = {
  id: 'audit', name: 'Alcohol Use Disorders Identification Test', acronym: 'AUDIT', category: 'substances', type: 'self_administered',
  estimatedMinutes: 3, timeframe: 'Últimos 12 meses',
  description: 'Rastreio da OMS para uso de risco, uso nocivo e provável dependência de álcool.',
  instructions: 'As perguntas a seguir são sobre o seu consumo de bebidas alcoólicas no último ano. Marque a resposta que mais se aproxima da sua situação.',
  minScore: 0, maxScore: 40,
  subscales: [
    { key: 'consumo', label: 'Consumo (itens 1 a 3, equivale ao AUDIT-C)', max: 12 },
    { key: 'dependencia', label: 'Sintomas de dependência (itens 4 a 6)', max: 12 },
    { key: 'consequencias', label: 'Consequências do uso (itens 7 a 10)', max: 16 },
  ],
  validationInfo: {
    originalAuthors: 'Saunders JB, Aasland OG, Babor TF, de la Fuente JR, Grant M (OMS)', year: 1993,
    brazilianValidation: 'Méndez EB, 1999; Lima CT, Freire ACC, Silva APB, et al., 2005.',
    psychometrics: 'Consistência interna mediana em torno de 0,80 entre estudos.',
  },
  about: {
    purposes: ['screening', 'severity'],
    objective: 'Detectar padrões de consumo de álcool de risco e orientar o nível de intervenção (modelo de triagem e intervenção breve).',
    targetPopulation: 'Adultos em qualquer nível de atenção. Autoaplicável ou por entrevista.',
    accuracy: [
      { cutoff: '≥ 8', sensitivity: '92%', specificity: '94%', source: 'Saunders et al., 1993 (uso de risco ou nocivo)' },
      { cutoff: 'AUDIT-C ≥ 4 (homens) ou ≥ 3 (mulheres)', sensitivity: '86%', specificity: '72%', source: 'Bush et al., 1998 (homens)' },
    ],
    limitations: [
      'Sub-relato é comum em contextos com consequência legal, ocupacional ou de guarda de filhos.',
      'Pontos de corte menores (6 ou 7) são propostos para mulheres e idosos.',
      'Exige que o paciente entenda o conceito de dose padrão: mostre exemplos.',
      'Não diagnostica transtorno por uso de álcool nem mede gravidade de abstinência.',
    ],
    references: [
      'Saunders JB, Aasland OG, Babor TF, de la Fuente JR, Grant M. Development of the Alcohol Use Disorders Identification Test (AUDIT). Addiction. 1993;88(6):791-804.',
      'Babor TF, Higgins-Biddle JC, Saunders JB, Monteiro MG. AUDIT: The Alcohol Use Disorders Identification Test. Guidelines for use in primary care. 2nd ed. Geneva: WHO; 2001.',
      'Lima CT, Freire ACC, Silva APB, Teixeira RM, Farrell M, Prince M. Concurrent and construct validity of the AUDIT in an urban Brazilian sample. Alcohol Alcohol. 2005;40(6):584-589.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    const c = sumItems(items, a, (it) => it.subscale === 'consumo');
    return { ...r, notes: [`AUDIT-C (itens 1 a 3): ${c}/12.`] };
  },
};
