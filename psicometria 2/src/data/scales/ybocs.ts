import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { graded } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';
import { ANCHOR_NOTE } from './_shared';

const dims: [string, string[], string][] = [
  ['Tempo ocupado', ['Nenhum', 'Menos de 1 h/dia', '1 a 3 h/dia', '3 a 8 h/dia', 'Mais de 8 h/dia'], 'Quanto do seu tempo é ocupado por elas? Com que frequência ocorrem?'],
  ['Interferência no funcionamento', ['Nenhuma', 'Leve', 'Moderada, controlável', 'Grave', 'Incapacitante'], 'Quanto elas interferem na sua vida social, no trabalho ou no estudo? Há algo que você deixa de fazer por causa delas?'],
  ['Sofrimento associado', ['Nenhum', 'Leve', 'Moderado, tolerável', 'Grave', 'Quase constante e incapacitante'], 'Quanto sofrimento ou ansiedade elas causam? (Nas compulsões: como se sentiria se fosse impedido de realizá-las?)'],
  ['Resistência', ['Sempre resiste', 'Resiste quase sempre', 'Faz algum esforço', 'Cede quase sempre', 'Cede completamente'], 'Quanto esforço você faz para resistir a elas? Pontue o esforço, não o sucesso.'],
  ['Grau de controle', ['Controle total', 'Bom controle', 'Controle moderado', 'Pouco controle', 'Nenhum controle'], 'Quanto controle você tem sobre elas? Consegue interrompê-las ou desviar a atenção?'],
];
const mk = (kind: 'obsessoes' | 'compulsoes', label: string, offset: number): ScaleItem[] =>
  dims.map(([d, labels, hint], i) => ({ hint, id: `ybocs_${offset + i + 1}`, number: offset + i + 1, text: `${d}: ${label}`, subscale: kind, section: kind === 'obsessoes' ? 'Obsessões (itens 1 a 5)' : 'Compulsões (itens 6 a 10)', options: graded(labels) }));
const items = [...mk('obsessoes', 'obsessões', 0), ...mk('compulsoes', 'compulsões', 5)];

const cutoffs: CutoffRange[] = [
  { min: 0, max: 7, severity: 'Subclínico', clinicalImplication: 'Sintomas mínimos.', badgeColor: 'green' },
  { min: 8, max: 15, severity: 'Leve', clinicalImplication: 'Sintomas leves.', badgeColor: 'yellow' },
  { min: 16, max: 23, severity: 'Moderado', clinicalImplication: 'Escore ≥ 16 é critério de entrada habitual em ensaios clínicos.', badgeColor: 'orange' },
  { min: 24, max: 31, severity: 'Grave', clinicalImplication: 'Tratamento combinado e avaliação de refratariedade.', badgeColor: 'red' },
  { min: 32, max: 40, severity: 'Extremo', clinicalImplication: 'Incapacitação importante. Considerar estratégias para TOC resistente.', badgeColor: 'red' },
];

export const ybocs: PsychiatricScale = {
  id: 'ybocs', name: 'Yale-Brown Obsessive Compulsive Scale', acronym: 'Y-BOCS', category: 'anxiety', type: 'clinician_administered',
  estimatedMinutes: 30, timeframe: 'Última semana',
  description: 'Gravidade do TOC independentemente do conteúdo dos sintomas, em subescalas de obsessões e compulsões.',
  instructions: 'Aplique antes a lista de sintomas (checklist) para definir as obsessões e compulsões-alvo. Em seguida pontue os 10 itens de gravidade considerando a média da última semana.',
  licenseNote: ANCHOR_NOTE, minScore: 0, maxScore: 40,
  subscales: [{ key: 'obsessoes', label: 'Obsessões', max: 20 }, { key: 'compulsoes', label: 'Compulsões', max: 20 }],
  validationInfo: {
    originalAuthors: 'Goodman WK, Price LH, Rasmussen SA, et al.', year: 1989,
    brazilianValidation: 'Tradução de Asbahr FR, Lotufo Neto F, Turecki GX, et al., 1992.',
    psychometrics: 'Confiabilidade entre avaliadores de 0,98 e consistência interna de 0,89 no estudo original.',
  },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Medir gravidade do TOC e resposta: redução ≥ 35% costuma definir resposta e escore ≤ 12, remissão.',
    targetPopulation: 'Pacientes com TOC diagnosticado. Entrevista semiestruturada por clínico treinado.',
    limitations: [
      'Não diagnostica TOC. Não pontua evitação, insight nem lentidão, que são itens auxiliares da escala completa.',
      'Pacientes com predomínio de obsessões ou de compulsões têm teto de 20 pontos e podem parecer menos graves.',
      'Resistência baixa pode refletir tanto gravidade quanto estratégia terapêutica (não resistir em exposição), o que confunde a pontuação.',
    ],
    references: [
      'Goodman WK, Price LH, Rasmussen SA, et al. The Yale-Brown Obsessive Compulsive Scale. I. Development, use, and reliability. Arch Gen Psychiatry. 1989;46(11):1006-1011.',
      'Asbahr FR, Lotufo Neto F, Turecki GX, et al. Escala Yale-Brown de sintomas obsessivo-compulsivos (tradução brasileira). 1992.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
