import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { SEV_0_4 } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

const raw: [string, string, 'psiquica' | 'somatica'][] = [
  ['Humor ansioso', 'Preocupações, antecipação do pior, apreensão, irritabilidade.', 'psiquica'],
  ['Tensão', 'Sensação de tensão, fadiga, sobressaltos, choro fácil, tremores, inquietação, incapacidade de relaxar.', 'psiquica'],
  ['Medos', 'De escuro, de estranhos, de ficar sozinho, de animais, de trânsito, de multidões.', 'psiquica'],
  ['Insônia', 'Dificuldade para adormecer, sono interrompido, sono insatisfatório e fadiga ao despertar, sonhos, pesadelos, terror noturno.', 'psiquica'],
  ['Dificuldades intelectuais', 'Dificuldade de concentração, falhas de memória.', 'psiquica'],
  ['Humor deprimido', 'Perda de interesse, falta de prazer nos passatempos, depressão, despertar precoce, oscilação diurna do humor.', 'psiquica'],
  ['Sintomas somáticos musculares', 'Dores, contrações, rigidez, abalos mioclônicos, ranger de dentes, voz trêmula, tônus aumentado.', 'somatica'],
  ['Sintomas somáticos sensoriais', 'Zumbidos, visão turva, ondas de calor e frio, sensação de fraqueza, formigamentos.', 'somatica'],
  ['Sintomas cardiovasculares', 'Taquicardia, palpitações, dor no peito, pulsação dos vasos, sensação de desmaio, extrassístoles.', 'somatica'],
  ['Sintomas respiratórios', 'Pressão ou constrição no peito, sensação de sufocação, suspiros, dispneia.', 'somatica'],
  ['Sintomas gastrointestinais', 'Dificuldade para engolir, flatulência, dor abdominal, queimação, plenitude, náuseas, vômitos, borborigmos, diarreia, perda de peso, constipação.', 'somatica'],
  ['Sintomas geniturinários', 'Polaciúria, urgência miccional, amenorreia, menorragia, frigidez, ejaculação precoce, perda de libido, impotência.', 'somatica'],
  ['Sintomas autonômicos', 'Boca seca, rubor, palidez, tendência a suar, tontura, cefaleia tensional, piloereção.', 'somatica'],
  ['Comportamento na entrevista', 'Irrequieto, tenso, anda de um lado para o outro, tremor de mãos, testa franzida, face tensa, suspiros ou respiração rápida, palidez, deglutição frequente.', 'psiquica'],
];
const items: ScaleItem[] = raw.map(([text, hint, subscale], i) => ({ id: `hama_${i + 1}`, number: i + 1, text, hint, subscale, options: SEV_0_4 }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 17, severity: 'Ansiedade ausente ou leve', clinicalImplication: 'Escore ≤ 7 costuma definir remissão em ensaios clínicos.', badgeColor: 'green' },
  { min: 18, max: 24, severity: 'Ansiedade leve a moderada', clinicalImplication: 'Sintomas clinicamente relevantes.', badgeColor: 'yellow' },
  { min: 25, max: 30, severity: 'Ansiedade moderada a grave', clinicalImplication: 'Tratamento ativo indicado.', badgeColor: 'orange' },
  { min: 31, max: 56, severity: 'Ansiedade muito grave', clinicalImplication: 'Avaliar comorbidades, prejuízo funcional e risco.', badgeColor: 'red' },
];

export const hama: PsychiatricScale = {
  id: 'hama', name: 'Hamilton Anxiety Rating Scale', acronym: 'HAM-A', category: 'anxiety', type: 'clinician_administered',
  estimatedMinutes: 15, timeframe: 'Última semana',
  description: 'Gravidade de ansiedade em 14 itens, com subescalas psíquica e somática.',
  instructions: 'Pontue cada grupo de sintomas de 0 (ausente) a 4 (muito grave, incapacitante) com base em entrevista clínica.',
  minScore: 0, maxScore: 56,
  subscales: [{ key: 'psiquica', label: 'Ansiedade psíquica (itens 1 a 6 e 14)', max: 28 }, { key: 'somatica', label: 'Ansiedade somática (itens 7 a 13)', max: 28 }],
  validationInfo: { originalAuthors: 'Hamilton M', year: 1959, brazilianValidation: 'Versão em português de uso corrente em pesquisa no Brasil, sem estudo de validação único de referência.', psychometrics: 'Confiabilidade entre avaliadores adequada com entrevista estruturada (SIGH-A).' },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Quantificar gravidade de ansiedade e resposta ao tratamento (redução ≥ 50%).',
    targetPopulation: 'Adultos com transtorno de ansiedade diagnosticado. Heteroaplicável.',
    limitations: ['Não diagnostica nem diferencia os transtornos de ansiedade.', 'Peso grande de sintomas somáticos: efeitos adversos de medicamentos e doenças clínicas elevam o escore.', 'Discrimina mal ansiedade de depressão. Itens 4, 5 e 6 se sobrepõem à HAM-D.'],
    references: ['Hamilton M. The assessment of anxiety states by rating. Br J Med Psychol. 1959;32(1):50-55.', 'Shear MK, Vander Bilt J, Rucci P, et al. Reliability and validity of a structured interview guide for the Hamilton Anxiety Rating Scale (SIGH-A). Depress Anxiety. 2001;13(4):166-178.'],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
