/**
 * TDR: a pontuação é o julgamento global de Shulman (0 a 5). Os demais itens não pontuam
 * e servem para documentar a execução e orientar o julgamento do examinador.
 */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { YES_NO } from '../../lib/options';
import { classify, sumItems } from '../../lib/scoring';
import exemplos from '../../assets/tdr/exemplos.svg';
import folha from '../../assets/tdr/folha.svg';

const CHECK = ['tdr_c1', 'tdr_c2', 'tdr_c3', 'tdr_c4', 'tdr_c5'];

const items: ScaleItem[] = [
  {
    id: 'tdr_1', number: 1, section: 'Pontuação', text: 'Pontuação global do desenho (sistema de Shulman)',
    hint: 'Julgue o desenho como um todo, comparando com os exemplos. Entregue ao paciente a folha com o círculo já impresso e diga: "Este círculo é um relógio. Coloque os números do relógio e depois desenhe os ponteiros marcando onze horas e dez minutos". Não repita a hora depois de iniciado o desenho nem dê pistas.',
    stimulus: { kind: 'image', src: exemplos, alt: 'Seis relógios desenhados que exemplificam as pontuações de 5 a 0 no sistema de Shulman', caption: 'Exemplos de referência para o julgamento global.', size: 'lg' },
    options: [
      { label: '0', value: 0, description: 'Nenhuma tentativa razoável de desenhar um relógio: rabiscos, desenho irreconhecível ou recusa.' },
      { label: '1', value: 1, description: 'Desorganização visuoespacial grave: números ausentes, repetidos, fora do círculo ou sem relação com o mostrador.' },
      { label: '2', value: 2, description: 'Desorganização visuoespacial moderada, que impede a marcação correta da hora: espaçamento muito irregular, números faltando ou aglomerados em uma parte do mostrador.' },
      { label: '3', value: 3, description: 'Representação incorreta de onze horas e dez minutos, com organização visuoespacial preservada: ponteiros apontando para o 11 e para o 10, ponteiro faltando, hora escrita por extenso.' },
      { label: '4', value: 4, description: 'Erros visuoespaciais leves, com a hora corretamente marcada: espaçamento pouco uniforme, números fora do círculo, desenho de linhas guia.' },
      { label: '5', value: 5, description: 'Relógio perfeito: os doze números na posição correta, dois ponteiros de tamanhos diferentes marcando onze horas e dez minutos.' },
    ],
  },
  { id: 'tdr_c1', number: 2, section: 'Registro da execução (não pontua)', text: 'O contorno está fechado e é aproximadamente circular?', options: YES_NO, scored: false, optional: true },
  { id: 'tdr_c2', number: 3, section: 'Registro da execução (não pontua)', text: 'Os doze números estão presentes, sem repetições nem acréscimos?', options: YES_NO, scored: false, optional: true },
  { id: 'tdr_c3', number: 4, section: 'Registro da execução (não pontua)', text: 'Os números estão na sequência e na posição corretas, distribuídos pelos quatro quadrantes?', options: YES_NO, scored: false, optional: true },
  { id: 'tdr_c4', number: 5, section: 'Registro da execução (não pontua)', text: 'Há dois ponteiros, de tamanhos diferentes, partindo do centro?', options: YES_NO, scored: false, optional: true },
  { id: 'tdr_c5', number: 6, section: 'Registro da execução (não pontua)', text: 'A hora indicada é onze horas e dez minutos?', options: YES_NO, scored: false, optional: true },
  {
    id: 'tdr_erro', number: 7, section: 'Registro da execução (não pontua)', text: 'Tipo de erro predominante', scored: false, optional: true,
    hint: 'Classificação qualitativa de Rouleau. O tipo de erro informa mais sobre o mecanismo do que a pontuação isolada.',
    options: [
      { label: 'Nenhum', value: 0 },
      { label: 'Planejamento', value: 1, description: 'Dificuldade de organizar o espaço: números que não cabem, apagamentos sucessivos, tentativas de corrigir o espaçamento.' },
      { label: 'Dependência do estímulo', value: 2, description: 'Ponteiros apontados para os algarismos ditos na instrução, o 11 e o 10, em vez da hora pedida.' },
      { label: 'Conceitual', value: 3, description: 'Perda da representação do que é um relógio ou de como ele marca a hora: ponteiros substituídos por palavras, hora escrita por extenso, mostrador sem função.' },
      { label: 'Perseveração', value: 4, description: 'Continuação da sequência além do 12, repetição de números ou de ponteiros.' },
      { label: 'Negligência espacial', value: 5, description: 'Números concentrados em um dos lados do mostrador, em geral à direita, com o hemicampo esquerdo vazio.' },
    ],
  },
  {
    id: 'tdr_copia', number: 8, section: 'Registro da execução (não pontua)', text: 'Cópia de um relógio modelo, quando aplicada', scored: false, optional: true,
    hint: 'Depois do desenho por comando, mostre um relógio já desenhado marcando onze horas e dez minutos e peça que o paciente copie. A comparação entre as duas condições ajuda a separar mecanismos.',
    options: [
      { label: 'Não aplicada', value: 0 },
      { label: 'Cópia preservada', value: 1 },
      { label: 'Cópia também alterada', value: 2 },
    ],
  },
];

const cutoffs: CutoffRange[] = [
  { min: 0, max: 1, severity: 'Desorganização grave', clinicalImplication: 'Comprometimento evidente. Prossiga com avaliação cognitiva ampla, avaliação funcional e investigação etiológica, incluindo neuroimagem.', badgeColor: 'red' },
  { min: 2, max: 3, severity: 'Teste alterado', clinicalImplication: 'Escore igual ou inferior a 3 é o limiar mais usado para considerar o desenho alterado. Combine com rastreio cognitivo global e com escala funcional antes de concluir.', badgeColor: 'orange' },
  { min: 4, max: 5, severity: 'Dentro do esperado', clinicalImplication: 'Desempenho compatível com a normalidade. O teste tem baixa sensibilidade para comprometimento cognitivo leve: um desenho normal não afasta declínio inicial.', badgeColor: 'green' },
];

export const tdr: PsychiatricScale = {
  id: 'tdr', name: 'Teste do Desenho do Relógio', acronym: 'TDR', category: 'cognition', type: 'clinician_administered',
  estimatedMinutes: 5, timeframe: 'Momento da avaliação',
  description: 'Rastreio cognitivo breve que integra compreensão verbal, memória semântica, planejamento, organização visuoespacial e execução motora.',
  instructions: 'Imprima a folha de aplicação, que já traz o círculo. Entregue-a ao paciente com um lápis e diga: "Este círculo é um relógio. Coloque os números do relógio e depois desenhe os ponteiros marcando onze horas e dez minutos". Repita a instrução uma vez, se necessário, antes de o paciente começar. Não interfira durante a execução e não dê pistas. Corrija déficits sensoriais antes de aplicar.',
  formImage: folha,
  licenseNote: 'Teste de domínio público, com vários sistemas de pontuação publicados. Esta aplicação usa o julgamento global de 0 a 5 de Shulman. Registre sempre qual sistema foi usado, porque os escores não são comparáveis entre si. A folha e os exemplos são desenhos próprios desta aplicação.',
  minScore: 0, maxScore: 5,
  validationInfo: {
    originalAuthors: 'Shulman KI, Shedletsky R, Silver IL (sistema de pontuação em 6 pontos)', year: 1986,
    brazilianValidation: 'Atalaia-Silva KC, Lourenço RA, 2008 (tradução, adaptação e validação de construto em idosos brasileiros).',
    psychometrics: 'Confiabilidade entre avaliadores alta na maioria dos sistemas de pontuação (coeficientes acima de 0,80 na revisão de Shulman, 2000).',
  },
  about: {
    purposes: ['screening'],
    objective: 'Rastrear comprometimento cognitivo em poucos minutos, com boa aceitação pelo paciente. É especialmente sensível a alterações de planejamento e de organização visuoespacial, pouco avaliadas pelo MEEM.',
    targetPopulation: 'Adultos e idosos com queixa cognitiva, em atenção primária, ambulatório, enfermaria e emergência. Exige visão corrigida e motricidade da mão preservada.',
    accuracy: [{ cutoff: 'Varia conforme o sistema (≤ 3 no sistema de Shulman)', sensitivity: '≈ 85%', specificity: '≈ 85%', source: 'Shulman, 2000 (revisão dos principais sistemas de pontuação para demência)' }],
    limitations: [
      'Existem mais de dez sistemas de pontuação, com faixas e pontos de corte diferentes. Sem registrar qual foi usado, o escore é ininterpretável em outra consulta ou em outro serviço.',
      'Efeito de escolaridade importante: pessoas com pouca escolaridade e pouca familiaridade com relógio analógico erram por motivos que não são cognitivos. Pergunte antes se a pessoa usa ou já usou relógio de ponteiros.',
      'Sensibilidade baixa para comprometimento cognitivo leve e para demência inicial. Um relógio normal não afasta declínio.',
      'Não avalia memória episódica nem linguagem: use com MEEM ou MoCA, e não isoladamente. O MoCA já inclui o relógio, valendo 3 pontos.',
      'Tremor, hemiparesia, artrose, baixa visão e apraxia motora reduzem a pontuação sem indicar demência. Registre a limitação em vez de pontuar o desenho.',
      'O tipo de erro costuma ser mais informativo que o escore: dependência do estímulo e perseveração apontam disfunção executiva, erro conceitual aponta comprometimento semântico e a concentração dos números em um lado do mostrador levanta a hipótese de negligência espacial.',
    ],
    references: [
      'Shulman KI, Shedletsky R, Silver IL. The challenge of time: clock-drawing and cognitive function in the elderly. Int J Geriatr Psychiatry. 1986;1(2):135-140.',
      'Shulman KI. Clock-drawing: is it the ideal cognitive screening test? Int J Geriatr Psychiatry. 2000;15(6):548-561.',
      'Rouleau I, Salmon DP, Butters N, Kennedy C, McGuire K. Quantitative and qualitative analyses of clock drawings in Alzheimer’s and Huntington’s disease. Brain Cogn. 1992;18(1):70-87.',
      'Atalaia-Silva KC, Lourenço RA. Tradução, adaptação e validação de construto do Teste do Relógio aplicado entre idosos no Brasil. Rev Saude Publica. 2008;42(5):930-937.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = sumItems(items, a);
    const cutoff = classify(total, cutoffs);
    const respondidos = CHECK.filter((k) => a[k] !== undefined).length;
    const notes: string[] = [];
    if (respondidos) notes.push(`Elementos preservados no registro da execução: ${CHECK.filter((k) => a[k] === 1).length} de ${respondidos} avaliados.`);
    if (a.tdr_copia === 1) notes.push('Cópia preservada com desenho por comando alterado: padrão que sugere déficit de planejamento e de execução, mais que déficit visuoespacial primário.');
    if (a.tdr_copia === 2) notes.push('Cópia também alterada: sugere componente visuoespacial ou práxico, além do executivo.');
    if (a.tdr_erro === 5) notes.push('Números concentrados em um dos lados do mostrador: investigue negligência espacial e lesão do hemisfério direito.');
    return { total, cutoff, classification: cutoff?.severity ?? 'Sem classificação', notes: notes.length ? notes : undefined };
  },
};
