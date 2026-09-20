import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { simpleSum } from '../../lib/scoring';

const OPT = [
  { label: 'Normal, ou nunca o fez mas poderia fazê-lo agora', value: 0 },
  { label: 'Faz com dificuldade, ou nunca o fez e agora teria dificuldade', value: 1 },
  { label: 'Necessita de ajuda', value: 2 },
  { label: 'Não é capaz', value: 3 },
];
const items: ScaleItem[] = [
  'Ele(a) manuseia seu próprio dinheiro?', 'É capaz de comprar roupas, comida e coisas para casa sozinho(a)?', 'É capaz de esquentar a água para o café e apagar o fogo?', 'É capaz de preparar uma comida?',
  'É capaz de manter-se em dia com as atualidades, com os acontecimentos da comunidade ou da vizinhança?', 'É capaz de prestar atenção, entender e discutir um programa de rádio ou televisão, um jornal ou uma revista?',
  'É capaz de lembrar-se de compromissos, acontecimentos familiares, feriados?', 'É capaz de manusear seus próprios remédios?', 'É capaz de passear pela vizinhança e encontrar o caminho de volta para casa?', 'Pode ser deixado(a) em casa sozinho(a) de forma segura?',
].map((text, i) => ({ id: `pfeffer_${i + 1}`, number: i + 1, text, options: OPT }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 4, severity: 'Funcionalidade preservada', clinicalImplication: 'Sem prejuízo funcional relevante nas atividades instrumentais.', badgeColor: 'green' },
  { min: 5, max: 30, severity: 'Prejuízo funcional', clinicalImplication: 'Escore ≥ 5 indica dependência em atividades instrumentais. Associado a rastreio cognitivo alterado, sustenta a hipótese de síndrome demencial.', badgeColor: 'red' },
];

export const pfeffer: PsychiatricScale = {
  id: 'pfeffer', name: 'Questionário de Atividades Funcionais de Pfeffer', acronym: 'Pfeffer (FAQ)', category: 'cognition', type: 'clinician_administered',
  estimatedMinutes: 5, timeframe: 'Desempenho atual',
  description: 'Atividades instrumentais de vida diária, respondido por informante. Complementa MEEM e MoCA na investigação de demência.',
  instructions: 'Aplique a um familiar ou cuidador que conviva com o paciente. Pergunte sobre o desempenho atual em cada atividade.',
  minScore: 0, maxScore: 30,
  validationInfo: { originalAuthors: 'Pfeffer RI, Kurosaki TT, Harrah CH, Chance JM, Filos S', year: 1982, brazilianValidation: 'Sanchez MAS, Correa PCR, Lourenço RA, 2011 (adaptação transcultural). Recomendado nos consensos da Academia Brasileira de Neurologia.', psychometrics: 'Alta confiabilidade entre avaliadores e boa correlação com medidas cognitivas no estudo original.' },
  about: {
    purposes: ['screening', 'diagnostic_support', 'monitoring'],
    objective: 'Documentar prejuízo funcional, que é o que separa comprometimento cognitivo leve de demência.',
    targetPopulation: 'Idosos com queixa ou suspeita de declínio cognitivo. Respondido por informante confiável.',
    limitations: ['Depende da qualidade do informante: cuidadores sobrecarregados tendem a superestimar e familiares distantes, a subestimar o prejuízo.', 'Limitações motoras, sensoriais ou papéis de gênero (atividades que a pessoa nunca fez) podem confundir. Use a opção "nunca o fez".', 'A combinação com o MEEM aumenta a especificidade para demência em populações de baixa escolaridade.', 'Alguns serviços usam corte ≥ 6.'],
    references: ['Pfeffer RI, Kurosaki TT, Harrah CH, Chance JM, Filos S. Measurement of functional activities in older adults in the community. J Gerontol. 1982;37(3):323-329.', 'Sanchez MAS, Correa PCR, Lourenço RA. Cross-cultural adaptation of the "Functional Activities Questionnaire - FAQ" for use in Brazil. Dement Neuropsychol. 2011;5(4):322-327.'],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
