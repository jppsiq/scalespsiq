/**
 * ASRS-v1.1: exemplo de regra que NÃO é soma simples.
 *
 * Parte A (itens 1 a 6) é o rastreador validado. Cada item é "positivo" quando a
 * resposta cai na área sombreada do formulário original:
 *   itens 1 a 3: a partir de "Algumas vezes" (valor ≥ 2)
 *   itens 4 a 6: a partir de "Frequentemente" (valor ≥ 3)
 * Quatro ou mais itens positivos = rastreio positivo.
 *
 * Parte B (itens 7 a 18) aprofunda a investigação e não tem ponto de corte.
 * Os limiares sombreados da Parte B seguem o formulário da OMS (9, 12, 16 e 18
 * a partir de "Algumas vezes"; demais a partir de "Frequentemente").
 */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { countAtOrAbove, sumItems } from '../../lib/scoring';

const OPTIONS = [
  { label: 'Nunca', value: 0 },
  { label: 'Raramente', value: 1 },
  { label: 'Algumas vezes', value: 2 },
  { label: 'Frequentemente', value: 3 },
  { label: 'Muito frequentemente', value: 4 },
];

// [texto, domínio] na ordem oficial da v1.1
const raw: [string, 'desatencao' | 'hiperatividade'][] = [
  ['Com que frequência você tem dificuldade para finalizar os detalhes de um projeto, depois que as partes mais desafiadoras já foram feitas?', 'desatencao'],
  ['Com que frequência você tem dificuldade para colocar as coisas em ordem quando precisa fazer uma tarefa que exige organização?', 'desatencao'],
  ['Com que frequência você tem dificuldade para lembrar de compromissos ou obrigações?', 'desatencao'],
  ['Quando você tem uma tarefa que exige muita concentração, com que frequência você evita ou adia o início?', 'desatencao'],
  ['Com que frequência você fica se mexendo na cadeira ou balançando as mãos ou os pés quando precisa ficar sentado(a) por muito tempo?', 'hiperatividade'],
  ['Com que frequência você se sente ativo(a) demais e necessitando fazer coisas, como se estivesse "com um motor ligado"?', 'hiperatividade'],
  ['Com que frequência você comete erros por falta de atenção quando tem de trabalhar num projeto chato ou difícil?', 'desatencao'],
  ['Com que frequência você tem dificuldade para manter a atenção quando está fazendo um trabalho chato ou repetitivo?', 'desatencao'],
  ['Com que frequência você tem dificuldade para se concentrar no que as pessoas dizem, mesmo quando elas estão falando diretamente com você?', 'desatencao'],
  ['Com que frequência você coloca as coisas fora do lugar ou tem dificuldade de encontrar as coisas em casa ou no trabalho?', 'desatencao'],
  ['Com que frequência você se distrai com atividades ou barulho à sua volta?', 'desatencao'],
  ['Com que frequência você se levanta da cadeira em reuniões ou em outras situações em que deveria ficar sentado(a)?', 'hiperatividade'],
  ['Com que frequência você se sente inquieto(a) ou agitado(a)?', 'hiperatividade'],
  ['Com que frequência você tem dificuldade para sossegar e relaxar quando tem tempo livre para você?', 'hiperatividade'],
  ['Com que frequência você se pega falando demais em situações sociais?', 'hiperatividade'],
  ['Quando você está conversando, com que frequência você se pega terminando as frases das pessoas antes delas?', 'hiperatividade'],
  ['Com que frequência você tem dificuldade para esperar nas situações em que cada um tem a sua vez?', 'hiperatividade'],
  ['Com que frequência você interrompe os outros quando eles estão ocupados?', 'hiperatividade'],
];

const items: ScaleItem[] = raw.map(([text, subscale], i) => ({
  id: `asrs_${i + 1}`,
  number: i + 1,
  text,
  subscale,
  section: i < 6 ? 'Parte A: rastreador (itens 1 a 6)' : 'Parte B: investigação complementar (itens 7 a 18)',
  options: OPTIONS,
}));

const partA = items.slice(0, 6);
const partB = items.slice(6);

/** Limiar da área sombreada de cada item. */
export function asrsThreshold(item: ScaleItem): number {
  const n = item.number;
  if (n <= 3) return 2;
  if (n <= 6) return 3;
  return [9, 12, 16, 18].includes(n) ? 2 : 3;
}

// Para o ASRS as "faixas" classificam o NÚMERO DE ITENS POSITIVOS DA PARTE A (0 a 6), não a soma.
const cutoffs: CutoffRange[] = [
  { min: 0, max: 3, severity: 'Rastreio negativo', clinicalImplication: 'Menos de 4 itens positivos na Parte A. TDAH pouco provável, mas o rastreio não exclui o diagnóstico se a suspeita clínica for alta.', badgeColor: 'green' },
  { min: 4, max: 6, severity: 'Rastreio positivo', clinicalImplication: 'Quatro ou mais itens positivos na Parte A. Sintomas altamente consistentes com TDAH em adultos: prosseguir com avaliação diagnóstica completa.', badgeColor: 'orange' },
];

export const asrs: PsychiatricScale = {
  id: 'asrs',
  name: 'Adult ADHD Self-Report Scale v1.1',
  acronym: 'ASRS-v1.1',
  category: 'adhd',
  type: 'self_administered',
  estimatedMinutes: 5,
  timeframe: 'Últimos 6 meses',
  description: 'Lista de 18 sintomas de TDAH do adulto. Os seis primeiros itens formam o rastreador validado da OMS.',
  instructions: 'Responda às perguntas abaixo avaliando como você se sentiu e se comportou nos últimos 6 meses. Marque a opção que melhor descreve a frequência de cada situação.',
  scoreLabel: 'Itens positivos na Parte A',
  minScore: 0,
  maxScore: 6,
  subscales: [
    { key: 'parteA', label: 'Itens positivos na Parte A', max: 6 },
    { key: 'parteB', label: 'Itens positivos na Parte B', max: 12 },
    { key: 'desatencao', label: 'Soma de desatenção', max: 36 },
    { key: 'hiperatividade', label: 'Soma de hiperatividade e impulsividade', max: 36 },
    { key: 'somaTotal', label: 'Soma dos 18 itens', max: 72 },
  ],
  validationInfo: {
    originalAuthors: 'Kessler RC, Adler L, Ames M, et al. (Organização Mundial da Saúde)',
    year: 2005,
    brazilianValidation: 'Mattos P, Segenreich D, Saboya E, et al., 2006 (adaptação transcultural para o português).',
    psychometrics: 'O rastreador de 6 itens superou a versão de 18 itens em acurácia total no estudo original (97,9% de classificação correta).',
  },
  about: {
    purposes: ['screening'],
    objective: 'Identificar adultos que precisam de avaliação diagnóstica para TDAH. A Parte B e as somas por domínio ajudam a explorar o perfil sintomático, mas não têm ponto de corte validado.',
    targetPopulation: 'Adultos (18 anos ou mais). Autoaplicável. Útil em atenção primária e ambulatório de psiquiatria.',
    accuracy: [
      { cutoff: '≥ 4 itens positivos na Parte A', sensitivity: '68,7%', specificity: '99,5%', source: 'Kessler et al., 2005' },
    ],
    limitations: [
      'Rastreio positivo não é diagnóstico. O DSM-5-TR exige início antes dos 12 anos, prejuízo em dois ou mais contextos e exclusão de outras causas, nenhum deles avaliado aqui.',
      'Sintomas de desatenção e inquietação são inespecíficos: ansiedade, depressão, transtorno bipolar, privação de sono, uso de substâncias e transtornos de personalidade elevam o escore.',
      'Autorrelato é vulnerável a exagero quando há busca por estimulantes ou por adaptações acadêmicas. Informante colateral e documentos escolares aumentam a validade.',
      'Sensibilidade moderada: adultos com boa compensação ou baixo insight podem ter rastreio negativo.',
      'A redação dos itens deste aplicativo é uma tradução de trabalho. Confira com a versão de Mattos et al. antes do uso formal.',
    ],
    references: [
      'Kessler RC, Adler L, Ames M, et al. The World Health Organization Adult ADHD Self-Report Scale (ASRS): a short screening scale for use in the general population. Psychol Med. 2005;35(2):245-256.',
      'Mattos P, Segenreich D, Saboya E, Louzã M, Dias G, Romano M. Adaptação transcultural para o português da escala Adult Self-Report Scale para avaliação do TDAH em adultos. Rev Psiquiatr Clin. 2006;33(4):188-194.',
    ],
  },
  cutoffs,
  items,
  calculateScore: (answers) => {
    const parteA = countAtOrAbove(partA, answers, asrsThreshold);
    const parteB = countAtOrAbove(partB, answers, asrsThreshold);
    const cutoff = parteA >= 4 ? cutoffs[1] : cutoffs[0];
    return {
      total: parteA, // o "escore" clínico do ASRS é a contagem da Parte A
      cutoff,
      classification: cutoff.severity,
      subscores: {
        parteA,
        parteB,
        desatencao: sumItems(items, answers, (it) => it.subscale === 'desatencao'),
        hiperatividade: sumItems(items, answers, (it) => it.subscale === 'hiperatividade'),
        somaTotal: sumItems(items, answers),
      },
      notes: [`${parteA} de 6 itens da Parte A na área sombreada (critério: 4 ou mais).`],
    };
  },
};
