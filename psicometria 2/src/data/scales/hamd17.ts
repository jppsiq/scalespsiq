import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { anchored } from '../../lib/options';
import { simpleSum, triggeredRedFlags, SUICIDE_PROTOCOL } from '../../lib/scoring';

// [nome, âncoras de 0 até o máximo do item]. Texto de domínio público (Hamilton, 1960), em tradução de trabalho.
const raw: [string, string[]][] = [
  ['Humor deprimido (tristeza, desesperança, desamparo, inutilidade)', ['Ausente.', 'Sentimentos relatados apenas ao ser inquirido.', 'Sentimentos relatados espontaneamente com palavras.', 'Comunica os sentimentos de forma não verbal: expressão facial, postura, voz, tendência ao choro.', 'Relata virtualmente apenas esses sentimentos, de forma verbal e não verbal.']],
  ['Sentimentos de culpa', ['Ausentes.', 'Autorrecriminação: sente que decepcionou os outros.', 'Ideias de culpa ou ruminação sobre erros e más ações do passado.', 'A doença atual é um castigo. Delírio de culpa.', 'Ouve vozes de acusação ou denúncia e/ou tem alucinações visuais ameaçadoras.']],
  ['Suicídio', ['Ausente.', 'Sente que a vida não vale a pena.', 'Desejaria estar morto ou pensa na possibilidade da própria morte.', 'Ideias ou gestos suicidas.', 'Tentativa de suicídio (qualquer tentativa séria).']],
  ['Insônia inicial', ['Sem dificuldade para conciliar o sono.', 'Queixa de dificuldade ocasional para conciliar o sono (mais de meia hora).', 'Queixa de dificuldade para conciliar o sono todas as noites.']],
  ['Insônia intermediária', ['Sem dificuldade.', 'Queixa-se de inquietude e perturbação durante a noite.', 'Acorda durante a noite. Qualquer saída da cama pontua 2, exceto para urinar.']],
  ['Insônia tardia', ['Sem dificuldade.', 'Acorda de madrugada, mas volta a dormir.', 'Incapaz de voltar a dormir se deixar a cama.']],
  ['Trabalho e atividades', ['Sem dificuldade.', 'Pensamentos e sentimentos de incapacidade, fadiga ou fraqueza relacionados a atividades, trabalho ou passatempos.', 'Perda de interesse por atividades, passatempos ou trabalho, relatada diretamente ou percebida por desatenção, indecisão e vacilação (sente que precisa se esforçar para agir).', 'Diminuição do tempo gasto em atividades ou queda de produtividade.', 'Parou de trabalhar por causa da doença atual.']],
  ['Retardo (lentidão de pensamento e fala, dificuldade de concentração, atividade motora diminuída)', ['Pensamento e fala normais.', 'Leve retardo durante a entrevista.', 'Retardo óbvio durante a entrevista.', 'Entrevista difícil.', 'Estupor completo.']],
  ['Agitação', ['Nenhuma.', 'Inquietude.', 'Brinca com as mãos, com os cabelos etc.', 'Mexe-se, não consegue ficar sentado quieto.', 'Torce as mãos, rói as unhas, puxa os cabelos, morde os lábios.']],
  ['Ansiedade psíquica', ['Sem dificuldade.', 'Tensão e irritabilidade subjetivas.', 'Preocupação com trivialidades.', 'Atitude apreensiva aparente no rosto ou na fala.', 'Medos expressos sem serem inquiridos.']],
  ['Ansiedade somática (boca seca, flatulência, indigestão, diarreia, cólicas, eructação; palpitações, cefaleia; hiperventilação, suspiros; frequência urinária; sudorese)', ['Ausente.', 'Leve.', 'Moderada.', 'Grave.', 'Incapacitante.']],
  ['Sintomas somáticos gastrointestinais', ['Nenhum.', 'Perda de apetite, mas alimenta-se sem insistência de terceiros. Sensação de peso no abdome.', 'Dificuldade de comer se não insistirem. Solicita ou exige laxativos ou medicação para sintomas digestivos.']],
  ['Sintomas somáticos gerais', ['Nenhum.', 'Peso nos membros, costas ou cabeça. Dores nas costas, cefaleia, mialgias. Perda de energia e cansaço.', 'Qualquer sintoma bem caracterizado e nítido.']],
  ['Sintomas genitais (perda de libido, distúrbios menstruais)', ['Ausentes.', 'Leves.', 'Intensos.']],
  ['Hipocondria', ['Ausente.', 'Auto-observação aumentada (com relação ao corpo).', 'Preocupação com a saúde.', 'Queixas frequentes, pedidos de ajuda etc.', 'Delírios hipocondríacos.']],
  ['Perda de peso (pela história)', ['Sem perda de peso.', 'Provável perda de peso associada à doença atual.', 'Perda de peso definida, segundo o paciente.']],
  ['Consciência da doença (insight)', ['Reconhece que está deprimido e doente.', 'Reconhece a doença, mas a atribui a má alimentação, clima, excesso de trabalho, vírus, necessidade de repouso etc.', 'Nega estar doente.']],
];

const items: ScaleItem[] = raw.map(([text, anchors], i) => ({
  id: `hamd_${i + 1}`, number: i + 1, text, options: anchored(anchors),
  ...(i === 2 ? { isRedFlagTrigger: true, redFlagThreshold: 2 } : {}),
}));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 7, severity: 'Sem depressão / remissão', clinicalImplication: 'Escore ≤ 7 é o critério de remissão mais usado em ensaios clínicos.', badgeColor: 'green' },
  { min: 8, max: 16, severity: 'Depressão leve', clinicalImplication: 'Sintomas presentes com impacto limitado.', badgeColor: 'yellow' },
  { min: 17, max: 23, severity: 'Depressão moderada', clinicalImplication: 'Faixa de inclusão habitual de ensaios com antidepressivos.', badgeColor: 'orange' },
  { min: 24, max: 52, severity: 'Depressão grave', clinicalImplication: 'Avaliar risco, sintomas psicóticos e necessidade de tratamento intensivo.', badgeColor: 'red' },
];

export const hamd17: PsychiatricScale = {
  id: 'hamd17', name: 'Hamilton Depression Rating Scale (17 itens)', acronym: 'HAM-D 17', category: 'mood', type: 'clinician_administered',
  estimatedMinutes: 20, timeframe: 'Última semana',
  description: 'Escala de gravidade de depressão aplicada por entrevista. Padrão histórico de ensaios clínicos.',
  instructions: 'Pontue cada item com base em entrevista clínica, considerando a última semana. Recomenda-se o guia de entrevista estruturada (SIGH-D).',
  licenseNote: 'Âncoras completas, em tradução de trabalho do texto original de Hamilton (domínio público). Para pesquisa, use a versão brasileira publicada e o guia de entrevista estruturada.', minScore: 0, maxScore: 52,
  validationInfo: {
    originalAuthors: 'Hamilton M', year: 1960,
    brazilianValidation: 'Moreno RA, Moreno DH, 1998 (versão em português); Freire MA et al., 2014 (versão com entrevista estruturada).',
    psychometrics: 'Confiabilidade entre avaliadores de 0,80 a 0,98 quando se usa entrevista estruturada (Bagby et al., 2004).',
  },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Quantificar a gravidade do episódio depressivo já diagnosticado e medir resposta (redução ≥ 50%) e remissão (≤ 7).',
    targetPopulation: 'Adultos com diagnóstico de depressão. Heteroaplicável por clínico treinado.',
    limitations: [
      'Não é instrumento diagnóstico nem de rastreio.',
      'Peso excessivo de insônia, ansiedade e sintomas somáticos. Sintomas atípicos (hipersonia, hiperfagia) não pontuam.',
      'Favorece fármacos sedativos e ansiolíticos na medida de resposta. A MADRS é mais sensível à mudança do núcleo depressivo.',
      'Faixas de gravidade são convenções (Zimmerman et al., 2013) e variam entre autores.',
    ],
    references: [
      'Hamilton M. A rating scale for depression. J Neurol Neurosurg Psychiatry. 1960;23:56-62.',
      'Zimmerman M, Martinez JH, Young D, Chelminski I, Dalrymple K. Severity classification on the Hamilton Depression Rating Scale. J Affect Disord. 2013;150(2):384-388.',
      'Bagby RM, Ryder AG, Schuller DR, Marshall MB. The Hamilton Depression Rating Scale: has the gold standard become a lead weight? Am J Psychiatry. 2004;161(12):2163-2177.',
      'Moreno RA, Moreno DH. Escalas de depressão de Montgomery & Åsberg (MADRS) e de Hamilton (HAM-D). Rev Psiquiatr Clin. 1998;25(5):262-272.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    const flag = triggeredRedFlags(items, a).length > 0;
    return { ...r, clinicalAlert: flag ? `Item 3 (suicídio) com pontuação ≥ 2. ${SUICIDE_PROTOCOL}` : undefined };
  },
};
