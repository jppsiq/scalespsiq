/** PCL-5: soma com quatro clusters do DSM-5 e regra de diagnóstico provisório por cluster. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { graded } from '../../lib/options';
import { countAtOrAbove, simpleSum } from '../../lib/scoring';

const OPT = graded(['De modo nenhum', 'Um pouco', 'Moderadamente', 'Muito', 'Extremamente']);
const cluster = (n: number) => (n <= 5 ? 'B' : n <= 7 ? 'C' : n <= 14 ? 'D' : 'E');

const items: ScaleItem[] = [
  'Lembranças repetitivas, perturbadoras e indesejadas da experiência estressante?',
  'Sonhos repetitivos e perturbadores com a experiência estressante?',
  'De repente, sentir ou agir como se a experiência estressante estivesse acontecendo de novo (como se você a estivesse revivendo)?',
  'Sentir-se muito chateado(a) quando algo faz você lembrar da experiência estressante?',
  'Ter reações físicas intensas quando algo faz você lembrar da experiência (por exemplo, coração acelerado, dificuldade para respirar, suor)?',
  'Evitar lembranças, pensamentos ou sentimentos relacionados à experiência estressante?',
  'Evitar lembretes externos da experiência (por exemplo, pessoas, lugares, conversas, atividades, objetos ou situações)?',
  'Dificuldade para lembrar de partes importantes da experiência estressante?',
  'Ter crenças negativas intensas sobre você, outras pessoas ou o mundo (por exemplo: "sou ruim", "há algo muito errado comigo", "não se pode confiar em ninguém", "o mundo é totalmente perigoso")?',
  'Culpar a si mesmo(a) ou a outra pessoa pela experiência estressante ou pelo que aconteceu depois dela?',
  'Ter sentimentos negativos intensos, como medo, horror, raiva, culpa ou vergonha?',
  'Perder o interesse em atividades de que você gostava?',
  'Sentir-se distante ou isolado(a) das outras pessoas?',
  'Dificuldade para vivenciar sentimentos positivos (por exemplo, ser incapaz de sentir felicidade ou amor pelas pessoas próximas)?',
  'Comportamento irritado, explosões de raiva ou agir agressivamente?',
  'Correr riscos demais ou fazer coisas que podem lhe causar dano?',
  'Estar "superalerta", vigilante ou de sobreaviso?',
  'Sentir-se sobressaltado(a) ou assustar-se facilmente?',
  'Ter dificuldade de concentração?',
  'Dificuldade para pegar no sono ou para continuar dormindo?',
].map((text, i) => ({ id: `pcl_${i + 1}`, number: i + 1, text, options: OPT, subscale: cluster(i + 1) }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 30, severity: 'Abaixo do ponto de corte', clinicalImplication: 'TEPT provável menos plausível. Considere sintomas subsindrômicos se houver prejuízo.', badgeColor: 'green' },
  { min: 31, max: 80, severity: 'TEPT provável', clinicalImplication: 'Escore na faixa de corte sugerida (31 a 33). Confirmar com entrevista estruturada (ex.: CAPS-5) e avaliar o critério A.', badgeColor: 'red' },
];

export const pcl5: PsychiatricScale = {
  id: 'pcl5', name: 'PTSD Checklist for DSM-5', acronym: 'PCL-5', category: 'anxiety', type: 'self_administered',
  estimatedMinutes: 8, timeframe: 'Último mês',
  description: 'Vinte itens que espelham os critérios B a E do TEPT no DSM-5.',
  instructions: 'Abaixo há uma lista de problemas que as pessoas às vezes têm em resposta a uma experiência muito estressante. Tendo em mente a sua pior experiência, indique o quanto cada problema incomodou você no último mês.',
  minScore: 0, maxScore: 80,
  subscales: [
    { key: 'B', label: 'Cluster B: intrusão (1 a 5)', max: 20 },
    { key: 'C', label: 'Cluster C: evitação (6 e 7)', max: 8 },
    { key: 'D', label: 'Cluster D: cognição e humor (8 a 14)', max: 28 },
    { key: 'E', label: 'Cluster E: excitação e reatividade (15 a 20)', max: 24 },
  ],
  validationInfo: {
    originalAuthors: 'Weathers FW, Litz BT, Keane TM, Palmieri PA, Marx BP, Schnurr PP (National Center for PTSD)', year: 2013,
    brazilianValidation: 'Lima EP, Vasconcelos AG, Berger W, et al., 2016 (adaptação transcultural); Osório FL et al., 2017.',
    psychometrics: 'Alfa de Cronbach 0,94 e teste-reteste 0,82 (Blevins et al., 2015).',
  },
  about: {
    purposes: ['screening', 'severity', 'monitoring', 'diagnostic_support'],
    objective: 'Rastrear TEPT, apoiar diagnóstico provisório e monitorar mudança sintomática. Redução de 10 a 20 pontos é usada como mudança clinicamente significativa.',
    targetPopulation: 'Adultos expostos a evento traumático (critério A). Autoaplicável.',
    accuracy: [{ cutoff: '31 a 33', sensitivity: '≈ 88%', specificity: '≈ 69%', source: 'Bovin et al., 2016 (veteranos, corte 33)' }],
    limitations: [
      'Não avalia o critério A: sem evento traumático qualificado o escore não tem validade para TEPT.',
      'O ponto de corte varia com a população e a finalidade. Em amostras brasileiras foram propostos valores próximos ou um pouco superiores.',
      'Sobreposição importante com depressão (cluster D) e com transtornos de ansiedade (cluster E).',
      'Itens em tradução de trabalho: confira com a versão brasileira publicada antes do uso formal.',
    ],
    references: [
      'Weathers FW, Litz BT, Keane TM, Palmieri PA, Marx BP, Schnurr PP. The PTSD Checklist for DSM-5 (PCL-5). National Center for PTSD; 2013.',
      'Blevins CA, Weathers FW, Davis MT, Witte TK, Domino JL. The Posttraumatic Stress Disorder Checklist for DSM-5 (PCL-5): development and initial psychometric evaluation. J Trauma Stress. 2015;28(6):489-498.',
      'Bovin MJ, Marx BP, Weathers FW, et al. Psychometric properties of the PTSD Checklist for DSM-5 in veterans. Psychol Assess. 2016;28(11):1379-1391.',
      'Lima EP, Vasconcelos AG, Berger W, et al. Cross-cultural adaptation of the Posttraumatic Stress Disorder Checklist 5 (PCL-5) and Life Events Checklist 5 (LEC-5) for the Brazilian context. Trends Psychiatry Psychother. 2016;38(4):207-215.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    // Diagnóstico provisório DSM-5: item "presente" = 2 (Moderadamente) ou mais.
    const n = (k: string) => countAtOrAbove(items.filter((it) => it.subscale === k), a, () => 2);
    const prov = n('B') >= 1 && n('C') >= 1 && n('D') >= 2 && n('E') >= 2;
    return { ...r, notes: [`Diagnóstico provisório pelo padrão de clusters (1 B, 1 C, 2 D e 2 E com resposta ≥ 2): ${prov ? 'critérios atendidos' : 'critérios não atendidos'}.`] };
  },
};
