/** SNAP-IV (18 itens): interpretação por CONTAGEM de sintomas por domínio (6 ou mais com "Bastante" ou "Demais"). */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { graded } from '../../lib/options';
import { countAtOrAbove, sumItems } from '../../lib/scoring';

const OPT = graded(['Nem um pouco', 'Só um pouco', 'Bastante', 'Demais']);
const items: ScaleItem[] = [
  'Não consegue prestar muita atenção a detalhes ou comete erros por descuido nos trabalhos da escola ou tarefas',
  'Tem dificuldade de manter a atenção em tarefas ou atividades de lazer',
  'Parece não estar ouvindo quando se fala diretamente com ele(a)',
  'Não segue instruções até o fim e não termina deveres de escola, tarefas ou obrigações',
  'Tem dificuldade para organizar tarefas e atividades',
  'Evita, não gosta ou se envolve contra a vontade em tarefas que exigem esforço mental prolongado',
  'Perde coisas necessárias para atividades (por exemplo: brinquedos, deveres da escola, lápis ou livros)',
  'Distrai-se com estímulos externos',
  'É esquecido(a) em atividades do dia a dia',
  'Mexe com as mãos ou os pés ou se remexe na cadeira',
  'Sai do lugar na sala de aula ou em outras situações em que se espera que fique sentado(a)',
  'Corre de um lado para outro ou sobe demais nas coisas em situações em que isso é inapropriado',
  'Tem dificuldade em brincar ou envolver-se em atividades de lazer de forma calma',
  'Não para ou frequentemente está a "mil por hora"',
  'Fala em excesso',
  'Responde às perguntas de forma precipitada, antes de elas terem sido terminadas',
  'Tem dificuldade de esperar sua vez',
  'Interrompe os outros ou se intromete (por exemplo: mete-se nas conversas ou jogos)',
].map((text, i) => ({ id: `snap_${i + 1}`, number: i + 1, text, options: OPT, subscale: i < 9 ? 'desatencao' : 'hiperatividade', section: i < 9 ? 'Desatenção (itens 1 a 9)' : 'Hiperatividade e impulsividade (itens 10 a 18)' }));

const cutoffs: CutoffRange[] = [{ min: 0, max: 54, severity: 'Interpretação por contagem de sintomas', clinicalImplication: 'A soma não tem ponto de corte. Considera-se presente o sintoma marcado como "Bastante" ou "Demais": 6 ou mais em um domínio sugerem o critério A do DSM para aquele domínio.', badgeColor: 'slate' }];

export const snapiv: PsychiatricScale = {
  id: 'snapiv', name: 'SNAP-IV (18 itens de TDAH)', acronym: 'SNAP-IV', category: 'adhd', type: 'self_administered',
  estimatedMinutes: 5, timeframe: 'Comportamento habitual (últimos 6 meses)',
  description: 'Questionário para pais e professores com os 18 sintomas de TDAH do DSM, para crianças e adolescentes.',
  instructions: 'Para cada item, escolha a coluna que melhor descreve a criança ou adolescente. Responda comparando com outras crianças da mesma idade. Preenchido por pais ou professores.',
  scoreLabel: 'Soma dos 18 itens', minScore: 0, maxScore: 54,
  subscales: [{ key: 'nDes', label: 'Sintomas de desatenção presentes', max: 9 }, { key: 'nHip', label: 'Sintomas de hiperatividade e impulsividade presentes', max: 9 }, { key: 'desatencao', label: 'Soma de desatenção', max: 27 }, { key: 'hiperatividade', label: 'Soma de hiperatividade e impulsividade', max: 27 }],
  validationInfo: { originalAuthors: 'Swanson JM, Nolan W, Pelham WE', year: 1992, brazilianValidation: 'Mattos P, Serra-Pinheiro MA, Rohde LA, Pinto D, 2006.', psychometrics: 'Consistência interna alta (alfa acima de 0,90) nos estudos do MTA.' },
  about: {
    purposes: ['screening', 'monitoring'],
    objective: 'Levantar sintomas de TDAH a partir de informantes e acompanhar resposta ao tratamento.',
    targetPopulation: 'Crianças e adolescentes de 6 a 17 anos. Respondido por pais e professores, idealmente ambos.',
    limitations: ['Cobre apenas o critério A. O diagnóstico exige início antes dos 12 anos, presença em dois ou mais ambientes, prejuízo e exclusão de outras causas.', 'Baixa concordância entre pais e professores é a regra. Divergência é informação clínica, não erro.', 'Sintomas de desatenção e agitação são inespecíficos: ansiedade, humor, sono, TEA, deficiência intelectual, problemas sensoriais e adversidade psicossocial devem ser considerados.', 'Efeito halo: crianças com comportamento opositor recebem pontuações mais altas em hiperatividade.'],
    references: ['Swanson JM. School-based assessments and interventions for ADD students. Irvine: KC Publishing; 1992.', 'Mattos P, Serra-Pinheiro MA, Rohde LA, Pinto D. Apresentação de uma versão em português para uso no Brasil do instrumento MTA-SNAP-IV de avaliação de sintomas de transtorno do déficit de atenção/hiperatividade e sintomas de transtorno desafiador e de oposição. Rev Psiquiatr Rio Gd Sul. 2006;28(3):290-297.'],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const nDes = countAtOrAbove(items.slice(0, 9), a, () => 2);
    const nHip = countAtOrAbove(items.slice(9), a, () => 2);
    const d = nDes >= 6, h = nHip >= 6;
    const label = d && h ? 'Critério A sugestivo: apresentação combinada' : d ? 'Critério A sugestivo: predomínio desatento' : h ? 'Critério A sugestivo: predomínio hiperativo-impulsivo' : 'Critério A não atendido';
    return {
      total: sumItems(items, a),
      cutoff: { ...cutoffs[0], severity: label, badgeColor: d || h ? 'orange' : 'green' },
      classification: label,
      subscores: { nDes, nHip, desatencao: sumItems(items, a, (it) => it.subscale === 'desatencao'), hiperatividade: sumItems(items, a, (it) => it.subscale === 'hiperatividade') },
    };
  },
};
