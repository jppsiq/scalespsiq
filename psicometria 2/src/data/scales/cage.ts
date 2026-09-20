import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { YES_NO } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

const items: ScaleItem[] = [
  ['C (cut down)', 'Alguma vez você sentiu que deveria diminuir a quantidade de bebida ou parar de beber?'],
  ['A (annoyed)', 'As pessoas o(a) aborrecem porque criticam o seu modo de beber?'],
  ['G (guilty)', 'Você se sente culpado(a) pela maneira como costuma beber?'],
  ['E (eye-opener)', 'Você costuma beber pela manhã para diminuir o nervosismo ou a ressaca?'],
].map(([hint, text], i) => ({ id: `cage_${i + 1}`, number: i + 1, text, hint, options: YES_NO }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 1, severity: 'Rastreio negativo', clinicalImplication: 'Não exclui uso de risco: o CAGE detecta mal o beber pesado episódico. Considere o AUDIT.', badgeColor: 'green' },
  { min: 2, max: 4, severity: 'Rastreio positivo', clinicalImplication: 'Duas ou mais respostas afirmativas sugerem transtorno por uso de álcool. Prosseguir com avaliação diagnóstica.', badgeColor: 'red' },
];

export const cage: PsychiatricScale = {
  id: 'cage', name: 'Questionário CAGE', acronym: 'CAGE', category: 'substances', type: 'clinician_administered',
  estimatedMinutes: 1, timeframe: 'Ao longo da vida',
  description: 'Quatro perguntas para rastreio rápido de problemas com álcool.',
  instructions: 'Faça as quatro perguntas inseridas na anamnese, de preferência depois de perguntar sobre hábitos gerais, para reduzir a defensividade.',
  minScore: 0, maxScore: 4,
  validationInfo: { originalAuthors: 'Ewing JA', year: 1984, brazilianValidation: 'Masur J, Monteiro MG, 1983.', psychometrics: 'Na validação brasileira, corte de 2 respostas: sensibilidade de 88% e especificidade de 83%.' },
  about: {
    purposes: ['screening'],
    objective: 'Rastreio de dependência de álcool em menos de um minuto, útil em enfermaria e emergência.',
    targetPopulation: 'Adultos. Aplicado por entrevista.',
    accuracy: [{ cutoff: '≥ 2', sensitivity: '88%', specificity: '83%', source: 'Masur e Monteiro, 1983 (Brasil)' }],
    limitations: ['Avalia a vida toda: não distingue problema atual de passado.', 'Pouco sensível para uso de risco, para mulheres e para jovens.', 'Não quantifica consumo. Para isso use o AUDIT.'],
    references: ['Ewing JA. Detecting alcoholism: the CAGE questionnaire. JAMA. 1984;252(14):1905-1907.', 'Masur J, Monteiro MG. Validation of the "CAGE" alcoholism screening test in a Brazilian psychiatric inpatient hospital setting. Braz J Med Biol Res. 1983;16(3):215-218.'],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
