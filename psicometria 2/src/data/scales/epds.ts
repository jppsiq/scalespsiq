/** EPDS: cada item tem opções próprias, já com o valor correto embutido (itens 3 e 5 a 10 são apresentados do mais para o menos grave). */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { simpleSum, triggeredRedFlags, SUICIDE_PROTOCOL } from '../../lib/scoring';

const raw: [string, [string, number][]][] = [
  ['Eu tenho sido capaz de rir e achar graça das coisas', [['Como eu sempre fiz', 0], ['Não tanto quanto antes', 1], ['Sem dúvida, menos que antes', 2], ['De jeito nenhum', 3]]],
  ['Eu sinto prazer quando penso no que está por acontecer em meu dia a dia', [['Como sempre senti', 0], ['Talvez menos do que antes', 1], ['Com certeza menos', 2], ['De jeito nenhum', 3]]],
  ['Eu tenho me culpado sem necessidade quando as coisas saem erradas', [['Sim, na maioria das vezes', 3], ['Sim, algumas vezes', 2], ['Não muitas vezes', 1], ['Não, nenhuma vez', 0]]],
  ['Eu tenho me sentido ansiosa ou preocupada sem uma boa razão', [['Não, de maneira alguma', 0], ['Pouquíssimas vezes', 1], ['Sim, algumas vezes', 2], ['Sim, muitas vezes', 3]]],
  ['Eu tenho me sentido assustada ou em pânico sem um bom motivo', [['Sim, muitas vezes', 3], ['Sim, algumas vezes', 2], ['Não muitas vezes', 1], ['Não, nenhuma vez', 0]]],
  ['Eu tenho me sentido esmagada pelas tarefas e acontecimentos do meu dia a dia', [['Sim. Na maioria das vezes eu não consigo lidar bem com eles', 3], ['Sim. Algumas vezes não consigo lidar bem como antes', 2], ['Não. Na maioria das vezes consigo lidar bem com eles', 1], ['Não. Eu consigo lidar com eles tão bem quanto antes', 0]]],
  ['Eu tenho me sentido tão infeliz que tenho tido dificuldade de dormir', [['Sim, na maioria das vezes', 3], ['Sim, algumas vezes', 2], ['Não muitas vezes', 1], ['Não, nenhuma vez', 0]]],
  ['Eu tenho me sentido triste ou arrasada', [['Sim, na maioria das vezes', 3], ['Sim, muitas vezes', 2], ['Não muitas vezes', 1], ['Não, de jeito nenhum', 0]]],
  ['Eu tenho me sentido tão infeliz que tenho chorado', [['Sim, quase todo o tempo', 3], ['Sim, muitas vezes', 2], ['De vez em quando', 1], ['Não, nenhuma vez', 0]]],
  ['A ideia de fazer mal a mim mesma passou por minha cabeça', [['Sim, muitas vezes, ultimamente', 3], ['Algumas vezes nos últimos dias', 2], ['Pouquíssimas vezes, ultimamente', 1], ['Nenhuma vez', 0]]],
];
const items: ScaleItem[] = raw.map(([text, opts], i) => ({ id: `epds_${i + 1}`, number: i + 1, text, options: opts.map(([label, value]) => ({ label, value })), ...(i === 9 ? { isRedFlagTrigger: true } : {}) }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 9, severity: 'Rastreio negativo', clinicalImplication: 'Depressão perinatal pouco provável. Reaplicar se houver suspeita clínica.', badgeColor: 'green' },
  { min: 10, max: 12, severity: 'Rastreio positivo (corte brasileiro)', clinicalImplication: 'Escore ≥ 10: depressão possível. Avaliar clinicamente e reaplicar em 2 semanas.', badgeColor: 'orange' },
  { min: 13, max: 30, severity: 'Depressão provável', clinicalImplication: 'Escore ≥ 13 (corte original). Avaliação diagnóstica e plano terapêutico, considerando amamentação e vínculo com o bebê.', badgeColor: 'red' },
];

export const epds: PsychiatricScale = {
  id: 'epds', name: 'Escala de Depressão Pós-parto de Edimburgo', acronym: 'EPDS', category: 'mood', type: 'self_administered',
  estimatedMinutes: 5, timeframe: 'Últimos 7 dias',
  description: 'Rastreio de depressão na gestação e no pós-parto, sem itens somáticos que se confundem com o puerpério.',
  instructions: 'Você teve um bebê há pouco tempo (ou está grávida) e gostaríamos de saber como você está se sentindo. Marque a resposta que mais se aproxima de como você tem se sentido nos últimos 7 dias, não apenas hoje.',
  minScore: 0, maxScore: 30,
  validationInfo: { originalAuthors: 'Cox JL, Holden JM, Sagovsky R', year: 1987, brazilianValidation: 'Santos MFS, Martins FC, Pasquali L, 1999; Santos IS, Matijasevich A, Tavares BF, et al., 2007 (coorte de Pelotas).', psychometrics: 'Confiabilidade split-half de 0,88 e alfa de 0,87 no estudo original.' },
  about: {
    purposes: ['screening', 'monitoring'],
    objective: 'Rastrear depressão perinatal. Também validada para gestantes e para pais.',
    targetPopulation: 'Gestantes e puérperas (até 12 meses após o parto). Autoaplicável.',
    accuracy: [
      { cutoff: '≥ 13', sensitivity: '86%', specificity: '78%', source: 'Cox et al., 1987' },
      { cutoff: '≥ 10', sensitivity: '82,6%', specificity: '65,4%', source: 'Santos et al., 2007 (Brasil)' },
    ],
    limitations: ['Não diagnostica e não mede gravidade. Escore alto pede entrevista clínica.', 'Itens 3, 4 e 5 medem ansiedade: escore elevado pode refletir transtorno de ansiedade perinatal.', 'Não rastreia psicose puerperal nem transtorno bipolar. Pergunte sobre (hipo)mania e considere o MDQ.', 'O item 10 positivo exige avaliação de risco no mesmo atendimento, incluindo pensamentos de dano ao bebê.'],
    references: ['Cox JL, Holden JM, Sagovsky R. Detection of postnatal depression: development of the 10-item Edinburgh Postnatal Depression Scale. Br J Psychiatry. 1987;150:782-786.', 'Santos IS, Matijasevich A, Tavares BF, et al. Validation of the Edinburgh Postnatal Depression Scale (EPDS) in a sample of mothers from the 2004 Pelotas Birth Cohort Study. Cad Saude Publica. 2007;23(11):2577-2588.'],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    return { ...r, clinicalAlert: triggeredRedFlags(items, a).length ? `Item 10 positivo (ideia de fazer mal a si mesma). ${SUICIDE_PROTOCOL} Pergunte também sobre pensamentos de fazer mal ao bebê.` : undefined };
  },
};
