/** SDQ (versão para pais e professores): 25 itens, cinco subescalas, cinco itens de pontuação invertida. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { graded } from '../../lib/options';
import { classify, sumItems } from '../../lib/scoring';

const OPT = graded(['Falso', 'Mais ou menos verdadeiro', 'Verdadeiro']);
const REV = [7, 11, 14, 21, 25];
const DOM: Record<string, number[]> = {
  emocional: [3, 8, 13, 16, 24], conduta: [5, 7, 12, 18, 22], hiperatividade: [2, 10, 15, 21, 25],
  pares: [6, 11, 14, 19, 23], prosocial: [1, 4, 9, 17, 20],
};
const domOf = (n: number) => Object.keys(DOM).find((k) => DOM[k].includes(n))!;

const texts = [
  'É atencioso(a) com os sentimentos das outras pessoas.', 'É inquieto(a), agitado(a), não consegue ficar parado(a) por muito tempo.',
  'Queixa-se com frequência de dor de cabeça, dor de barriga ou enjoo.', 'Divide facilmente com outras crianças doces, brinquedos, lápis etc.',
  'Frequentemente tem acessos de raiva ou crises de birra.', 'É solitário(a), prefere brincar sozinho(a).',
  'Em geral é obediente, normalmente faz o que os adultos pedem.', 'Tem muitas preocupações, frequentemente parece preocupado(a) com tudo.',
  'É prestativo(a) se alguém está magoado, aflito ou se sentindo mal.', 'Está sempre agitado(a), balançando as pernas ou mexendo as mãos.',
  'Tem pelo menos um bom amigo ou uma boa amiga.', 'Briga muito com outras crianças ou implica com elas.',
  'Frequentemente parece infeliz, desanimado(a) ou choroso(a).', 'Em geral é querido(a) por outras crianças.',
  'Distrai-se com facilidade, sua concentração dispersa.', 'É nervoso(a) ou agarrado(a) em situações novas, facilmente perde a confiança em si mesmo(a).',
  'É gentil com crianças mais novas.', 'Frequentemente mente ou engana.',
  'É atormentado(a), ameaçado(a) ou humilhado(a) por outras crianças.', 'Frequentemente se oferece para ajudar (pais, professores, outras crianças).',
  'Pensa antes de agir, reflete antes de fazer alguma coisa.', 'Rouba coisas de casa, da escola ou de outros lugares.',
  'Relaciona-se melhor com adultos do que com outras crianças.', 'Tem muitos medos, assusta-se facilmente.',
  'Termina o que começa, tem boa concentração.',
];
const items: ScaleItem[] = texts.map((text, i) => ({
  id: `sdq_${i + 1}`, number: i + 1, text, options: OPT, reverse: REV.includes(i + 1), subscale: domOf(i + 1),
  section: 'Marque a opção que melhor descreve o comportamento da criança ou adolescente nos últimos 6 meses',
}));

// As faixas classificam o TOTAL DE DIFICULDADES (0 a 40), que exclui a subescala prossocial.
const cutoffs: CutoffRange[] = [
  { min: 0, max: 13, severity: 'Normal', clinicalImplication: 'Total de dificuldades na faixa esperada.', badgeColor: 'green' },
  { min: 14, max: 16, severity: 'Limítrofe', clinicalImplication: 'Faixa de atenção. Reavaliar e buscar a perspectiva de outro informante (escola ou o outro cuidador).', badgeColor: 'yellow' },
  { min: 17, max: 40, severity: 'Anormal', clinicalImplication: 'Probabilidade aumentada de transtorno mental. Indica avaliação clínica dirigida às subescalas mais elevadas.', badgeColor: 'red' },
];

export const sdq: PsychiatricScale = {
  id: 'sdq', name: 'Questionário de Capacidades e Dificuldades', acronym: 'SDQ', category: 'adhd', type: 'self_administered',
  estimatedMinutes: 6, timeframe: 'Últimos 6 meses',
  description: 'Rastreio amplo de saúde mental de crianças e adolescentes, com subescalas emocional, de conduta, hiperatividade, relacionamento com pares e comportamento prossocial.',
  instructions: 'Responda com base no comportamento da criança nos últimos 6 meses. Existem versões para pais, para professores e de autorrelato (11 a 17 anos): idealmente use mais de um informante.',
  scoreLabel: 'Total de dificuldades', minScore: 0, maxScore: 40,
  subscales: [
    { key: 'emocional', label: 'Sintomas emocionais', max: 10 }, { key: 'conduta', label: 'Problemas de conduta', max: 10 },
    { key: 'hiperatividade', label: 'Hiperatividade e desatenção', max: 10 }, { key: 'pares', label: 'Problemas com colegas', max: 10 },
    { key: 'prosocial', label: 'Comportamento prossocial (não entra no total)', max: 10 },
  ],
  licenseNote: 'Uso gratuito, sem necessidade de permissão, desde que não haja modificação dos itens (sdqinfo.org).',
  validationInfo: { originalAuthors: 'Goodman R', year: 1997, brazilianValidation: 'Fleitlich B, Cortázar PG, Goodman R, 2000; Saur AM, Loureiro SR, 2012 (revisão das propriedades psicométricas no Brasil).', psychometrics: 'Consistência interna do total de dificuldades em torno de 0,80 na maioria dos estudos.' },
  about: {
    purposes: ['screening'],
    objective: 'Rastrear problemas emocionais e comportamentais e orientar a investigação clínica. Usado em pesquisa, escola e atenção primária.',
    targetPopulation: 'Crianças e adolescentes de 4 a 17 anos. Respondido por pais, professores ou pelo próprio adolescente.',
    limitations: [
      'Os pontos de corte são derivados de amostras britânicas. No Brasil há variação regional importante e alguns estudos sugerem cortes diferentes: use as faixas como orientação, não como critério rígido.',
      'A concordância entre pais e professores é baixa: divergência é informação clínica sobre o contexto, não erro de medida.',
      'A subescala prossocial mede capacidade, não dificuldade, e por isso não entra no total.',
      'Não rastreia TEA, transtorno alimentar, uso de substâncias nem psicose.',
    ],
    references: [
      'Goodman R. The Strengths and Difficulties Questionnaire: a research note. J Child Psychol Psychiatry. 1997;38(5):581-586.',
      'Fleitlich B, Cortázar PG, Goodman R. Questionário de Capacidades e Dificuldades (SDQ). Infanto Rev Neuropsiq Inf Adol. 2000;8(1):44-50.',
      'Saur AM, Loureiro SR. Qualidades psicométricas do Questionário de Capacidades e Dificuldades: revisão da literatura. Estud Psicol (Campinas). 2012;29(4):619-629.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const sub = Object.fromEntries(Object.keys(DOM).map((k) => [k, sumItems(items, a, (it) => it.subscale === k)]));
    const total = sub.emocional + sub.conduta + sub.hiperatividade + sub.pares; // prossocial fora do total
    const cutoff = classify(total, cutoffs);
    return { total, cutoff, subscores: sub, classification: cutoff?.severity ?? 'Sem classificação', notes: sub.prosocial <= 4 ? ['Comportamento prossocial ≤ 4: faixa considerada anormal nesta subescala.'] : undefined };
  },
};
