/**
 * PHQ-9: exemplo completo de escala de soma simples com
 *  - faixas de gravidade,
 *  - item fora do escore (dificuldade funcional),
 *  - gatilho de alerta clínico no item 9 (qualquer resposta > 0).
 */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { FREQ_2_WEEKS } from '../../lib/options';
import { classify, sumItems, triggeredRedFlags, SUICIDE_PROTOCOL } from '../../lib/scoring';

const texts = [
  'Pouco interesse ou pouco prazer em fazer as coisas',
  'Se sentir "para baixo", deprimido(a) ou sem perspectiva',
  'Dificuldade para pegar no sono ou permanecer dormindo, ou dormir mais do que de costume',
  'Se sentir cansado(a) ou com pouca energia',
  'Falta de apetite ou comendo demais',
  'Se sentir mal consigo mesmo(a), ou achar que você é um fracasso ou que decepcionou sua família ou você mesmo(a)',
  'Dificuldade para se concentrar nas coisas, como ler o jornal ou ver televisão',
  'Lentidão para se movimentar ou falar, a ponto de as outras pessoas perceberem. Ou o oposto: estar tão agitado(a) ou irrequieto(a) que você fica andando de um lado para o outro muito mais do que de costume',
  'Pensar em se ferir de alguma maneira ou que seria melhor estar morto(a)',
];

const items: ScaleItem[] = [
  ...texts.map<ScaleItem>((text, i) => ({
    id: `phq9_${i + 1}`,
    number: i + 1,
    text,
    options: FREQ_2_WEEKS,
    // Item 9: qualquer resposta diferente de "Nenhuma vez" dispara o alerta.
    ...(i === 8 ? { isRedFlagTrigger: true, redFlagThreshold: 1 } : {}),
  })),
  {
    id: 'phq9_func',
    number: 10,
    text: 'Se você assinalou qualquer um dos problemas, indique o grau de dificuldade que eles lhe causaram para realizar seu trabalho, tomar conta das coisas em casa ou para se relacionar com as pessoas',
    options: [
      { label: 'Nenhuma dificuldade', value: 0 },
      { label: 'Alguma dificuldade', value: 1 },
      { label: 'Muita dificuldade', value: 2 },
      { label: 'Extrema dificuldade', value: 3 },
    ],
    scored: false, // não entra no total
    optional: true, // não bloqueia a conclusão
  },
];

const cutoffs: CutoffRange[] = [
  { min: 0, max: 4, severity: 'Mínima', clinicalImplication: 'Sem indicação de tratamento específico. Reavaliar se houver queixa clínica.', badgeColor: 'green' },
  { min: 5, max: 9, severity: 'Leve', clinicalImplication: 'Conduta expectante, psicoeducação e repetição do PHQ-9 no seguimento.', badgeColor: 'yellow' },
  { min: 10, max: 14, severity: 'Moderada', clinicalImplication: 'Ponto de corte de rastreio positivo. Confirmar o diagnóstico por entrevista e considerar psicoterapia e/ou farmacoterapia.', badgeColor: 'orange' },
  { min: 15, max: 19, severity: 'Moderadamente grave', clinicalImplication: 'Tratamento ativo indicado (farmacoterapia e/ou psicoterapia).', badgeColor: 'red' },
  { min: 20, max: 27, severity: 'Grave', clinicalImplication: 'Iniciar tratamento sem demora. Avaliar risco, sintomas psicóticos e necessidade de cuidado intensivo.', badgeColor: 'red' },
];

export const phq9: PsychiatricScale = {
  id: 'phq9',
  name: 'Patient Health Questionnaire-9',
  acronym: 'PHQ-9',
  category: 'mood',
  type: 'self_administered',
  estimatedMinutes: 3,
  timeframe: 'Últimas 2 semanas',
  description: 'Rastreio e gravidade de sintomas depressivos, com um item para cada critério do episódio depressivo maior.',
  instructions: 'Durante as últimas 2 semanas, com que frequência você foi incomodado(a) por qualquer um dos problemas abaixo?',
  minScore: 0,
  maxScore: 27,
  validationInfo: {
    originalAuthors: 'Kroenke K, Spitzer RL, Williams JBW',
    year: 2001,
    brazilianValidation: 'Santos IS et al., 2013 (população geral, Pelotas). Tradução oficial em português do Brasil disponibilizada pela Pfizer.',
    psychometrics: 'Consistência interna alta (alfa de Cronbach 0,86 a 0,89) e boa confiabilidade teste-reteste no estudo original.',
  },
  about: {
    purposes: ['screening', 'severity', 'monitoring'],
    objective: 'Rastrear episódio depressivo, graduar a intensidade dos sintomas e acompanhar resposta ao tratamento. Queda de 5 pontos costuma ser considerada clinicamente relevante e escore abaixo de 5 é usado como remissão.',
    targetPopulation: 'Adultos e adolescentes em atenção primária, ambulatório e hospital geral. Autoaplicável. Pode ser lido pelo entrevistador para pessoas com baixa escolaridade.',
    accuracy: [
      { cutoff: '≥ 10', sensitivity: '88%', specificity: '88%', source: 'Kroenke et al., 2001 (atenção primária, EUA)' },
      { cutoff: '≥ 9', sensitivity: '77,5%', specificity: '86,7%', source: 'Santos et al., 2013 (população geral, Brasil)' },
      { cutoff: 'Algoritmo diagnóstico', sensitivity: 'menor que a do corte contínuo', specificity: 'alta', source: 'Santos et al., 2013' },
    ],
    limitations: [
      'É instrumento de rastreio. Escore alto não equivale a diagnóstico de depressão maior, que exige entrevista clínica.',
      'Não diferencia depressão unipolar de bipolar. Considere aplicar o MDQ e investigar (hipo)mania prévia.',
      'Itens somáticos (sono, apetite, energia) elevam o escore em doenças clínicas, dor crônica, gestação e puerpério.',
      'Luto, uso de substâncias e efeitos de medicamentos podem produzir falsos positivos.',
      'O item 9 mistura pensamentos de morte passivos e autolesão. Resposta positiva pede avaliação estruturada de risco (ex.: C-SSRS).',
    ],
    references: [
      'Kroenke K, Spitzer RL, Williams JBW. The PHQ-9: validity of a brief depression severity measure. J Gen Intern Med. 2001;16(9):606-613.',
      'Santos IS, Tavares BF, Munhoz TN, et al. Sensibilidade e especificidade do Patient Health Questionnaire-9 (PHQ-9) entre adultos da população geral. Cad Saude Publica. 2013;29(8):1533-1543.',
      'Levis B, Benedetti A, Thombs BD. Accuracy of PHQ-9 for screening to detect major depression: individual participant data meta-analysis. BMJ. 2019;365:l1476.',
    ],
  },
  cutoffs,
  items,
  calculateScore: (answers) => {
    const total = sumItems(items, answers);
    const cutoff = classify(total, cutoffs);
    const flagged = triggeredRedFlags(items, answers).length > 0;
    return {
      total,
      cutoff,
      classification: cutoff ? `Sintomatologia depressiva ${cutoff.severity.toLowerCase()}` : 'Sem classificação',
      notes: total >= 10 ? ['Rastreio positivo (≥ 10). Confirmar por entrevista clínica.'] : undefined,
      clinicalAlert: flagged ? `Item 9 positivo (pensamentos de morte ou de autolesão). ${SUICIDE_PROTOCOL}` : undefined,
    };
  },
};
