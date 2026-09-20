import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { SEV_1_7 } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';
import { ANCHOR_NOTE } from './_shared';

// [item, definição operacional resumida (Overall e Gorham, 1962)]
const raw: [string, string][] = [
  ['Preocupação somática', 'Grau de preocupação com a saúde física, haja ou não base real para as queixas. Relato.'],
  ['Ansiedade', 'Preocupação, medo ou apreensão excessivos com o presente ou o futuro. Apenas relato verbal, não sinais físicos.'],
  ['Retraimento emocional', 'Deficiência no relacionamento com o entrevistador e na situação de entrevista. Observação.'],
  ['Desorganização conceitual', 'Grau em que o pensamento é confuso, desconexo ou desorganizado. Observação da fala, não o relato subjetivo.'],
  ['Sentimentos de culpa', 'Preocupação ou remorso excessivos por comportamento passado. Relato com afeto apropriado.'],
  ['Tensão', 'Manifestações físicas e motoras de tensão, nervosismo e ativação. Apenas observação.'],
  ['Maneirismos e postura', 'Comportamento motor incomum e não natural, que destaca o paciente entre pessoas normais. Observação.'],
  ['Grandiosidade', 'Autoestima exagerada, convicção de poderes ou habilidades incomuns. Relato.'],
  ['Humor depressivo', 'Desânimo, tristeza. Apenas o grau de desânimo, não o retardo nem as queixas somáticas.'],
  ['Hostilidade', 'Animosidade, desprezo, beligerância em relação a outras pessoas fora da entrevista. Relato.'],
  ['Desconfiança', 'Crença, delirante ou não, de que outros têm ou tiveram intenção maliciosa ou discriminatória contra o paciente.'],
  ['Comportamento alucinatório', 'Percepções sem estímulo externo correspondente, na última semana.'],
  ['Retardo motor', 'Redução do nível de energia evidenciada por movimentos lentos. Apenas observação.'],
  ['Falta de cooperação', 'Resistência, inamistosidade, ressentimento e falta de prontidão para cooperar com o entrevistador. Observação.'],
  ['Conteúdo incomum do pensamento', 'Conteúdo incomum, estranho, bizarro. Pontue o grau de estranheza, não a desorganização.'],
  ['Embotamento afetivo', 'Tônus emocional reduzido, aparente falta de sentimento ou envolvimento. Observação.'],
  ['Excitação', 'Tônus emocional elevado, agitação, reatividade aumentada. Observação.'],
  ['Desorientação', 'Confusão ou falta de associação adequada quanto a pessoa, lugar ou tempo.'],
];
const items: ScaleItem[] = raw.map(([text, hint], i) => ({ id: `bprs_${i + 1}`, number: i + 1, text, hint, options: SEV_1_7 }));

const cutoffs: CutoffRange[] = [
  { min: 18, max: 30, severity: 'Sem doença ou mínima', clinicalImplication: 'Abaixo de 31 (Leucht et al., 2005).', badgeColor: 'green' },
  { min: 31, max: 40, severity: 'Levemente doente', clinicalImplication: 'Corresponde a CGI-S "levemente doente".', badgeColor: 'yellow' },
  { min: 41, max: 52, severity: 'Moderadamente doente', clinicalImplication: 'Corresponde a CGI-S "moderadamente doente".', badgeColor: 'orange' },
  { min: 53, max: 126, severity: 'Marcadamente doente ou mais', clinicalImplication: 'Corresponde a CGI-S "marcadamente doente" ou superior.', badgeColor: 'red' },
];

export const bprs: PsychiatricScale = {
  id: 'bprs', name: 'Brief Psychiatric Rating Scale (18 itens)', acronym: 'BPRS', category: 'psychosis', type: 'clinician_administered',
  estimatedMinutes: 25, timeframe: 'Última semana',
  description: 'Avaliação ampla de psicopatologia em 18 itens, muito usada em psicoses e em enfermaria.',
  instructions: 'Pontue de 1 (ausente) a 7 (extremo). Itens de observação (3, 4, 6, 7, 13, 14, 16, 17, 18) são pontuados pelo comportamento na entrevista; os demais, pelo relato.',
  licenseNote: ANCHOR_NOTE + ' A versão brasileira ancorada (BPRS-A) pontua cada item de 0 a 6: o total equivale ao deste módulo menos 18.',
  minScore: 18, maxScore: 126,
  validationInfo: {
    originalAuthors: 'Overall JE, Gorham DR', year: 1962,
    brazilianValidation: 'Romano F, Elkis H, 1996 (BPRS-A, versão ancorada com entrevista estruturada).',
    psychometrics: 'Confiabilidade entre avaliadores adequada com versão ancorada e treinamento (CCI em torno de 0,80 ou mais).',
  },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Quantificar sintomas psicóticos, afetivos e comportamentais e acompanhar resposta (redução ≥ 20 a 50%, conforme o contexto).',
    targetPopulation: 'Pacientes com esquizofrenia e outras psicoses, internados ou ambulatoriais. Heteroaplicável.',
    limitations: [
      'Cobre pouco os sintomas negativos e cognitivos. Para isso, prefira PANSS, SANS ou BNSS.',
      'Ao calcular redução percentual com pontuação 1 a 7, subtraia antes o mínimo (18 pontos), senão a resposta é subestimada.',
      'Sem âncoras e treinamento, a concordância entre avaliadores cai de forma importante.',
    ],
    references: [
      'Overall JE, Gorham DR. The Brief Psychiatric Rating Scale. Psychol Rep. 1962;10:799-812.',
      'Leucht S, Kane JM, Kissling W, Hamann J, Etschel E, Engel R. Clinical implications of Brief Psychiatric Rating Scale scores. Br J Psychiatry. 2005;187:366-371.',
      'Romano F, Elkis H. Tradução e adaptação de um instrumento de avaliação psicopatológica das psicoses: a Escala Breve de Avaliação Psiquiátrica, versão ancorada (BPRS-A). J Bras Psiquiatr. 1996;45(1):43-49.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
