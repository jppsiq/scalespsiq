/** DAST-10: demonstra PONTUAÇÃO INVERTIDA. No item 3, "Não" vale 1 ponto. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { YES_NO } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

const items: ScaleItem[] = [
  'Você usou outras drogas além daquelas necessárias por razões médicas?',
  'Você abusa de mais de uma droga ao mesmo tempo?',
  'Você sempre consegue parar de usar drogas quando quer?',
  'Você já teve "apagões" ou "flashbacks" como resultado do uso de drogas?',
  'Você alguma vez se sente mal ou culpado(a) por causa do seu uso de drogas?',
  'Seu cônjuge (ou seus pais) alguma vez reclama do seu envolvimento com drogas?',
  'Você negligenciou sua família por causa do uso de drogas?',
  'Você se envolveu em atividades ilegais para obter drogas?',
  'Você já teve sintomas de abstinência (sentiu-se doente) quando parou de usar drogas?',
  'Você teve problemas médicos como resultado do uso de drogas (por exemplo, perda de memória, hepatite, convulsões, sangramentos)?',
].map((text, i) => ({ id: `dast_${i + 1}`, number: i + 1, text, options: YES_NO, ...(i === 2 ? { reverse: true, hint: 'Item de pontuação invertida: "Não" soma 1 ponto.' } : {}) }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 0, severity: 'Sem problemas relatados', clinicalImplication: 'Nenhuma ação específica.', badgeColor: 'green' },
  { min: 1, max: 2, severity: 'Nível baixo', clinicalImplication: 'Monitorar e reavaliar posteriormente.', badgeColor: 'yellow' },
  { min: 3, max: 5, severity: 'Nível moderado', clinicalImplication: 'Investigação adicional e intervenção breve.', badgeColor: 'orange' },
  { min: 6, max: 8, severity: 'Nível substancial', clinicalImplication: 'Avaliação intensiva e encaminhamento para tratamento.', badgeColor: 'red' },
  { min: 9, max: 10, severity: 'Nível grave', clinicalImplication: 'Avaliação intensiva e tratamento especializado.', badgeColor: 'red' },
];

export const dast10: PsychiatricScale = {
  id: 'dast10', name: 'Drug Abuse Screening Test', acronym: 'DAST-10', category: 'substances', type: 'self_administered',
  estimatedMinutes: 3, timeframe: 'Últimos 12 meses',
  description: 'Rastreio de problemas relacionados ao uso de drogas, excluídos álcool e tabaco.',
  instructions: '"Drogas" inclui o uso de medicamentos prescritos ou de venda livre acima da dose indicada e qualquer uso não médico de substâncias (maconha, cocaína, crack, solventes, tranquilizantes, estimulantes, alucinógenos, opioides). Não inclua álcool nem tabaco. Considere os últimos 12 meses.',
  minScore: 0, maxScore: 10,
  validationInfo: {
    originalAuthors: 'Skinner HA', year: 1982,
    brazilianValidation: 'Sem estudo de validação brasileiro consolidado. Itens em tradução de trabalho. Para rastreio validado no Brasil, considere o ASSIST (Henrique et al., 2004).',
    psychometrics: 'Alfa de Cronbach entre 0,86 e 0,94 nos estudos revisados por Yudko et al., 2007.',
  },
  about: {
    purposes: ['screening', 'severity'],
    objective: 'Quantificar consequências do uso de drogas e indicar o nível de intervenção necessário.',
    targetPopulation: 'Adultos e adolescentes mais velhos. Autoaplicável ou por entrevista.',
    accuracy: [{ cutoff: '≥ 3', sensitivity: '≈ 80 a 95%', specificity: '≈ 68 a 93%', source: 'Yudko et al., 2007 (revisão)' }],
    limitations: [
      'Não identifica a substância, a via nem o padrão de uso: complemente com anamnese.',
      'Validade de face alta: fácil de negar quando há receio de consequências.',
      'Ausência de validação brasileira formal limita o uso dos pontos de corte.',
    ],
    references: [
      'Skinner HA. The Drug Abuse Screening Test. Addict Behav. 1982;7(4):363-371.',
      'Yudko E, Lozhkina O, Fouts A. A comprehensive review of the psychometric properties of the Drug Abuse Screening Test. J Subst Abuse Treat. 2007;32(2):189-198.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
