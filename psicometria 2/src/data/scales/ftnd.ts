import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { YES_NO } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

const items: ScaleItem[] = [
  { text: 'Quanto tempo após acordar você fuma seu primeiro cigarro?', options: [{ label: 'Nos primeiros 5 minutos', value: 3 }, { label: 'De 6 a 30 minutos', value: 2 }, { label: 'De 31 a 60 minutos', value: 1 }, { label: 'Mais de 60 minutos', value: 0 }] },
  { text: 'Você acha difícil não fumar em lugares proibidos, como igrejas, bibliotecas, cinemas, ônibus?', options: YES_NO },
  { text: 'Qual cigarro do dia traz mais satisfação?', options: [{ label: 'O primeiro da manhã', value: 1 }, { label: 'Os outros', value: 0 }] },
  { text: 'Quantos cigarros você fuma por dia?', options: [{ label: '10 ou menos', value: 0 }, { label: 'De 11 a 20', value: 1 }, { label: 'De 21 a 30', value: 2 }, { label: '31 ou mais', value: 3 }] },
  { text: 'Você fuma mais frequentemente pela manhã?', options: YES_NO },
  { text: 'Você fuma mesmo doente, quando precisa ficar acamado a maior parte do tempo?', options: YES_NO },
].map((it, i) => ({ id: `ftnd_${i + 1}`, number: i + 1, ...it }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 2, severity: 'Dependência muito baixa', clinicalImplication: 'Abordagem breve e aconselhamento.', badgeColor: 'green' },
  { min: 3, max: 4, severity: 'Dependência baixa', clinicalImplication: 'Aconselhamento estruturado.', badgeColor: 'yellow' },
  { min: 5, max: 5, severity: 'Dependência média', clinicalImplication: 'Considerar farmacoterapia associada à abordagem cognitivo-comportamental.', badgeColor: 'orange' },
  { min: 6, max: 7, severity: 'Dependência elevada', clinicalImplication: 'Farmacoterapia indicada. Prever sintomas de abstinência relevantes.', badgeColor: 'red' },
  { min: 8, max: 10, severity: 'Dependência muito elevada', clinicalImplication: 'Farmacoterapia, muitas vezes combinada, e seguimento intensivo.', badgeColor: 'red' },
];

export const ftnd: PsychiatricScale = {
  id: 'ftnd', name: 'Teste de Fagerström para Dependência de Nicotina', acronym: 'Fagerström', category: 'substances', type: 'self_administered',
  estimatedMinutes: 2, timeframe: 'Padrão atual de consumo',
  description: 'Grau de dependência física de nicotina em 6 itens.',
  instructions: 'Responda de acordo com o seu hábito atual de fumar.',
  minScore: 0, maxScore: 10,
  validationInfo: { originalAuthors: 'Heatherton TF, Kozlowski LT, Frecker RC, Fagerström KO', year: 1991, brazilianValidation: 'Carmo JT, Pueyo AA, 2002.', psychometrics: 'Consistência interna modesta (alfa em torno de 0,61 a 0,64), esperada para escala curta e heterogênea.' },
  about: {
    purposes: ['severity'],
    objective: 'Estimar a dependência física de nicotina para orientar a intensidade do tratamento. Adotado pelo Programa Nacional de Controle do Tabagismo (INCA).',
    targetPopulation: 'Fumantes de cigarro industrializado. Autoaplicável ou por entrevista.',
    limitations: ['Mede dependência física, não motivação para parar nem dependência comportamental.', 'Não se aplica bem a fumantes não diários, cigarro eletrônico, narguilé ou cigarro de palha.', 'Em pacientes internados ou institucionalizados o consumo é limitado pelo ambiente e o escore subestima a dependência.'],
    references: ['Heatherton TF, Kozlowski LT, Frecker RC, Fagerström KO. The Fagerström Test for Nicotine Dependence: a revision of the Fagerström Tolerance Questionnaire. Br J Addict. 1991;86(9):1119-1127.', 'Carmo JT, Pueyo AA. A adaptação ao português do Fagerström Test for Nicotine Dependence (FTND) para avaliar a dependência e tolerância à nicotina em fumantes brasileiros. Rev Bras Med. 2002;59(1/2):73-80.'],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
