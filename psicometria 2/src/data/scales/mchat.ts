/**
 * M-CHAT-R: 20 itens de sim ou não. Cada resposta ATÍPICA vale 1 ponto de risco.
 * Na maioria dos itens a resposta atípica é "Não". Nos itens 2, 5 e 12 é "Sim" (marcados como reverse).
 */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { simpleSum } from '../../lib/scoring';

// Opções na ordem do formulário. O valor é o ponto de risco do item comum.
const OPT = [{ label: 'Sim', value: 0 }, { label: 'Não', value: 1 }];
const REV = [2, 5, 12]; // itens em que "Sim" é a resposta de risco

const raw: [string, string?][] = [
  ['Se você aponta para algo do outro lado do ambiente, sua criança olha para o objeto apontado?', 'Por exemplo: se você aponta para um brinquedo ou um animal, a criança olha para o brinquedo ou para o animal?'],
  ['Você alguma vez já se perguntou se sua criança é surda?'],
  ['Sua criança brinca de faz de conta ou imagina coisas?', 'Por exemplo: finge beber de um copo vazio, finge falar ao telefone ou dar comida à boneca.'],
  ['Sua criança gosta de subir em coisas?', 'Por exemplo: em móveis, em brinquedos de parquinho ou em escadas.'],
  ['Sua criança faz movimentos incomuns com os dedos perto dos olhos?', 'Por exemplo: balança os dedos perto dos olhos.'],
  ['Sua criança aponta com um dedo para pedir alguma coisa ou para conseguir ajuda?', 'Por exemplo: aponta para um alimento ou brinquedo que está fora do seu alcance.'],
  ['Sua criança aponta com um dedo para mostrar a você algo interessante?', 'Por exemplo: aponta para um avião no céu ou para um caminhão grande na rua.'],
  ['Sua criança se interessa por outras crianças?', 'Por exemplo: observa outras crianças, sorri para elas ou vai até elas.'],
  ['Sua criança mostra objetos a você, trazendo-os ou segurando-os para que você veja, não para pedir ajuda, mas apenas para compartilhar?', 'Por exemplo: mostra uma flor, um bichinho de pelúcia ou um carrinho.'],
  ['Sua criança responde quando você a chama pelo nome?', 'Por exemplo: olha, fala ou balbucia, ou para o que está fazendo para olhar para você.'],
  ['Quando você sorri para sua criança, ela sorri de volta para você?'],
  ['Sua criança fica incomodada com barulhos do dia a dia?', 'Por exemplo: grita ou chora com barulho de aspirador de pó, música alta ou liquidificador.'],
  ['Sua criança anda sozinha?'],
  ['Sua criança olha nos seus olhos quando você está falando com ela, brincando com ela ou vestindo-a?'],
  ['Sua criança tenta imitar o que você faz?', 'Por exemplo: dar tchau, bater palmas ou fazer algum barulho engraçado.'],
  ['Se você virar a cabeça para olhar alguma coisa, sua criança olha em volta para ver o que você está olhando?'],
  ['Sua criança tenta fazer você olhar para ela?', 'Por exemplo: procura elogios, ou fala "olha" ou "olha para mim".'],
  ['Sua criança entende quando você manda fazer alguma coisa?', 'Por exemplo: se você não fizer nenhum gesto, ela entende "coloque o livro em cima da cadeira" ou "traga o cobertor"?'],
  ['Se algo novo acontece, sua criança olha para o seu rosto para ver como você se sente a respeito?', 'Por exemplo: se ouve um barulho estranho ou vê um brinquedo novo, olha para o seu rosto?'],
  ['Sua criança gosta de atividades com movimento?', 'Por exemplo: ser balançada ou pular no seu joelho.'],
];
const items: ScaleItem[] = raw.map(([text, hint], i) => ({
  id: `mchat_${i + 1}`, number: i + 1, text, hint, options: OPT, reverse: REV.includes(i + 1),
}));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 2, severity: 'Risco baixo', clinicalImplication: 'Nenhuma ação adicional, a não ser que a vigilância do desenvolvimento aponte preocupação. Se a criança tiver menos de 24 meses, repita o rastreio após os 24 meses.', badgeColor: 'green' },
  { min: 3, max: 7, severity: 'Risco médio', clinicalImplication: 'Aplique a entrevista de seguimento (M-CHAT-R/F) sobre os itens falhados. Se o escore permanecer 2 ou mais após a entrevista, encaminhe para avaliação diagnóstica e intervenção precoce.', badgeColor: 'orange' },
  { min: 8, max: 20, severity: 'Risco alto', clinicalImplication: 'Dispensa a entrevista de seguimento. Encaminhe imediatamente para avaliação diagnóstica e para intervenção precoce, sem aguardar a confirmação do diagnóstico.', badgeColor: 'red' },
];

export const mchat: PsychiatricScale = {
  id: 'mchat', name: 'Modified Checklist for Autism in Toddlers, Revised', acronym: 'M-CHAT-R', category: 'adhd', type: 'self_administered',
  estimatedMinutes: 5, timeframe: 'Comportamento habitual da criança',
  description: 'Rastreio de transtorno do espectro autista entre 16 e 30 meses, respondido pelos pais ou cuidadores.',
  instructions: 'Responda pensando em como sua criança costuma se comportar. Se você viu o comportamento poucas vezes, mas ele não é habitual, responda "Não".',
  scoreLabel: 'Pontos de risco', minScore: 0, maxScore: 20,
  licenseNote: 'Uso gratuito para fins clínicos, de pesquisa e educacionais, sem modificação dos itens (mchatscreen.com). A entrevista de seguimento (M-CHAT-R/F) é parte essencial do instrumento e não está reproduzida aqui: obtenha-a no site oficial.',
  validationInfo: { originalAuthors: 'Robins DL, Fein D, Barton M', year: 2009, brazilianValidation: 'Losapio MF, Pondé MP, 2008 (tradução da versão anterior); Castro-Souza RM, 2011.', psychometrics: 'Na validação original da versão com entrevista de seguimento, valor preditivo positivo de 47,5% para TEA e de 94,6% para algum atraso de desenvolvimento.' },
  about: {
    purposes: ['screening'],
    objective: 'Identificar precocemente crianças com risco de TEA, em consultas de puericultura. A Academia Americana de Pediatria recomenda rastreio universal aos 18 e aos 24 meses.',
    targetPopulation: 'Crianças de 16 a 30 meses. Respondido por pais ou cuidadores, com revisão do profissional.',
    accuracy: [{ cutoff: '≥ 3 (com entrevista de seguimento)', sensitivity: '85%', specificity: '99%', source: 'Robins et al., 2014 (amostra de rastreio de baixo risco)' }],
    limitations: [
      'Sem a entrevista de seguimento, a taxa de falsos positivos na faixa de risco médio é alta: a maior parte das crianças com 3 a 7 pontos não tem TEA, embora muitas tenham outro atraso.',
      'Feito para baixo risco populacional. Em amostras clínicas de alto risco o desempenho muda.',
      'Não se aplica acima de 30 meses nem a crianças com perda auditiva ou deficiência visual não corrigidas.',
      'Rastreio negativo não afasta TEA quando pais ou profissionais mantêm preocupação: a suspeita clínica prevalece sobre o instrumento.',
    ],
    references: [
      'Robins DL, Fein D, Barton M. Modified Checklist for Autism in Toddlers, Revised, with Follow-Up (M-CHAT-R/F). 2009.',
      'Robins DL, Casagrande K, Barton M, Chen CM, Dumont-Mathieu T, Fein D. Validation of the Modified Checklist for Autism in Toddlers, Revised with Follow-up (M-CHAT-R/F). Pediatrics. 2014;133(1):37-45.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    return { ...r, notes: r.total >= 3 && r.total <= 7 ? ['Faixa de risco médio: o resultado só está completo após a entrevista de seguimento (M-CHAT-R/F) sobre os itens falhados.'] : undefined };
  },
};
