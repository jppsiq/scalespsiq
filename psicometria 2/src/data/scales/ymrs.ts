/** YMRS: itens 5, 6, 8 e 9 têm PESO DUPLO (0, 2, 4, 6, 8), resolvido na própria camada de dados via graded(..., 0, 2). */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { anchored } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

// [nome, peso duplo?, âncoras]. Tradução de trabalho. A versão brasileira validada é a de Vilela et al., 2005.
const raw: [string, boolean, string[]][] = [
  ['Humor elevado', false, ['Ausente.', 'Leve ou possivelmente aumentado, quando questionado.', 'Elevação subjetiva definida: otimista, autoconfiante, alegre, apropriado ao conteúdo.', 'Elevado, inapropriado ao conteúdo. Jocoso.', 'Eufórico. Risos inapropriados. Cantando.']],
  ['Atividade motora e energia aumentadas', false, ['Ausente.', 'Subjetivamente aumentada.', 'Animado. Gestos aumentados.', 'Energia excessiva. Hiperativo às vezes. Inquieto (pode ser acalmado).', 'Excitação motora. Hiperatividade contínua (não pode ser acalmado).']],
  ['Interesse sexual', false, ['Normal, não aumentado.', 'Leve ou possivelmente aumentado.', 'Aumento subjetivo definido, quando questionado.', 'Conteúdo sexual espontâneo. Discorre sobre temas sexuais. Hipersexualidade pelo próprio relato.', 'Atos sexuais manifestos (dirigidos a pacientes, equipe ou entrevistador).']],
  ['Sono', false, ['Não relata diminuição do sono.', 'Dorme até 1 hora a menos que o habitual.', 'Dorme mais de 1 hora a menos que o habitual.', 'Relata necessidade diminuída de sono.', 'Nega necessidade de sono.']],
  ['Irritabilidade', true, ['Ausente.', 'Subjetivamente aumentada.', 'Irritável às vezes durante a entrevista. Episódios recentes de raiva ou aborrecimento na enfermaria.', 'Frequentemente irritável durante a entrevista. Ríspido, lacônico.', 'Hostil, não cooperativo. Entrevista impossível.']],
  ['Fala (velocidade e quantidade)', true, ['Sem aumento.', 'Sente-se falante.', 'Velocidade ou quantidade aumentadas às vezes. Prolixo às vezes.', 'Pressão de fala. Velocidade e quantidade consistentemente aumentadas. Difícil de interromper.', 'Fala pressionada, contínua, impossível de interromper.']],
  ['Linguagem e distúrbio do pensamento', false, ['Ausente.', 'Circunstancial. Leve distraibilidade. Pensamentos rápidos.', 'Distraível. Perde o fio. Muda de assunto com frequência. Pensamentos acelerados.', 'Fuga de ideias. Tangencialidade. Difícil de acompanhar. Rimas, ecolalia.', 'Incoerente. Comunicação impossível.']],
  ['Conteúdo do pensamento', true, ['Normal.', 'Planos questionáveis, novos interesses.', 'Projetos especiais. Hiper-religiosidade.', 'Ideias grandiosas ou paranoides. Ideias de referência.', 'Delírios. Alucinações.']],
  ['Comportamento disruptivo ou agressivo', true, ['Ausente, cooperativo.', 'Sarcástico. Fala alto às vezes, defensivo.', 'Exigente. Faz ameaças na enfermaria.', 'Ameaça o entrevistador. Grita. Entrevista difícil.', 'Agressivo, destrutivo. Entrevista impossível.']],
  ['Aparência', false, ['Vestimenta e cuidados apropriados.', 'Minimamente descuidado.', 'Mal arrumado. Moderadamente desalinhado. Roupas exageradas.', 'Desalinhado. Parcialmente vestido. Maquiagem extravagante.', 'Completamente descuidado. Enfeitado. Roupas bizarras.']],
  ['Insight', false, ['Presente. Admite a doença e concorda com a necessidade de tratamento.', 'Admite estar possivelmente doente.', 'Admite mudança de comportamento, mas nega a doença.', 'Admite possível mudança de comportamento, mas nega a doença.', 'Nega qualquer mudança de comportamento.']],
];
const items: ScaleItem[] = raw.map(([text, dbl, anchors], i) => ({
  id: `ymrs_${i + 1}`, number: i + 1, text, hint: dbl ? 'Item de peso duplo (0, 2, 4, 6, 8). Pontuações ímpares intermediárias são permitidas na escala original: se usar, some manualmente.' : undefined,
  options: anchored(anchors, 0, dbl ? 2 : 1),
}));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 12, severity: 'Eutimia / remissão', clinicalImplication: 'Escore ≤ 12 é o critério de remissão mais usado.', badgeColor: 'green' },
  { min: 13, max: 19, severity: 'Sintomas leves / hipomania', clinicalImplication: 'Sintomas maníacos mínimos a leves. Rever adesão, sono e antidepressivos em uso.', badgeColor: 'yellow' },
  { min: 20, max: 25, severity: 'Mania moderada', clinicalImplication: 'Escore ≥ 20 é critério de entrada habitual em ensaios de mania aguda.', badgeColor: 'orange' },
  { min: 26, max: 60, severity: 'Mania grave', clinicalImplication: 'Avaliar risco, sintomas psicóticos e indicação de internação.', badgeColor: 'red' },
];

export const ymrs: PsychiatricScale = {
  id: 'ymrs', name: 'Young Mania Rating Scale', acronym: 'YMRS', category: 'mood', type: 'clinician_administered',
  estimatedMinutes: 20, timeframe: 'Últimas 48 horas',
  description: 'Gravidade de sintomas maníacos em 11 itens, quatro deles com peso duplo.',
  instructions: 'Pontue com base no relato do paciente sobre as últimas 48 horas e na observação durante a entrevista. Na dúvida entre dois graus, a observação clínica prevalece.',
  licenseNote: 'Âncoras completas em tradução de trabalho. Para uso formal, utilize a redação da versão brasileira validada (Vilela et al., 2005).', minScore: 0, maxScore: 60,
  validationInfo: {
    originalAuthors: 'Young RC, Biggs JT, Ziegler VE, Meyer DA', year: 1978,
    brazilianValidation: 'Vilela JAA, Crippa JAS, Del-Ben CM, Loureiro SR, 2005.',
    psychometrics: 'Confiabilidade entre avaliadores de 0,93 para o escore total no estudo original; 0,97 na versão brasileira.',
  },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Medir intensidade de mania e resposta ao tratamento (redução ≥ 50%).',
    targetPopulation: 'Pacientes com transtorno bipolar em episódio maníaco, hipomaníaco ou misto. Heteroaplicável.',
    limitations: [
      'Não diagnostica transtorno bipolar e não avalia sintomas depressivos: em estados mistos associe escala de depressão.',
      'Depende muito da observação. Pacientes com baixo insight subestimam sintomas no relato.',
      'Pouco sensível à hipomania. As faixas de gravidade são convenções de pesquisa.',
    ],
    references: [
      'Young RC, Biggs JT, Ziegler VE, Meyer DA. A rating scale for mania: reliability, validity and sensitivity. Br J Psychiatry. 1978;133:429-435.',
      'Vilela JAA, Crippa JAS, Del-Ben CM, Loureiro SR. Reliability and validity of a Portuguese version of the Young Mania Rating Scale. Braz J Med Biol Res. 2005;38(9):1429-1439.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => simpleSum(items, cutoffs, a),
};
