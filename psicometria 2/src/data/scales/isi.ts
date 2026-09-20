import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { graded } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

const SEV = graded(['Nenhuma', 'Leve', 'Moderada', 'Grave', 'Muito grave']);
const MUCH = graded(['Nada', 'Um pouco', 'Razoavelmente', 'Muito', 'Extremamente']);
const items: ScaleItem[] = [
  { text: 'Dificuldade para pegar no sono', options: SEV }, { text: 'Dificuldade para manter o sono', options: SEV }, { text: 'Despertar cedo demais', options: SEV },
  { text: 'Quanto você está satisfeito(a) ou insatisfeito(a) com o padrão atual do seu sono?', options: graded(['Muito satisfeito', 'Satisfeito', 'Indiferente', 'Insatisfeito', 'Muito insatisfeito']) },
  { text: 'Em que medida você considera que seu problema de sono interfere nas suas atividades diurnas (fadiga, concentração, memória, humor)?', options: MUCH },
  { text: 'Quanto você acha que os outros percebem que seu problema de sono atrapalha sua qualidade de vida?', options: MUCH },
  { text: 'Quanto você está preocupado(a) ou estressado(a) com o seu problema de sono?', options: MUCH },
].map((it, i) => ({ id: `isi_${i + 1}`, number: i + 1, ...it }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 7, severity: 'Sem insônia clinicamente significativa', clinicalImplication: 'Orientações gerais de higiene do sono, se houver queixa.', badgeColor: 'green' },
  { min: 8, max: 14, severity: 'Insônia sublimiar', clinicalImplication: 'Investigar hábitos, substâncias, medicamentos e comorbidades.', badgeColor: 'yellow' },
  { min: 15, max: 21, severity: 'Insônia clínica moderada', clinicalImplication: 'Indicação de tratamento. A terapia cognitivo-comportamental para insônia é a primeira linha.', badgeColor: 'orange' },
  { min: 22, max: 28, severity: 'Insônia clínica grave', clinicalImplication: 'Tratamento ativo e investigação de transtornos psiquiátricos e do sono associados.', badgeColor: 'red' },
];

export const isi: PsychiatricScale = {
  id: 'isi', name: 'Índice de Gravidade de Insônia', acronym: 'ISI (IGI)', category: 'sleep', type: 'self_administered',
  estimatedMinutes: 3, timeframe: 'Últimas 2 semanas',
  description: 'Gravidade percebida da insônia e de seu impacto diurno, em 7 itens.',
  instructions: 'Avalie a gravidade atual (últimas 2 semanas) do seu problema de sono. Nos três primeiros itens, indique a gravidade de cada dificuldade.',
  minScore: 0, maxScore: 28,
  validationInfo: { originalAuthors: 'Morin CM; Bastien CH, Vallières A, Morin CM (validação)', year: 2001, brazilianValidation: 'Castro LS, 2011 (adaptação e validação, UNIFESP).', psychometrics: 'Alfa de Cronbach 0,90 (comunidade) e 0,91 (clínica) em Morin et al., 2011.' },
  about: {
    purposes: ['screening', 'severity', 'monitoring'],
    objective: 'Rastrear insônia, graduar a gravidade e medir resposta. Redução de 8 pontos ou mais indica resposta e escore abaixo de 8, remissão.',
    targetPopulation: 'Adultos. Autoaplicável.',
    accuracy: [{ cutoff: '≥ 10 (comunidade)', sensitivity: '86,1%', specificity: '87,7%', source: 'Morin et al., 2011' }],
    limitations: ['Mede percepção subjetiva. Não identifica apneia, pernas inquietas nem transtornos do ritmo circadiano.', 'Insônia é frequentemente sintoma de transtorno de humor, ansiedade ou uso de substâncias: o escore não indica a causa.', 'Itens em tradução de trabalho: confira com a versão brasileira validada.'],
    references: ['Bastien CH, Vallières A, Morin CM. Validation of the Insomnia Severity Index as an outcome measure for insomnia research. Sleep Med. 2001;2(4):297-307.', 'Morin CM, Belleville G, Bélanger L, Ivers H. The Insomnia Severity Index: psychometric indicators to detect insomnia cases and evaluate treatment response. Sleep. 2011;34(5):601-608.'],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
