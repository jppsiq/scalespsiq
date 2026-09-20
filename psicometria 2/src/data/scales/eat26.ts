/** EAT-26: seis opções com pontuação 3, 2, 1, 0, 0, 0. O item 26 tem pontuação invertida, com opções próprias. */
import type { CutoffRange, PsychiatricScale, ScaleItem, ScaleOption } from '../../types/scale';
import { classify, sumItems } from '../../lib/scoring';

const L = ['Sempre', 'Muito frequentemente', 'Frequentemente', 'Às vezes', 'Raramente', 'Nunca'];
const OPT: ScaleOption[] = L.map((label, i) => ({ label, value: [3, 2, 1, 0, 0, 0][i] }));
const OPT_REV: ScaleOption[] = L.map((label, i) => ({ label, value: [0, 0, 0, 1, 2, 3][i] }));

const DOM: Record<string, number[]> = {
  dieta: [1, 6, 7, 10, 11, 12, 14, 16, 17, 22, 23, 24, 25],
  bulimia: [3, 4, 9, 18, 21, 26],
  oral: [2, 5, 8, 13, 15, 19, 20],
};
const domOf = (n: number) => Object.keys(DOM).find((k) => DOM[k].includes(n))!;

const texts = [
  'Fico apavorado(a) com a ideia de estar engordando.',
  'Evito comer quando estou com fome.',
  'Sinto-me preocupado(a) com os alimentos.',
  'Tenho episódios de comer compulsivamente, durante os quais sinto que não consigo parar.',
  'Corto os meus alimentos em pedaços pequenos.',
  'Presto atenção à quantidade de calorias dos alimentos que eu como.',
  'Evito, particularmente, alimentos ricos em carboidratos.',
  'Sinto que os outros gostariam que eu comesse mais.',
  'Vomito depois de comer.',
  'Sinto-me extremamente culpado(a) depois de comer.',
  'Preocupo-me com o desejo de ser mais magro(a).',
  'Penso em queimar calorias quando me exercito.',
  'As outras pessoas acham que eu sou magro(a) demais.',
  'Preocupo-me com a ideia de haver gordura no meu corpo.',
  'Demoro mais tempo para fazer minhas refeições do que as outras pessoas.',
  'Evito alimentos que contenham açúcar.',
  'Como alimentos dietéticos.',
  'Sinto que os alimentos controlam a minha vida.',
  'Demonstro autocontrole diante dos alimentos.',
  'Sinto que os outros me pressionam para comer.',
  'Passo muito tempo pensando em comida.',
  'Sinto desconforto após comer doces.',
  'Faço regimes para emagrecer.',
  'Gosto de sentir meu estômago vazio.',
  'Após as refeições, tenho o impulso de vomitar.',
  'Gosto de experimentar novas comidas gostosas.',
];
const items: ScaleItem[] = texts.map((text, i) => ({
  id: `eat_${i + 1}`, number: i + 1, text, subscale: domOf(i + 1),
  options: i === 25 ? OPT_REV : OPT,
  ...(i === 25 ? { hint: 'Item de pontuação invertida.' } : {}),
  ...([8, 24].includes(i) ? { isRedFlagTrigger: true, redFlagThreshold: 1 } : {}),
}));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 19, severity: 'Rastreio negativo', clinicalImplication: 'Abaixo do ponto de corte. Não afasta transtorno alimentar: a negação de sintomas é comum, sobretudo na anorexia nervosa. Valorize achados clínicos e o relato de familiares.', badgeColor: 'green' },
  { min: 20, max: 78, severity: 'Rastreio positivo', clinicalImplication: 'Escore ≥ 20 indica atitudes e comportamentos alimentares de risco. Prossiga com entrevista diagnóstica, avalie a repercussão clínica e nutricional e estabeleça seguimento conjunto com clínica e nutrição.', badgeColor: 'red' },
];

const ALERT =
  'Comportamentos compensatórios relatados (itens 9 ou 25 positivos). Independentemente do escore total, avalie hoje a repercussão clínica: sinais vitais, hidratação, eletrólitos (sobretudo potássio, sódio e magnésio), função renal, eletrocardiograma e saúde bucal. Aborde a frequência e a duração dos comportamentos, o estado nutricional e o risco de suicídio, que é elevado nos transtornos alimentares. Encaminhe para avaliação especializada e acompanhamento conjunto com clínica médica e nutrição, e defina critérios de internação segundo o protocolo do serviço.';

export const eat26: PsychiatricScale = {
  id: 'eat26', name: 'Teste de Atitudes Alimentares', acronym: 'EAT-26', category: 'eating', type: 'self_administered',
  estimatedMinutes: 8, timeframe: 'Comportamento habitual',
  description: 'Rastreio de atitudes e comportamentos alimentares de risco, com subescalas de dieta, bulimia e controle oral.',
  instructions: 'Marque a opção que melhor descreve com que frequência cada situação se aplica a você. Responda a todos os itens com sinceridade: não há respostas certas ou erradas.',
  minScore: 0, maxScore: 78,
  subscales: [
    { key: 'dieta', label: 'Dieta', max: 39 },
    { key: 'bulimia', label: 'Bulimia e preocupação com a comida', max: 18 },
    { key: 'oral', label: 'Controle oral', max: 21 },
  ],
  licenseNote: 'Uso livre para fins clínicos e de pesquisa sem fins lucrativos, com atribuição (eat-26.com). O instrumento completo inclui questões sobre comportamentos compensatórios e dados antropométricos que não estão reproduzidos aqui e devem ser colhidos na entrevista.',
  validationInfo: { originalAuthors: 'Garner DM, Olmsted MP, Bohr Y, Garfinkel PE', year: 1982, brazilianValidation: 'Bighetti F, Santos CB, Santos JE, Ribeiro RPP, 2004 (adolescentes do sexo feminino, Ribeirão Preto).', psychometrics: 'Alfa de Cronbach de 0,82 na validação brasileira.' },
  about: {
    purposes: ['screening'],
    objective: 'Identificar pessoas com atitudes alimentares de risco que precisam de avaliação diagnóstica. Não mede gravidade nem estabelece diagnóstico.',
    targetPopulation: 'Adolescentes e adultos. Autoaplicável. Desenvolvido e validado predominantemente em mulheres.',
    accuracy: [{ cutoff: '≥ 21 (versão brasileira, adolescentes)', sensitivity: '82,6%', specificity: '87,5%', source: 'Bighetti et al., 2004' }],
    limitations: [
      'É apenas rastreio. O diagnóstico exige entrevista clínica, e o escore não diferencia anorexia, bulimia, transtorno de compulsão alimentar nem quadros subsindrômicos.',
      'Falsos negativos são frequentes: a minimização de sintomas é parte do quadro, sobretudo na anorexia nervosa. Escore baixo em paciente com perda de peso, amenorreia ou alterações laboratoriais não afasta o diagnóstico.',
      'Falsos positivos ocorrem em atletas, praticantes de musculação e pessoas em dieta por indicação clínica.',
      'Desenvolvido em amostras femininas: o desempenho em homens e em pessoas com corpos maiores é menos estudado, e o atraso diagnóstico nesses grupos é documentado.',
      'A avaliação precisa incluir repercussão clínica e nutricional, independentemente do resultado do questionário.',
    ],
    references: [
      'Garner DM, Olmsted MP, Bohr Y, Garfinkel PE. The Eating Attitudes Test: psychometric features and clinical correlates. Psychol Med. 1982;12(4):871-878.',
      'Bighetti F, Santos CB, Santos JE, Ribeiro RPP. Tradução e avaliação do Eating Attitudes Test em adolescentes do sexo feminino de Ribeirão Preto, São Paulo. J Bras Psiquiatr. 2004;53(6):339-346.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = sumItems(items, a);
    const cutoff = classify(total, cutoffs);
    const purge = (a.eat_9 ?? 0) > 0 || (a.eat_25 ?? 0) > 0;
    return {
      total, cutoff, classification: cutoff?.severity ?? 'Sem classificação',
      subscores: Object.fromEntries(Object.keys(DOM).map((k) => [k, sumItems(items, a, (it) => it.subscale === k)])),
      clinicalAlert: purge ? ALERT : undefined,
    };
  },
};
