/** BAF: seis provas de 0 a 3, com ilustrações dos movimentos nos itens 3 a 6. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { anchored } from '../../lib/options';
import { classify, sumItems } from '../../lib/scoring';
import luria from '../../assets/fab/luria.svg';
import conflito from '../../assets/fab/conflito.svg';
import gonogo from '../../assets/fab/gonogo.svg';
import preensao from '../../assets/fab/preensao.svg';

// A pontuação de cada prova é decrescente no original (3 a 0): aqui as âncoras são listadas de 0 a 3.
const items: ScaleItem[] = [
  {
    id: 'fab_1', number: 1, text: 'Semelhanças (conceituação)', subscale: 'conceituacao',
    hint: 'Pergunte: "Em que uma banana e uma laranja são parecidas?" Depois: "uma mesa e uma cadeira" e "uma tulipa, uma rosa e uma margarida". Só pontuam as respostas categóricas: frutas, móveis, flores. Se o paciente errar ou não responder a primeira, diga "as duas são frutas" e siga, mas não pontue esse par. Não ajude nos pares seguintes.',
    options: anchored(['Nenhuma resposta categórica correta.', 'Uma resposta correta.', 'Duas respostas corretas.', 'Três respostas corretas.']),
  },
  {
    id: 'fab_2', number: 2, text: 'Fluência lexical (flexibilidade mental)', subscale: 'flexibilidade',
    hint: 'Diga: "Fale o maior número de palavras que começam com a letra S, quaisquer palavras, menos nomes próprios e nomes de lugares". Cronometre 60 segundos. Repetições e derivações da mesma palavra (sapato, sapateiro) não contam. Se o paciente não disser nada nos primeiros 5 segundos, dê o exemplo "sapo"; se ficar 10 segundos em silêncio, estimule dizendo "qualquer palavra que comece com S".',
    options: anchored(['Menos de 3 palavras.', 'De 3 a 5 palavras.', 'De 6 a 9 palavras.', 'Mais de 9 palavras.']),
  },
  {
    id: 'fab_3', number: 3, text: 'Séries motoras de Luria (programação)', subscale: 'programacao',
    hint: 'Diga: "Olhe com atenção o que eu vou fazer". Execute a série punho, borda, palma três vezes com a mão esquerda, em silêncio. Depois diga: "agora faça junto comigo" e execute três vezes com o paciente. Por fim: "agora faça sozinho", e ele repete seis vezes seguidas com a mesma mão.',
    stimulus: { kind: 'image', src: luria, alt: 'Sequência de três posições da mão sobre a mesa: punho fechado, mão de lado apoiada na borda e palma aberta', caption: 'Série motora punho, borda, palma.', size: 'lg' },
    options: anchored([
      'Não consegue realizar três séries consecutivas nem junto com o examinador.',
      'Falha sozinho, mas realiza três séries consecutivas junto com o examinador.',
      'Realiza pelo menos três séries consecutivas sozinho.',
      'Realiza seis séries consecutivas sozinho.',
    ]),
  },
  {
    id: 'fab_4', number: 4, text: 'Instruções conflitantes (sensibilidade à interferência)', subscale: 'interferencia',
    hint: 'Diga: "Bata duas vezes quando eu bater uma vez". Para verificar o entendimento, faça a série 1-1-1. Depois: "bata uma vez quando eu bater duas vezes" e faça 2-2-2. Em seguida aplique a série de teste: 1-1-2-1-2-2-2-1-1-2. Bata na mesa, abaixo da linha de visão do paciente.',
    stimulus: { kind: 'image', src: conflito, alt: 'Quando o examinador bate uma vez na mesa, o paciente bate duas vezes; quando o examinador bate duas vezes, o paciente bate uma vez', size: 'lg' },
    options: anchored([
      'Bate como o examinador pelo menos quatro vezes consecutivas.',
      'Mais de dois erros.',
      'Um ou dois erros.',
      'Nenhum erro.',
    ]),
  },
  {
    id: 'fab_5', number: 5, text: 'Vai / não vai (controle inibitório)', subscale: 'inibitorio',
    hint: 'Diga: "Bata uma vez quando eu bater uma vez" e faça a série 1-1-1. Depois: "não bata quando eu bater duas vezes" e faça 2-2-2. Em seguida aplique a série de teste: 1-1-2-1-2-2-2-1-1-2.',
    stimulus: { kind: 'image', src: gonogo, alt: 'Quando o examinador bate uma vez, o paciente bate uma vez; quando o examinador bate duas vezes, o paciente não bate', size: 'lg' },
    options: anchored([
      'Bate como o examinador pelo menos quatro vezes consecutivas.',
      'Mais de dois erros.',
      'Um ou dois erros.',
      'Nenhum erro.',
    ]),
  },
  {
    id: 'fab_6', number: 6, text: 'Comportamento de preensão (autonomia ambiental)', subscale: 'autonomia',
    hint: 'Sente-se de frente para o paciente. Coloque as mãos dele sobre os joelhos, com as palmas para cima. Sem dizer nada e sem olhar para ele, aproxime as suas mãos e toque as palmas dele, para ver se ele as segura. Se segurar, repita dizendo: "agora não pegue minhas mãos".',
    stimulus: { kind: 'image', src: preensao, alt: 'As mãos do paciente repousam sobre os joelhos com as palmas para cima e o examinador toca essas palmas por baixo', size: 'lg' },
    options: anchored([
      'Pega as mãos do examinador mesmo depois de ser orientado a não fazê-lo.',
      'Pega as mãos sem hesitação.',
      'Hesita e pergunta o que deve fazer.',
      'Não pega as mãos do examinador.',
    ]),
  },
  {
    id: 'fab_edu', number: 7, text: 'Escolaridade (anos completos de estudo)', scored: false, optional: true,
    hint: 'Não pontua. Ajusta apenas o texto de interpretação, porque o desempenho na BAF depende fortemente da escolaridade.',
    options: [{ label: 'Até 4 anos', value: 0 }, { label: 'De 5 a 8 anos', value: 1 }, { label: 'De 9 a 11 anos', value: 2 }, { label: 'Mais de 11 anos', value: 3 }],
  },
];

const cutoffs: CutoffRange[] = [
  { min: 0, max: 8, severity: 'Disfunção executiva acentuada', clinicalImplication: 'Desempenho muito abaixo do esperado em qualquer nível de escolaridade. Investigar síndrome frontal, demência frontotemporal, demência vascular, doença de Parkinson com comprometimento cognitivo e lesões estruturais.', badgeColor: 'red' },
  { min: 9, max: 11, severity: 'Abaixo do ponto de corte clássico', clinicalImplication: 'Escore abaixo de 12, limiar proposto no estudo original. Em pessoas com baixa escolaridade esse limiar produz falsos positivos: compare com as normas brasileiras por escolaridade antes de concluir.', badgeColor: 'orange' },
  { min: 12, max: 14, severity: 'Faixa intermediária', clinicalImplication: 'Igual ou acima do corte clássico, mas abaixo da média de adultos escolarizados. Interprete junto com a escolaridade, com o rastreio cognitivo global e com a queixa funcional.', badgeColor: 'yellow' },
  { min: 15, max: 18, severity: 'Desempenho preservado', clinicalImplication: 'Faixa habitual de adultos saudáveis com escolaridade média ou alta. Não afasta disfunção executiva sutil: a BAF tem efeito teto e é pouco sensível a alterações leves.', badgeColor: 'green' },
];

export const fab: PsychiatricScale = {
  id: 'fab', name: 'Bateria de Avaliação Frontal', acronym: 'BAF (FAB)', category: 'cognition', type: 'clinician_administered',
  estimatedMinutes: 10, timeframe: 'Momento da avaliação',
  description: 'Seis provas à beira do leito para funções executivas: conceituação, flexibilidade mental, programação motora, sensibilidade à interferência, controle inibitório e autonomia ambiental.',
  instructions: 'Aplique as seis provas na ordem, cada uma valendo de 0 a 3 pontos. Tenha um cronômetro à mão para a prova de fluência. Nas provas 4 e 5, bata na mesa abaixo da linha de visão do paciente, para que ele responda ao som e não ao gesto. Garanta que o paciente entendeu cada instrução antes de iniciar a série de teste.',
  licenseNote: 'Instrumento de uso livre em ambiente clínico e de pesquisa. As ilustrações desta aplicação são esquemas próprios, feitos para orientar o examinador: não são o material original do teste. Âncoras em tradução de trabalho, com base na versão brasileira de Beato et al. (2007).',
  minScore: 0, maxScore: 18,
  subscales: [
    { key: 'conceituacao', label: 'Conceituação', max: 3 }, { key: 'flexibilidade', label: 'Flexibilidade mental', max: 3 },
    { key: 'programacao', label: 'Programação motora', max: 3 }, { key: 'interferencia', label: 'Sensibilidade à interferência', max: 3 },
    { key: 'inibitorio', label: 'Controle inibitório', max: 3 }, { key: 'autonomia', label: 'Autonomia ambiental', max: 3 },
  ],
  validationInfo: {
    originalAuthors: 'Dubois B, Slachevsky A, Litvan I, Pillon B', year: 2000,
    brazilianValidation: 'Beato RG, Nitrini R, Formigoni AP, Caramelli P, 2007 (versão brasileira); Beato R, Amaral-Carvalho V, Guimarães HC, et al., 2012 (dados normativos em controles saudáveis).',
    psychometrics: 'No estudo original, boa confiabilidade entre avaliadores (kappa de 0,87) e correlação alta com o índice de funções executivas da bateria de Mattis.',
  },
  about: {
    purposes: ['screening', 'severity', 'monitoring'],
    objective: 'Rastrear disfunção executiva à beira do leito em poucos minutos, quando a avaliação neuropsicológica formal não está disponível, e ajudar a diferenciar quadros com predomínio frontal de quadros com predomínio amnéstico.',
    targetPopulation: 'Adultos e idosos com queixa cognitiva, alteração comportamental, suspeita de demência frontotemporal, parkinsonismo ou lesão frontal. Aplicada por clínico.',
    accuracy: [
      { cutoff: '< 12 (12 a 13 na casuística original)', sensitivity: '77%', specificity: '87%', source: 'Dubois et al., 2000 (diferenciação entre demência frontal e outras demências)' },
      { cutoff: 'Depende da escolaridade', sensitivity: 'não se aplica', specificity: 'não se aplica', source: 'Beato et al., 2012 (dados normativos brasileiros por faixa de escolaridade)' },
    ],
    limitations: [
      'Efeito de escolaridade marcante: o corte de 12 gera falsos positivos em pessoas com pouca escolaridade e falsos negativos em pessoas muito escolarizadas. Use as normas brasileiras por faixa de escolaridade.',
      'Efeito teto em adultos jovens e escolarizados: não detecta disfunção executiva leve. Quando a suspeita persiste, encaminhe para avaliação neuropsicológica.',
      'Não substitui o rastreio cognitivo global. Aplique junto com MEEM ou MoCA, porque a BAF não avalia memória episódica, linguagem nem habilidades visuoespaciais.',
      'Desempenho influenciado por depressão, apatia, sedação, parkinsonismo, tremor, limitação motora das mãos, déficit auditivo e baixa compreensão das instruções.',
      'As provas 3 a 6 exigem motricidade das mãos preservada: em hemiparesia, artrose grave ou tremor intenso, registre a limitação e interprete o total com ressalva.',
    ],
    references: [
      'Dubois B, Slachevsky A, Litvan I, Pillon B. The FAB: a Frontal Assessment Battery at bedside. Neurology. 2000;55(11):1621-1626.',
      'Beato RG, Nitrini R, Formigoni AP, Caramelli P. Brazilian version of the Frontal Assessment Battery (FAB): preliminary data on administration to healthy elderly. Dement Neuropsychol. 2007;1(1):59-65.',
      'Beato R, Amaral-Carvalho V, Guimarães HC, et al. Frontal assessment battery in a Brazilian sample of healthy controls: normative data. Arq Neuropsiquiatr. 2012;70(4):278-280.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = sumItems(items, a);
    const cutoff = classify(total, cutoffs);
    const edu = a.fab_edu;
    const notes: string[] = [];
    if (total <= 11) notes.push('Abaixo do corte clássico de 12 pontos, proposto em amostra de escolaridade alta.');
    if (edu !== undefined && edu <= 1) notes.push('Escolaridade baixa ou média: nessa faixa o corte de 12 pontos superestima a disfunção executiva. Compare com os valores de referência brasileiros por anos de estudo (Beato et al., 2012) antes de concluir.');
    if (edu !== undefined && edu === 3 && total >= 12 && total <= 15) notes.push('Escolaridade alta: nessa faixa o desempenho esperado é próximo do teto, e um total nesta zona pode já representar queda em relação ao nível prévio da pessoa.');
    return { total, cutoff, classification: cutoff?.severity ?? 'Sem classificação', notes: notes.length ? notes : undefined };
  },
};
