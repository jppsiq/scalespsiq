/** GDS-15: cinco itens de pontuação invertida (1, 5, 7, 11 e 13), em que "Não" soma 1 ponto. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { YES_NO } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

const REV = [1, 5, 7, 11, 13];
const items: ScaleItem[] = [
  'Você está basicamente satisfeito(a) com sua vida?', 'Você deixou muitos de seus interesses e atividades?', 'Você sente que sua vida está vazia?', 'Você se aborrece com frequência?',
  'Você se sente de bom humor a maior parte do tempo?', 'Você tem medo de que algum mal vá lhe acontecer?', 'Você se sente feliz a maior parte do tempo?', 'Você sente que sua situação não tem saída?',
  'Você prefere ficar em casa a sair e fazer coisas novas?', 'Você se sente com mais problemas de memória do que a maioria?', 'Você acha maravilhoso estar vivo(a)?', 'Você se sente inútil nas atuais circunstâncias?',
  'Você se sente cheio(a) de energia?', 'Você acha que sua situação é sem esperanças?', 'Você sente que a maioria das pessoas está melhor que você?',
].map((text, i) => ({ id: `gds_${i + 1}`, number: i + 1, text, options: YES_NO, reverse: REV.includes(i + 1) }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 5, severity: 'Normal', clinicalImplication: 'Rastreio negativo.', badgeColor: 'green' },
  { min: 6, max: 10, severity: 'Depressão leve a moderada provável', clinicalImplication: 'Rastreio positivo (≥ 6). Confirmar por entrevista e avaliar cognição e causas clínicas.', badgeColor: 'orange' },
  { min: 11, max: 15, severity: 'Depressão grave provável', clinicalImplication: 'Avaliar risco de suicídio, estado nutricional e funcionalidade.', badgeColor: 'red' },
];

export const gds15: PsychiatricScale = {
  id: 'gds15', name: 'Escala de Depressão Geriátrica (15 itens)', acronym: 'GDS-15', category: 'mood', type: 'self_administered',
  estimatedMinutes: 5, timeframe: 'Última semana',
  description: 'Rastreio de depressão em idosos, com respostas sim ou não e sem itens somáticos.',
  instructions: 'Escolha a melhor resposta para como você se sentiu na última semana.',
  minScore: 0, maxScore: 15,
  validationInfo: { originalAuthors: 'Sheikh JI, Yesavage JA (versão curta); Yesavage JA et al., 1983 (versão de 30 itens)', year: 1986, brazilianValidation: 'Almeida OP, Almeida SA, 1999.', psychometrics: 'Alfa de Cronbach 0,81 na versão brasileira.' },
  about: {
    purposes: ['screening'],
    objective: 'Rastrear depressão em pessoas idosas em atenção primária, ambulatório e instituições.',
    targetPopulation: 'Pessoas com 60 anos ou mais, com cognição preservada ou comprometimento leve. Autoaplicável ou lida pelo entrevistador.',
    accuracy: [{ cutoff: '≥ 6 (5/6)', sensitivity: '85,4%', specificity: '73,9%', source: 'Almeida e Almeida, 1999 (CID-10)' }],
    limitations: ['Validade reduzida em demência moderada a grave (MEEM abaixo de 15, aproximadamente).', 'Não pergunta sobre ideação suicida: investigue à parte.', 'Não diferencia depressão de apatia, comum em demências e doença de Parkinson.'],
    references: ['Sheikh JI, Yesavage JA. Geriatric Depression Scale (GDS): recent evidence and development of a shorter version. Clin Gerontol. 1986;5(1-2):165-173.', 'Almeida OP, Almeida SA. Confiabilidade da versão brasileira da Escala de Depressão em Geriatria (GDS) versão reduzida. Arq Neuropsiquiatr. 1999;57(2B):421-426.'],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
