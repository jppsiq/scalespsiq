/** MoCA item a item, com FIGURAS do formulário, subescalas por domínio, bônus de escolaridade e teto de 30 pontos. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { CORRECT } from '../../lib/options';
import visuo from '../../assets/moca/visuoespacial.png';
import nomeacao from '../../assets/moca/nomeacao.png';
import formulario from '../../assets/moca/formulario.png';
import { classify, sumBySubscale, sumItems } from '../../lib/scoring';

const V = 'Visuoespacial e executiva (5 pontos)', N = 'Nomeação (3 pontos)', M = 'Memória (sem pontuação)', AT = 'Atenção (6 pontos)', LG = 'Linguagem (3 pontos)', AB = 'Abstração (2 pontos)', EV = 'Evocação tardia (5 pontos)', OR = 'Orientação (6 pontos)';
const WORDS = ['Rosto', 'Veludo', 'Igreja', 'Margarida', 'Vermelho'];

// [texto, seção, subescala, extras]. Sem "options" nos extras = item binário correto/incorreto.
const raw: [string, string, string, Partial<ScaleItem>?][] = [
  ['Trilha alternada: 1, A, 2, B, 3, C, 4, D, 5, E', V, 'visuoespacial', { hint: 'Correto se ligar na sequência sem linhas cruzadas. Erro não corrigido de imediato pelo próprio paciente vale 0.', stimulus: { kind: 'image', src: visuo, alt: 'Trilha alternada de números e letras, cubo para cópia e espaço para desenho do relógio', caption: 'Mostre a figura ao paciente ou use o formulário impresso. O paciente desenha em papel.' } }],
  ['Cópia do cubo', V, 'visuoespacial', { hint: 'Tridimensional, todas as linhas presentes, nenhuma linha a mais, linhas relativamente paralelas e de comprimento semelhante.' }],
  ['Relógio (onze horas e dez minutos): contorno', V, 'visuoespacial', { hint: 'Círculo com pouca deformação.' }],
  ['Relógio: números', V, 'visuoespacial', { hint: 'Todos presentes, sem números a mais, na ordem e nos quadrantes corretos.' }],
  ['Relógio: ponteiros', V, 'visuoespacial', { hint: 'Dois ponteiros indicando a hora certa, o das horas claramente menor, unidos no centro.' }],
  ['Nomear: leão', N, 'nomeacao', { stimulus: { kind: 'image', src: nomeacao, alt: 'Desenhos de três animais: leão, rinoceronte e camelo', caption: 'Aponte cada animal, da esquerda para a direita.' } }],
  ['Nomear: rinoceronte', N, 'nomeacao'], ['Nomear: camelo (ou dromedário)', N, 'nomeacao'],
  ['Leitura da lista de palavras', M, 'memoria', { scored: false, optional: true, hint: `Leia: ${WORDS.join(', ')} (1 palavra por segundo). O paciente repete. Faça duas tentativas, mesmo que acerte tudo na primeira, e avise que as palavras serão pedidas de novo em 5 minutos.`, options: [{ label: 'Duas tentativas realizadas', value: 0 }] }],
  ['Dígitos em ordem direta: 2 1 8 5 4', AT, 'atencao', { hint: 'Um número por segundo.' }],
  ['Dígitos em ordem indireta: 7 4 2', AT, 'atencao', { hint: 'Resposta correta: 2 4 7.' }],
  ['Vigilância: bater com a mão a cada letra "A"', AT, 'atencao', { hint: 'F B A C M N A A J K L B A F A K D E A A A J A M O F A A B. Um erro ainda pontua. Dois erros ou mais valem 0.' }],
  ['Subtração seriada de 7 a partir de 100 (93, 86, 79, 72, 65)', AT, 'atencao', { hint: '4 ou 5 subtrações corretas = 3 pontos; 2 ou 3 = 2 pontos; 1 = 1 ponto; nenhuma = 0. Cada subtração é avaliada de forma independente.', options: [{ label: 'Nenhuma correta', value: 0 }, { label: '1 correta', value: 1 }, { label: '2 ou 3 corretas', value: 2 }, { label: '4 ou 5 corretas', value: 3 }] }],
  ['Repetir: "Eu somente sei que é João quem será ajudado hoje."', LG, 'linguagem', { hint: 'A repetição precisa ser exata.' }],
  ['Repetir: "O gato sempre se esconde embaixo do sofá quando o cachorro está na sala."', LG, 'linguagem'],
  ['Fluência verbal: palavras com a letra F em 1 minuto', LG, 'linguagem', { hint: 'Correto com 11 palavras ou mais. Não valem nomes próprios, números nem derivações da mesma palavra. Anote o total.' }],
  ['Semelhança: trem e bicicleta', AB, 'abstracao', { hint: 'Exemplo de treino, sem ponto: banana e laranja = fruta. Aceitar: meios de transporte, de viagem.' }],
  ['Semelhança: relógio e régua', AB, 'abstracao', { hint: 'Aceitar: instrumentos de medida, usados para medir.' }],
  ...WORDS.map<[string, string, string, Partial<ScaleItem>?]>((w, i) => [`Evocar sem pista: ${w}`, EV, 'evocacao', i === 0 ? { hint: 'Só pontua a evocação espontânea. Pistas de categoria e de múltipla escolha são opcionais, úteis clinicamente, e não somam pontos.' } : undefined]),
  ...['Dia do mês', 'Mês', 'Ano', 'Dia da semana', 'Lugar', 'Cidade'].map<[string, string, string]>((o) => [`Orientação: ${o.toLowerCase()}`, OR, 'orientacao']),
];

const items: ScaleItem[] = [
  ...raw.map(([text, section, subscale, extra], i) => ({ id: `moca_${i + 1}`, number: i + 1, text, section, subscale, options: CORRECT, ...extra })),
  { id: 'moca_edu', number: raw.length + 1, section: 'Ajuste', text: 'Escolaridade formal de 12 anos ou menos?', hint: 'Se sim, soma-se 1 ponto ao total (máximo de 30).', options: [{ label: 'Não', value: 0 }, { label: 'Sim (+1 ponto)', value: 1 }] },
];

const cutoffs: CutoffRange[] = [
  { min: 0, max: 9, severity: 'Comprometimento grave', clinicalImplication: 'Faixa descritiva sugerida pelos autores, sem validação robusta.', badgeColor: 'red' },
  { min: 10, max: 17, severity: 'Comprometimento moderado', clinicalImplication: 'Faixa descritiva. Avaliar funcionalidade e etiologia.', badgeColor: 'red' },
  { min: 18, max: 25, severity: 'Comprometimento leve', clinicalImplication: 'Abaixo do corte original de 26. Considerar normas brasileiras por idade e escolaridade.', badgeColor: 'orange' },
  { min: 26, max: 30, severity: 'Normal', clinicalImplication: 'Igual ou acima do ponto de corte original.', badgeColor: 'green' },
];

export const moca: PsychiatricScale = {
  id: 'moca', name: 'Montreal Cognitive Assessment', acronym: 'MoCA', category: 'cognition', type: 'clinician_administered',
  estimatedMinutes: 12, timeframe: 'Momento da avaliação',
  description: 'Rastreio de comprometimento cognitivo leve, com maior peso de funções executivas e memória que o MEEM.',
  instructions: 'Entregue ao paciente o formulário impresso (aba Imprimir e PDF, opção instrumento em branco) para a trilha, o cubo e o relógio. Marque aqui cada item como correto ou incorreto, seguindo as regras de pontuação indicadas.',
  formImage: formulario,
  subscales: [{ key: 'visuoespacial', label: 'Visuoespacial e executiva', max: 5 }, { key: 'nomeacao', label: 'Nomeação', max: 3 }, { key: 'atencao', label: 'Atenção', max: 6 }, { key: 'linguagem', label: 'Linguagem', max: 3 }, { key: 'abstracao', label: 'Abstração', max: 2 }, { key: 'evocacao', label: 'Evocação tardia', max: 5 }, { key: 'orientacao', label: 'Orientação', max: 6 }],
  licenseNote: 'Formulário e figuras: versão experimental brasileira (Sarmento, Bertolucci e Wajman, UNIFESP, 2007), © Z. Nasreddine, a partir do arquivo fornecido pelo serviço. O MoCA é protegido por direitos autorais: o uso clínico exige treinamento e certificação do aplicador, e a incorporação em aplicativos ou prontuários eletrônicos exige licença (mocacognition.com). Mantenha esta cópia para uso interno e regularize a licença antes de distribuir o programa.',
  minScore: 0, maxScore: 30,
  validationInfo: {
    originalAuthors: 'Nasreddine ZS, Phillips NA, Bédirian V, et al.', year: 2005,
    brazilianValidation: 'Sarmento ALR, 2009; Memória CM, Yassuda MS, Nakano EY, Forlenza OV, 2013; normas de Cesar KG et al., 2019.',
    psychometrics: 'Alfa de Cronbach 0,83 e teste-reteste 0,92 no estudo original.',
  },
  about: {
    purposes: ['screening'],
    objective: 'Detectar comprometimento cognitivo leve e demência inicial, em especial quando o MEEM está na faixa normal.',
    targetPopulation: 'Adultos e idosos com ao menos alguns anos de escolaridade. Aplicador treinado e certificado.',
    accuracy: [
      { cutoff: '< 26 (CCL)', sensitivity: '90%', specificity: '87%', source: 'Nasreddine et al., 2005' },
      { cutoff: '< 25 (CCL, versão brasileira)', sensitivity: '81%', specificity: '77%', source: 'Memória et al., 2013' },
    ],
    limitations: [
      'O corte de 26 gera muitos falsos positivos em baixa escolaridade. No Brasil, use normas por idade e escolaridade (Cesar et al., 2019). Para analfabetos há a versão MoCA-B.',
      'O bônus de 1 ponto não compensa de forma adequada a baixa escolaridade.',
      'Depressão, ansiedade na testagem, déficit sensorial e sedação reduzem o desempenho.',
      'As faixas de gravidade abaixo de 26 são descritivas e não substituem estadiamento funcional (ex.: CDR).',
    ],
    references: [
      'Nasreddine ZS, Phillips NA, Bédirian V, et al. The Montreal Cognitive Assessment, MoCA: a brief screening tool for mild cognitive impairment. J Am Geriatr Soc. 2005;53(4):695-699.',
      'Memória CM, Yassuda MS, Nakano EY, Forlenza OV. Brief screening for mild cognitive impairment: validation of the Brazilian version of the Montreal Cognitive Assessment. Int J Geriatr Psychiatry. 2013;28(1):34-40.',
      'Cesar KG, Yassuda MS, Porto FHG, Brucki SMD, Nitrini R. MoCA Test: normative and diagnostic accuracy data for seniors with heterogeneous educational levels in Brazil. Arq Neuropsiquiatr. 2019;77(11):775-781.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = Math.min(30, sumItems(items, a)); // teto de 30 após o bônus
    const cutoff = classify(total, cutoffs);
    return { total, cutoff, subscores: sumBySubscale(items, a), classification: cutoff?.severity ?? 'Sem classificação', notes: a.moca_edu === 1 ? ['Bônus de escolaridade (+1) aplicado.'] : undefined };
  },
};
