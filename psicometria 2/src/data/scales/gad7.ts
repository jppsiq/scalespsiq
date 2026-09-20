import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { FREQ_2_WEEKS } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

const items: ScaleItem[] = [
  'Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)',
  'Não ser capaz de impedir ou de controlar as preocupações',
  'Preocupar-se muito com diversas coisas',
  'Dificuldade para relaxar',
  'Ficar tão agitado(a) que se torna difícil permanecer sentado(a)',
  'Ficar facilmente aborrecido(a) ou irritado(a)',
  'Sentir medo como se algo horrível fosse acontecer',
].map((text, i) => ({ id: `gad7_${i + 1}`, number: i + 1, text, options: FREQ_2_WEEKS }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 4, severity: 'Mínima', clinicalImplication: 'Sem indicação de intervenção específica.', badgeColor: 'green' },
  { min: 5, max: 9, severity: 'Leve', clinicalImplication: 'Monitorar e reaplicar no seguimento.', badgeColor: 'yellow' },
  { min: 10, max: 14, severity: 'Moderada', clinicalImplication: 'Rastreio positivo. Investigar TAG, pânico, ansiedade social e TEPT por entrevista.', badgeColor: 'orange' },
  { min: 15, max: 21, severity: 'Grave', clinicalImplication: 'Tratamento ativo indicado. Avaliar comorbidade depressiva e prejuízo funcional.', badgeColor: 'red' },
];

export const gad7: PsychiatricScale = {
  id: 'gad7',
  name: 'Generalized Anxiety Disorder-7',
  acronym: 'GAD-7',
  category: 'anxiety',
  type: 'self_administered',
  estimatedMinutes: 2,
  timeframe: 'Últimas 2 semanas',
  description: 'Rastreio e gravidade de sintomas ansiosos, desenhado para o transtorno de ansiedade generalizada.',
  instructions: 'Durante as últimas 2 semanas, com que frequência você foi incomodado(a) pelos problemas abaixo?',
  minScore: 0,
  maxScore: 21,
  validationInfo: {
    originalAuthors: 'Spitzer RL, Kroenke K, Williams JBW, Löwe B',
    year: 2006,
    brazilianValidation: 'Moreno AL, DeSousa DA, Souza AMFLP, et al., 2016.',
    psychometrics: 'Alfa de Cronbach 0,92 e teste-reteste 0,83 no estudo original.',
  },
  about: {
    purposes: ['screening', 'severity', 'monitoring'],
    objective: 'Rastrear TAG e medir a intensidade de sintomas ansiosos ao longo do tratamento.',
    targetPopulation: 'Adultos e adolescentes em atenção primária e ambulatório. Autoaplicável.',
    accuracy: [
      { cutoff: '≥ 10 (TAG)', sensitivity: '89%', specificity: '82%', source: 'Spitzer et al., 2006' },
      { cutoff: '≥ 8 (qualquer transtorno de ansiedade)', sensitivity: '77%', specificity: '82%', source: 'Kroenke et al., 2007' },
    ],
    limitations: [
      'Mede ansiedade inespecífica: desempenho moderado para pânico, ansiedade social e TEPT.',
      'Sintomas de abstinência, hipertireoidismo, uso de estimulantes e acatisia elevam o escore.',
      'Não substitui a entrevista clínica nem estabelece diagnóstico.',
    ],
    references: [
      'Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. Arch Intern Med. 2006;166(10):1092-1097.',
      'Kroenke K, Spitzer RL, Williams JBW, Monahan PO, Löwe B. Anxiety disorders in primary care: prevalence, impairment, comorbidity, and detection. Ann Intern Med. 2007;146(5):317-325.',
      'Moreno AL, DeSousa DA, Souza AMFLP, et al. Factor structure, reliability, and item parameters of the Brazilian-Portuguese version of the GAD-7 questionnaire. Temas Psicol. 2016;24(1):367-376.',
    ],
  },
  cutoffs,
  items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    return { ...r, classification: r.cutoff ? `Ansiedade ${r.cutoff.severity.toLowerCase()}` : r.classification, notes: r.total >= 10 ? ['Rastreio positivo (≥ 10).'] : undefined };
  },
};
