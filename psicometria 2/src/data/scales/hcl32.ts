/** HCL-32: 32 sintomas de sim ou não, para detectar hipomania em pacientes deprimidos. */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { YES_NO } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

const texts = [
  'Preciso de menos sono.', 'Sinto-me mais cheio(a) de energia e mais ativo(a).', 'Fico mais autoconfiante.',
  'Aproveito mais o meu trabalho.', 'Fico mais sociável (faço mais telefonemas, saio mais).', 'Tenho vontade de viajar e viajo mais.',
  'Tendo a dirigir mais rápido ou a correr mais riscos ao dirigir.', 'Gasto mais dinheiro ou gasto demais.',
  'Arrisco-me mais no meu dia a dia (no trabalho, em outras atividades).', 'Fisicamente, fico mais ativo(a) (pratico mais esporte).',
  'Planejo mais atividades ou projetos.', 'Tenho mais ideias, sou mais criativo(a).', 'Fico menos tímido(a) e menos inibido(a).',
  'Uso roupas mais coloridas e mais extravagantes, e me arrumo mais.', 'Tenho vontade de encontrar ou realmente encontro mais pessoas.',
  'Fico mais interessado(a) em sexo, ou tenho mais desejo sexual.', 'Fico mais namorador(a) ou mais ativo(a) sexualmente.',
  'Falo mais.', 'Penso mais rápido.', 'Faço mais piadas ou trocadilhos enquanto falo.', 'Distraio-me mais facilmente.',
  'Envolvo-me em muitas coisas novas.', 'Meus pensamentos pulam de um assunto para outro.', 'Faço as coisas de forma mais rápida e mais fácil.',
  'Fico mais impaciente ou me irrito com mais facilidade.', 'Posso cansar ou irritar os outros.', 'Meto-me em mais brigas e discussões.',
  'Meu humor fica mais alegre, mais otimista.', 'Bebo mais café.', 'Fumo mais cigarros.', 'Bebo mais álcool.', 'Tomo mais remédios (calmantes, ansiolíticos, estimulantes).',
];
const items: ScaleItem[] = texts.map((text, i) => ({ id: `hcl_${i + 1}`, number: i + 1, text, options: YES_NO, section: 'Lembre-se de como você é ou como se sente quando está em estado de "alto astral", diferente do seu estado normal. Nesse estado...' }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 13, severity: 'Rastreio negativo', clinicalImplication: 'Abaixo do ponto de corte do estudo original. Não exclui bipolaridade: episódios de hipomania podem não ser reconhecidos pelo próprio paciente.', badgeColor: 'green' },
  { min: 14, max: 32, severity: 'Rastreio positivo', clinicalImplication: 'Sugere história de hipomania. Confirme com entrevista longitudinal e com informante: duração do episódio, mudança observável por terceiros, prejuízo ou não, e relação com antidepressivos.', badgeColor: 'orange' },
];

export const hcl32: PsychiatricScale = {
  id: 'hcl32', name: 'Checklist de Hipomania', acronym: 'HCL-32', category: 'mood', type: 'self_administered',
  estimatedMinutes: 8, timeframe: 'Ao longo da vida',
  description: 'Trinta e dois sintomas de hipomania, desenhado para identificar bipolaridade tipo II em pacientes com diagnóstico de depressão.',
  instructions: 'Pense em períodos em que você esteve em estado de "alto astral", diferente do seu jeito habitual. Marque "Sim" para as frases que descrevem como você fica nesses períodos.',
  minScore: 0, maxScore: 32,
  validationInfo: { originalAuthors: 'Angst J, Adolfsson R, Benazzi F, et al.', year: 2005, brazilianValidation: 'Soares OT, Moreno DH, Moura EC, Angst J, Moreno RA, 2010.', psychometrics: 'Consistência interna alta (alfa em torno de 0,87). Na versão brasileira, o desempenho foi adequado para diferenciar transtorno bipolar de depressão unipolar.' },
  about: {
    purposes: ['screening'],
    objective: 'Complementar o MDQ na detecção do espectro bipolar, com sensibilidade maior para o tipo II, em que o MDQ falha com frequência.',
    targetPopulation: 'Adultos com diagnóstico ou suspeita de depressão. Autoaplicável.',
    accuracy: [{ cutoff: '≥ 14', sensitivity: '80%', specificity: '51%', source: 'Angst et al., 2005' }],
    limitations: [
      'Especificidade baixa: a maioria dos positivos não tem transtorno bipolar. Serve para decidir quem investigar, nunca para diagnosticar.',
      'Falsos positivos frequentes em transtorno de personalidade borderline, TDAH, uso de estimulantes e traços de temperamento hipertímico.',
      'Não avalia duração dos episódios nem prejuízo funcional, que são critérios diagnósticos essenciais. Complete com entrevista.',
      'O questionário completo inclui perguntas sobre duração, impacto e reação de terceiros: aplique-as na entrevista.',
    ],
    references: [
      'Angst J, Adolfsson R, Benazzi F, et al. The HCL-32: towards a self-assessment tool for hypomanic symptoms in outpatients. J Affect Disord. 2005;88(2):217-233.',
      'Soares OT, Moreno DH, Moura EC, Angst J, Moreno RA. Reliability and validity of a Brazilian version of the Hypomania Checklist (HCL-32) compared to the Mood Disorder Questionnaire (MDQ). Braz J Psychiatry. 2010;32(4):416-423.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
