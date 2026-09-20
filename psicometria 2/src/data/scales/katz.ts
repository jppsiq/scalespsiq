/** Katz: ABVD. Cada atividade é independente (1) ou dependente (0). */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { simpleSum } from '../../lib/scoring';

const raw: [string, string, string][] = [
  ['Banho', 'Não recebe ajuda, ou recebe ajuda apenas para uma parte do corpo (costas ou uma extremidade).', 'Recebe ajuda para lavar mais de uma parte do corpo, ou não toma banho sozinho.'],
  ['Vestir-se', 'Pega as roupas e se veste completamente sem ajuda (exceto amarrar sapatos).', 'Recebe ajuda para pegar as roupas ou para se vestir, ou permanece parcialmente vestido.'],
  ['Uso do vaso sanitário', 'Vai ao banheiro, usa o vaso, ajusta as roupas e se limpa sem ajuda (pode usar bengala, andador ou cadeira de rodas, e comadre ou urinol à noite, esvaziando-os pela manhã).', 'Recebe ajuda para ir ao banheiro, para se limpar, ou não usa o vaso sanitário.'],
  ['Transferência', 'Deita-se e levanta-se da cama e da cadeira sem ajuda (pode usar apoio mecânico).', 'Recebe ajuda para deitar ou levantar da cama e/ou da cadeira, ou não sai da cama.'],
  ['Continência', 'Controla inteiramente a micção e a evacuação.', 'Tem incontinência parcial ou total, usa cateter ou necessita de supervisão para o controle.'],
  ['Alimentação', 'Leva a comida do prato à boca sem ajuda (cortar carne e passar manteiga podem ser feitos por outra pessoa).', 'Recebe ajuda para se alimentar, não come, ou recebe alimentação por sonda ou via parenteral.'],
];
const items: ScaleItem[] = raw.map(([text, ind, dep], i) => ({
  id: `katz_${i + 1}`, number: i + 1, text,
  options: [{ label: 'Dependente', value: 0, description: dep }, { label: 'Independente', value: 1, description: ind }],
}));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 2, severity: 'Dependência importante', clinicalImplication: 'Zero a duas atividades preservadas. Necessita de cuidador presente e avaliação de suporte domiciliar ou institucional.', badgeColor: 'red' },
  { min: 3, max: 4, severity: 'Dependência parcial', clinicalImplication: 'Necessita de assistência em parte das atividades básicas. Investigar causa reversível (delirium, depressão, dor, fármacos, déficit sensorial).', badgeColor: 'orange' },
  { min: 5, max: 5, severity: 'Dependência leve', clinicalImplication: 'Uma atividade comprometida. Reavaliar periodicamente.', badgeColor: 'yellow' },
  { min: 6, max: 6, severity: 'Independente', clinicalImplication: 'Independente nas seis atividades básicas. Investigue as atividades instrumentais (Lawton ou Pfeffer), comprometidas mais cedo.', badgeColor: 'green' },
];

export const katz: PsychiatricScale = {
  id: 'katz', name: 'Índice de Independência nas Atividades Básicas de Vida Diária de Katz', acronym: 'Katz (ABVD)', category: 'function', type: 'clinician_administered',
  estimatedMinutes: 5, timeframe: 'Desempenho nas últimas 2 semanas',
  description: 'Seis atividades básicas de autocuidado: banho, vestir-se, uso do vaso, transferência, continência e alimentação.',
  instructions: 'Pontue o desempenho real e habitual, não a capacidade potencial. Informação do paciente, do cuidador e da observação direta. Independência significa realizar sem supervisão, direção ou assistência pessoal.',
  minScore: 0, maxScore: 6,
  validationInfo: { originalAuthors: 'Katz S, Ford AB, Moskowitz RW, Jackson BA, Jaffe MW', year: 1963, brazilianValidation: 'Lino VTS, Pereira SRM, Camacho LAB, Ribeiro Filho ST, Buksman S, 2008 (adaptação transcultural).', psychometrics: 'Alfa de Cronbach de 0,80 e boa confiabilidade entre observadores na versão brasileira.' },
  about: {
    purposes: ['severity', 'monitoring', 'diagnostic_support'],
    objective: 'Documentar o grau de dependência nas atividades básicas, definir necessidade de cuidador e acompanhar declínio ou recuperação funcional.',
    targetPopulation: 'Idosos e adultos com doença crônica, demência, sequela neurológica ou transtorno mental grave. Por entrevista com paciente e cuidador.',
    limitations: [
      'As atividades básicas se perdem tardiamente na demência: um Katz de 6 não afasta demência inicial. Use Lawton ou Pfeffer em paralelo.',
      'Escala ordinal grosseira: não capta pequenas mudanças nem o esforço envolvido na tarefa.',
      'Depende do informante e do ambiente: em instituições a equipe pode assumir tarefas que o paciente ainda faria.',
      'Não distingue causa do prejuízo: limitação motora, apatia, negativismo catatônico e déficit cognitivo pontuam igual.',
    ],
    references: [
      'Katz S, Ford AB, Moskowitz RW, Jackson BA, Jaffe MW. Studies of illness in the aged. The index of ADL. JAMA. 1963;185:914-919.',
      'Lino VTS, Pereira SRM, Camacho LAB, Ribeiro Filho ST, Buksman S. Adaptação transcultural da Escala de Independência em Atividades da Vida Diária (Escala de Katz). Cad Saude Publica. 2008;24(1):103-112.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
