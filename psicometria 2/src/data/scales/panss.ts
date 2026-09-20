/** PANSS: sumário dimensional. Três subescalas (P, N, G) e escore composto (P menos N). */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { SEV_1_7 } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

const P = ['Delírios', 'Desorganização conceitual', 'Comportamento alucinatório', 'Excitação', 'Grandiosidade', 'Desconfiança e perseguição', 'Hostilidade'];
const N = ['Embotamento afetivo', 'Retraimento emocional', 'Contato pobre', 'Retraimento social passivo ou apático', 'Dificuldade de pensamento abstrato', 'Falta de espontaneidade e de fluência da conversa', 'Pensamento estereotipado'];
const G = ['Preocupação somática', 'Ansiedade', 'Sentimentos de culpa', 'Tensão', 'Maneirismos e postura', 'Depressão', 'Retardo motor', 'Falta de cooperação', 'Conteúdo incomum do pensamento', 'Desorientação', 'Atenção pobre', 'Falta de juízo e insight', 'Distúrbio da volição', 'Controle deficiente de impulsos', 'Preocupação (ensimesmamento)', 'Evitação social ativa'];

let n = 0;
const mk = (arr: string[], key: string, section: string): ScaleItem[] =>
  arr.map((t, i) => ({ id: `panss_${key}${i + 1}`, number: ++n, text: `${key}${i + 1}. ${t}`, subscale: key, section, options: SEV_1_7 }));
const items = [...mk(P, 'P', 'Escala positiva (P1 a P7)'), ...mk(N, 'N', 'Escala negativa (N1 a N7)'), ...mk(G, 'G', 'Psicopatologia geral (G1 a G16)')];

const cutoffs: CutoffRange[] = [
  { min: 30, max: 57, severity: 'Sem doença ou mínima', clinicalImplication: 'Abaixo de 58 (Leucht et al., 2005).', badgeColor: 'green' },
  { min: 58, max: 74, severity: 'Levemente doente', clinicalImplication: 'Corresponde a CGI-S "levemente doente".', badgeColor: 'yellow' },
  { min: 75, max: 94, severity: 'Moderadamente doente', clinicalImplication: 'Corresponde a CGI-S "moderadamente doente".', badgeColor: 'orange' },
  { min: 95, max: 115, severity: 'Marcadamente doente', clinicalImplication: 'Corresponde a CGI-S "marcadamente doente".', badgeColor: 'red' },
  { min: 116, max: 210, severity: 'Gravemente doente', clinicalImplication: 'Corresponde a CGI-S "gravemente doente".', badgeColor: 'red' },
];

export const panss: PsychiatricScale = {
  id: 'panss', name: 'Positive and Negative Syndrome Scale (sumário dimensional)', acronym: 'PANSS', category: 'psychosis', type: 'clinician_administered',
  estimatedMinutes: 45, timeframe: 'Última semana',
  description: 'Trinta itens em três dimensões: sintomas positivos, negativos e psicopatologia geral.',
  instructions: 'Registre aqui a pontuação (1 a 7) obtida com a entrevista SCI-PANSS e com informações de cuidadores ou equipe. Este módulo calcula subescalas e escore composto.',
  licenseNote: 'A PANSS é instrumento protegido por direitos autorais (MHS). Os critérios de pontuação de cada item e a entrevista SCI-PANSS exigem manual licenciado e treinamento. Este módulo traz apenas os nomes dos itens para registro e cálculo.',
  minScore: 30, maxScore: 210,
  subscales: [{ key: 'P', label: 'Positiva (7 a 49)', max: 49 }, { key: 'N', label: 'Negativa (7 a 49)', max: 49 }, { key: 'G', label: 'Psicopatologia geral (16 a 112)', max: 112 }, { key: 'composto', label: 'Composto (P menos N)' }],
  validationInfo: {
    originalAuthors: 'Kay SR, Fiszbein A, Opler LA', year: 1987,
    brazilianValidation: 'Vessoni ALN, 1993 (adaptação e confiabilidade); Higuchi CH et al., 2014 (estrutura fatorial).',
    psychometrics: 'Alfa de 0,73 (positiva), 0,83 (negativa) e 0,79 (geral) no estudo original.',
  },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Medir gravidade dimensional da esquizofrenia, tipificar predomínio positivo ou negativo e quantificar resposta ao tratamento.',
    targetPopulation: 'Pacientes com esquizofrenia e psicoses relacionadas. Entrevista semiestruturada de 30 a 50 minutos por avaliador treinado.',
    limitations: [
      'Como a pontuação mínima é 30, subtraia 30 do total antes de calcular redução percentual.',
      'A estrutura de três subescalas não é sustentada por análises fatoriais, que apontam cinco fatores (positivo, negativo, desorganização, excitação, depressão e ansiedade).',
      'A subescala negativa mistura sintomas negativos e cognitivos (N5, N7). Sintomas negativos secundários a depressão, parkinsonismo ou sedação inflacionam o escore.',
      'Exige treinamento formal. Sem ele, a concordância entre avaliadores é insuficiente.',
    ],
    references: [
      'Kay SR, Fiszbein A, Opler LA. The Positive and Negative Syndrome Scale (PANSS) for schizophrenia. Schizophr Bull. 1987;13(2):261-276.',
      'Leucht S, Kane JM, Kissling W, Hamann J, Etschel E, Engel RR. What does the PANSS mean? Schizophr Res. 2005;79(2-3):231-238.',
      'Higuchi CH, Ortiz B, Berberian AA, et al. Factor structure of the Positive and Negative Syndrome Scale (PANSS) in Brazil: convergent validation of the Brazilian version. Braz J Psychiatry. 2014;36(4):336-339.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    const s = r.subscores ?? {};
    const composto = (s.P ?? 0) - (s.N ?? 0);
    return { ...r, subscores: { ...s, composto }, notes: [`Escore composto ${composto >= 0 ? '+' : ''}${composto}: predomínio ${composto > 0 ? 'positivo' : composto < 0 ? 'negativo' : 'indefinido'}.`] };
  },
};
