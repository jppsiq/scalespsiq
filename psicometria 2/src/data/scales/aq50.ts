/**
 * AQ-50: quatro opções de concordância. Em metade dos itens pontua concordar; na outra metade, discordar.
 * Os itens de discordância são marcados com reverse, que inverte o valor 0/1 das opções.
 */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { simpleSum, sumItems } from '../../lib/scoring';

const OPT = [
  { label: 'Concordo totalmente', value: 1 }, { label: 'Concordo parcialmente', value: 1 },
  { label: 'Discordo parcialmente', value: 0 }, { label: 'Discordo totalmente', value: 0 },
];
// Itens em que a pontuação vem de DISCORDAR (lista do artigo original).
const REV = [1, 3, 8, 10, 11, 14, 15, 17, 24, 25, 27, 28, 29, 30, 31, 32, 34, 36, 37, 38, 40, 44, 47, 48, 49, 50];
const DOM: Record<string, number[]> = {
  social: [1, 11, 13, 15, 22, 36, 44, 45, 47, 48],
  atencao: [2, 4, 10, 16, 25, 32, 34, 37, 43, 46],
  detalhe: [5, 6, 9, 12, 19, 23, 28, 29, 30, 49],
  comunicacao: [7, 17, 18, 26, 27, 31, 33, 35, 38, 39],
  imaginacao: [3, 8, 14, 20, 21, 24, 40, 41, 42, 50],
};
const domOf = (n: number) => Object.keys(DOM).find((k) => DOM[k].includes(n))!;

const texts = [
  'Prefiro fazer as coisas com outras pessoas a fazê-las sozinho(a).',
  'Prefiro fazer as coisas sempre da mesma maneira.',
  'Se tento imaginar alguma coisa, acho muito fácil criar uma imagem na minha cabeça.',
  'Com frequência me envolvo tanto numa coisa que perco de vista as outras.',
  'Com frequência percebo sons suaves que os outros não notam.',
  'Costumo reparar em placas de carro ou em sequências de números semelhantes.',
  'Outras pessoas frequentemente me dizem que o que eu falei foi indelicado, mesmo quando penso que foi educado.',
  'Quando leio uma história, consigo facilmente imaginar como os personagens poderiam ser.',
  'Sou fascinado(a) por datas.',
  'Num grupo, consigo acompanhar com facilidade a conversa de várias pessoas diferentes.',
  'Acho que situações sociais são fáceis.',
  'Costumo reparar em detalhes que os outros não percebem.',
  'Eu preferiria ir a uma biblioteca do que a uma festa.',
  'Acho fácil inventar histórias.',
  'Sinto-me mais atraído(a) por pessoas do que por coisas.',
  'Costumo ter interesses muito fortes e fico chateado(a) se não posso me dedicar a eles.',
  'Gosto de conversa fiada, de bate-papo social.',
  'Quando falo, nem sempre é fácil para os outros conseguirem dizer alguma coisa.',
  'Sou fascinado(a) por números.',
  'Quando leio uma história, acho difícil entender as intenções dos personagens.',
  'Não gosto especialmente de ler ficção.',
  'Acho difícil fazer novos amigos.',
  'Percebo padrões nas coisas o tempo todo.',
  'Prefiro ir ao teatro do que a um museu.',
  'Não fico chateado(a) se minha rotina diária é alterada.',
  'Com frequência percebo que não sei como manter uma conversa.',
  'Acho fácil "ler nas entrelinhas" quando alguém está falando comigo.',
  'Geralmente me concentro mais no quadro geral do que nos pequenos detalhes.',
  'Não sou muito bom(boa) em lembrar números de telefone.',
  'Geralmente não percebo pequenas mudanças numa situação ou na aparência de uma pessoa.',
  'Sei quando a pessoa que me escuta está ficando entediada.',
  'Acho fácil fazer mais de uma coisa ao mesmo tempo.',
  'Quando falo ao telefone, não tenho certeza de quando é a minha vez de falar.',
  'Gosto de fazer coisas de forma espontânea.',
  'Com frequência sou o(a) último(a) a entender a graça de uma piada.',
  'Acho fácil perceber o que alguém está pensando ou sentindo apenas olhando para o rosto da pessoa.',
  'Se houver uma interrupção, consigo voltar rapidamente ao que estava fazendo.',
  'Sou bom(boa) em bate-papo social.',
  'As pessoas com frequência me dizem que falo sempre a mesma coisa.',
  'Quando era criança, gostava de brincar de faz de conta com outras crianças.',
  'Gosto de colecionar informações sobre categorias de coisas (por exemplo, tipos de carro, de pássaro, de trem, de planta).',
  'Acho difícil imaginar como seria ser outra pessoa.',
  'Gosto de planejar com cuidado qualquer atividade de que participe.',
  'Gosto de ocasiões sociais.',
  'Acho difícil perceber as intenções das pessoas.',
  'Situações novas me deixam ansioso(a).',
  'Gosto de conhecer pessoas novas.',
  'Sou uma pessoa diplomática.',
  'Não sou muito bom(boa) em lembrar a data de aniversário das pessoas.',
  'Acho muito fácil brincar de faz de conta com crianças.',
];
const items: ScaleItem[] = texts.map((text, i) => ({
  id: `aq_${i + 1}`, number: i + 1, text, options: OPT, reverse: REV.includes(i + 1), subscale: domOf(i + 1),
}));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 25, severity: 'Abaixo da média populacional', clinicalImplication: 'Poucos traços autísticos relatados.', badgeColor: 'green' },
  { min: 26, max: 31, severity: 'Traços acima da média', clinicalImplication: 'Faixa intermediária. Alguns serviços adotam 26 como corte de triagem por sua maior sensibilidade.', badgeColor: 'yellow' },
  { min: 32, max: 50, severity: 'Rastreio positivo', clinicalImplication: 'Escore ≥ 32, corte proposto no estudo original. Indica avaliação diagnóstica estruturada com história do desenvolvimento e informante que conheça a infância.', badgeColor: 'orange' },
];

export const aq50: PsychiatricScale = {
  id: 'aq50', name: 'Quociente do Espectro Autista', acronym: 'AQ-50', category: 'adhd', type: 'self_administered',
  estimatedMinutes: 15, timeframe: 'Características habituais',
  description: 'Cinquenta afirmações sobre traços autísticos em adultos, distribuídas em cinco domínios.',
  instructions: 'Leia cada afirmação e marque o quanto ela combina com você. Responda a todas, mesmo que alguma pareça difícil de decidir.',
  minScore: 0, maxScore: 50,
  subscales: [
    { key: 'social', label: 'Habilidade social', max: 10 }, { key: 'atencao', label: 'Mudança de atenção', max: 10 },
    { key: 'detalhe', label: 'Atenção a detalhes', max: 10 }, { key: 'comunicacao', label: 'Comunicação', max: 10 },
    { key: 'imaginacao', label: 'Imaginação', max: 10 },
  ],
  licenseNote: 'Uso livre para fins clínicos e de pesquisa sem fins lucrativos (Autism Research Centre, Cambridge). Itens em tradução de trabalho: para pesquisa, utilize a versão brasileira publicada.',
  validationInfo: { originalAuthors: 'Baron-Cohen S, Wheelwright S, Skinner R, Martin J, Clubley E', year: 2001, brazilianValidation: 'Egito JHT, Ferreira GMR, Gonçalves MI, Osório AAC, 2018 (propriedades psicométricas da versão brasileira).', psychometrics: 'No estudo original, 80% dos adultos com síndrome de Asperger ou autismo de alto funcionamento pontuaram 32 ou mais, contra 2% dos controles.' },
  about: {
    purposes: ['screening'],
    objective: 'Quantificar traços do espectro autista em adultos com inteligência preservada e selecionar quem deve seguir para avaliação diagnóstica.',
    targetPopulation: 'Adultos com QI na faixa normal. Autoaplicável.',
    accuracy: [{ cutoff: '≥ 32', sensitivity: '≈ 80%', specificity: '≈ 98%', source: 'Baron-Cohen et al., 2001' }],
    limitations: [
      'Não é diagnóstico. O diagnóstico de TEA exige história do neurodesenvolvimento desde a primeira infância, preferencialmente com informante, e instrumentos como ADOS-2 e ADI-R.',
      'Escore elevado ocorre também em ansiedade social, esquizoidia, esquizotipia, TOC e depressão. Em mulheres adultas a camuflagem social reduz a pontuação e produz falsos negativos.',
      'Depende de insight e de boa capacidade de autoobservação.',
      'Os cinco domínios têm consistência interna modesta: use o escore total, não o perfil por domínio, para decisão clínica.',
    ],
    references: [
      'Baron-Cohen S, Wheelwright S, Skinner R, Martin J, Clubley E. The Autism-Spectrum Quotient (AQ): evidence from Asperger syndrome/high-functioning autism, males and females, scientists and mathematicians. J Autism Dev Disord. 2001;31(1):5-17.',
      'Egito JHT, Ferreira GMR, Gonçalves MI, Osório AAC. Brief report: Factor analysis of the Brazilian version of the Adult Autism Spectrum Quotient. J Autism Dev Disord. 2018;48(5):1847-1853.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    return { ...r, subscores: Object.fromEntries(Object.keys(DOM).map((k) => [k, sumItems(items, a, (it) => it.subscale === k)])) };
  },
};
