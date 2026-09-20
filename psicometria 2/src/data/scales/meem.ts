/** MEEM: 30 itens binários, ESTÍMULOS VISUAIS (frase e pentágonos) e referência DEPENDENTE DA ESCOLARIDADE. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { CORRECT } from '../../lib/options';
import pentagonos from '../../assets/meem/pentagonos.svg';
import { sumBySubscale, sumItems } from '../../lib/scoring';

// Medianas por escolaridade de Brucki et al., 2003. Escore abaixo da referência = investigar.
const EDU = [
  { label: 'Analfabeto', ref: 20 }, { label: '1 a 4 anos', ref: 25 }, { label: '5 a 8 anos', ref: 26.5 },
  { label: '9 a 11 anos', ref: 28 }, { label: 'Mais de 11 anos', ref: 29 },
];

// Itens um a um, conforme o modelo de formulário adotado no serviço (orientação com "estação" e
// palavras PENTE, RUA, AZUL). Cada acerto vale 1 ponto.
const O = 'Orientação (10 pontos)', R = 'Registro (3 pontos)', A = 'Atenção e cálculo (5 pontos)', E = 'Evocação (3 pontos)', L = 'Linguagem e praxia (9 pontos)';
const raw: [string, string, string, Partial<ScaleItem>?][] = [
  ['Em que ano estamos?', O, 'orientacao'], ['Em que estação do ano estamos?', O, 'orientacao', { hint: 'Onde as estações não são marcadas, muitos serviços substituem por "semestre" ou "hora aproximada" (Brucki et al., 2003).' }],
  ['Que dia da semana é hoje?', O, 'orientacao'], ['Que dia do mês é hoje?', O, 'orientacao'], ['Em que mês estamos?', O, 'orientacao'],
  ['Em que país estamos?', O, 'orientacao'], ['Em que estado estamos?', O, 'orientacao'], ['Em que cidade estamos?', O, 'orientacao'],
  ['Em que rua ou local estamos?', O, 'orientacao', { hint: 'Rua em visita domiciliar. Local (nome do hospital ou instituição) em consulta.' }],
  ['Qual é o número ou o andar?', O, 'orientacao', { hint: 'Número em visita domiciliar. Andar em consulta no hospital ou instituição.' }],
  ['Repetir: PENTE', R, 'registro', { hint: 'Diga as três palavras (PENTE, RUA, AZUL) e avise que serão perguntadas depois. Pontue a primeira repetição. Repita até 5 vezes para que aprenda e anote o número de tentativas.' }],
  ['Repetir: RUA', R, 'registro'], ['Repetir: AZUL', R, 'registro'],
  ['100 menos 7 (93)', A, 'atencao', { hint: 'Alternativa: repetir a série de dígitos 5 8 2 6 9 4 1. Use-a quando houver erro já na primeira subtração, ou acerto na primeira e erro na segunda. Sempre que a alternativa for usada, vale o escore obtido nela (1 ponto por dígito na posição correta, máximo 5). A ordem tem de ser exatamente a da apresentação.' }],
  ['Menos 7 (86)', A, 'atencao'], ['Menos 7 (79)', A, 'atencao'], ['Menos 7 (72)', A, 'atencao'], ['Menos 7 (65)', A, 'atencao'],
  ['Evocar: PENTE', E, 'evocacao'], ['Evocar: RUA', E, 'evocacao'], ['Evocar: AZUL', E, 'evocacao'],
  ['Nomear: lápis', L, 'linguagem'], ['Nomear: relógio de pulso', L, 'linguagem', { hint: 'Mostre o relógio fora do pulso.' }],
  ['Repetir: "Nem aqui, nem ali, nem lá"', L, 'linguagem'],
  ['Comando: pega o papel com a mão direita', L, 'linguagem', { hint: 'Diga a frase inteira, uma única vez: "Pegue o papel com a mão direita, dobre ao meio e ponha no chão".' }],
  ['Comando: dobra o papel ao meio', L, 'linguagem'], ['Comando: põe o papel no chão', L, 'linguagem'],
  ['Ler ("só com os olhos") e executar', L, 'linguagem', { stimulus: { kind: 'text', text: 'FECHE OS OLHOS', alt: 'Frase para leitura: feche os olhos' } }],
  ['Escrever uma frase (um pensamento, ideia completa)', L, 'linguagem', { responseSpaceMm: 22, hint: 'Precisa ter sentido. Erros de ortografia e gramática não descontam.' }],
  ['Copiar o desenho', L, 'linguagem', { responseSpaceMm: 45, hint: 'Correto se houver dois pentágonos (cinco lados cada) com interseção formando um quadrilátero.', stimulus: { kind: 'image', src: pentagonos, alt: 'Dois pentágonos em interseção', caption: 'Mostre a figura e peça a cópia em folha de papel.' } }],
];

const items: ScaleItem[] = [
  { id: 'meem_edu', number: 0, text: 'Escolaridade (anos completos de estudo)', hint: 'Não pontua. Define o valor de referência. Exemplo: quem levou 10 anos para concluir a 4ª série tem escolaridade de 4 anos.', scored: false, options: EDU.map((e, value) => ({ label: e.label, value })) },
  ...raw.map(([text, section, subscale, extra], i) => ({ id: `meem_${i + 1}`, number: i + 1, text, section, subscale, options: CORRECT, ...extra })),
];

const cutoffs: CutoffRange[] = [
  { min: 0, max: 17, severity: 'Comprometimento provável', clinicalImplication: 'Abaixo de 18 sugere comprometimento mesmo em baixa escolaridade (Bertolucci et al., 1994), exceto em analfabetos (corte 13).', badgeColor: 'red' },
  { min: 18, max: 25, severity: 'Interpretar conforme escolaridade', clinicalImplication: 'Pode ser normal em baixa escolaridade e alterado em alta escolaridade.', badgeColor: 'orange' },
  { min: 26, max: 30, severity: 'Faixa habitual em escolaridade alta', clinicalImplication: 'Não exclui comprometimento cognitivo leve, sobretudo em pessoas muito escolarizadas.', badgeColor: 'green' },
];

export const meem: PsychiatricScale = {
  id: 'meem', name: 'Mini-Exame do Estado Mental', acronym: 'MEEM', category: 'cognition', type: 'clinician_administered',
  estimatedMinutes: 10, timeframe: 'Momento da avaliação',
  description: 'Rastreio cognitivo global em 30 pontos, com interpretação ajustada para escolaridade.',
  instructions: 'Aplique em ambiente silencioso, com óculos e aparelho auditivo se o paciente os usar. Marque cada item como correto ou incorreto. Tenha à mão lápis, relógio de pulso, uma folha em branco e a folha de estímulos.',
  licenseNote: 'Itens conforme o modelo de formulário fornecido pelo serviço. O MMSE original tem direitos autorais administrados pela PAR, Inc.: verifique as condições de uso na sua instituição.',
  subscales: [{ key: 'orientacao', label: 'Orientação', max: 10 }, { key: 'registro', label: 'Registro', max: 3 }, { key: 'atencao', label: 'Atenção e cálculo', max: 5 }, { key: 'evocacao', label: 'Evocação', max: 3 }, { key: 'linguagem', label: 'Linguagem e praxia', max: 9 }],
  minScore: 0, maxScore: 30,
  validationInfo: {
    originalAuthors: 'Folstein MF, Folstein SE, McHugh PR', year: 1975,
    brazilianValidation: 'Bertolucci PHF et al., 1994; Brucki SMD et al., 2003 (sugestões para uso no Brasil).',
    psychometrics: 'Teste-reteste de 0,89 e entre avaliadores de 0,83 no estudo original.',
  },
  about: {
    purposes: ['screening', 'monitoring'],
    objective: 'Rastrear comprometimento cognitivo e acompanhar evolução em demências e em delirium.',
    targetPopulation: 'Adultos e idosos. Aplicado por profissional treinado, em ambiente silencioso, com correção sensorial (óculos, aparelho auditivo).',
    accuracy: [
      { cutoff: '13 (analfabetos), 18 (1 a 8 anos), 26 (mais de 8 anos)', sensitivity: '82%, 76% e 80%', specificity: '97%, 96% e 95%', source: 'Bertolucci et al., 1994' },
      { cutoff: 'Medianas: 20, 25, 26,5, 28 e 29 conforme escolaridade', sensitivity: 'não se aplica', specificity: 'não se aplica', source: 'Brucki et al., 2003' },
    ],
    limitations: [
      'Forte efeito de escolaridade e idade. As medianas de Brucki são valores de referência, não pontos de corte diagnósticos.',
      'Efeito teto em pessoas escolarizadas e baixa sensibilidade para comprometimento cognitivo leve e para disfunção executiva. Nesses casos prefira o MoCA.',
      'Depressão, delirium, déficit sensorial, afasia e sedação reduzem o escore sem que haja demência.',
      'Rastreio alterado exige avaliação funcional, investigação etiológica e, se possível, avaliação neuropsicológica.',
    ],
    references: [
      'Folstein MF, Folstein SE, McHugh PR. "Mini-mental state": a practical method for grading the cognitive state of patients for the clinician. J Psychiatr Res. 1975;12(3):189-198.',
      'Bertolucci PHF, Brucki SMD, Campacci SR, Juliano Y. O Mini-Exame do Estado Mental em uma população geral: impacto da escolaridade. Arq Neuropsiquiatr. 1994;52(1):1-7.',
      'Brucki SMD, Nitrini R, Caramelli P, Bertolucci PHF, Okamoto IH. Sugestões para o uso do mini-exame do estado mental no Brasil. Arq Neuropsiquiatr. 2003;61(3B):777-781.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = sumItems(items, a);
    const edu = a.meem_edu !== undefined ? EDU[a.meem_edu] : undefined;
    const below = edu ? total < edu.ref : false;
    const cutoff: CutoffRange | undefined = edu
      ? { min: 0, max: 30, badgeColor: below ? 'orange' : 'green', severity: below ? 'Abaixo do esperado para a escolaridade' : 'Dentro do esperado para a escolaridade', clinicalImplication: '' }
      : cutoffs.find((c) => total >= c.min && total <= c.max);
    return {
      total, cutoff, subscores: sumBySubscale(items, a),
      classification: cutoff?.severity ?? 'Sem classificação',
      notes: edu ? [`Referência para "${edu.label}": ${String(edu.ref).replace('.', ',')} pontos (Brucki et al., 2003).`] : ['Informe a escolaridade para interpretação ajustada.'],
    };
  },
};
