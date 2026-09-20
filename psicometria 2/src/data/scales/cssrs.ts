/**
 * C-SSRS (triagem): demonstra LÓGICA DE SALTO (showIf) e estratificação de risco por regra, não por soma.
 * Itens 3 a 5 só aparecem se o item 2 for "Sim". O item 7 só aparece se o item 6 for "Sim".
 */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { YES_NO } from '../../lib/options';

const IDEA = 'Ideação suicida (último mês)';
const BEH = 'Comportamento suicida';
const q2yes = (a: Record<string, number>) => a.cssrs_2 === 1;

const items: ScaleItem[] = [
  { id: 'cssrs_1', number: 1, section: IDEA, text: 'Você desejou estar morto(a) ou desejou poder dormir e nunca mais acordar?', options: YES_NO, isRedFlagTrigger: true },
  { id: 'cssrs_2', number: 2, section: IDEA, text: 'Você realmente teve pensamentos de se matar?', options: YES_NO, isRedFlagTrigger: true },
  { id: 'cssrs_3', number: 3, section: IDEA, text: 'Você pensou em como poderia fazer isso?', hint: 'Ideação com método, sem plano específico nem intenção.', options: YES_NO, showIf: q2yes, isRedFlagTrigger: true },
  { id: 'cssrs_4', number: 4, section: IDEA, text: 'Você teve esses pensamentos e teve alguma intenção de colocá-los em prática?', hint: 'Ideação com alguma intenção de agir.', options: YES_NO, showIf: q2yes, isRedFlagTrigger: true },
  { id: 'cssrs_5', number: 5, section: IDEA, text: 'Você começou a elaborar ou já elaborou os detalhes de como se matar? Você pretende executar esse plano?', hint: 'Ideação com plano específico e intenção.', options: YES_NO, showIf: q2yes, isRedFlagTrigger: true },
  { id: 'cssrs_6', number: 6, section: BEH, text: 'Alguma vez na vida você fez alguma coisa, começou a fazer alguma coisa ou se preparou para fazer alguma coisa para acabar com a sua vida?', hint: 'Exemplos: juntar comprimidos, obter uma arma, doar pertences, escrever carta de despedida, tomar comprimidos e cuspir, subir em local alto e não pular, tentativa efetiva.', options: YES_NO, isRedFlagTrigger: true },
  { id: 'cssrs_7', number: 7, section: BEH, text: 'Isso aconteceu nos últimos 3 meses?', options: YES_NO, showIf: (a) => a.cssrs_6 === 1, scored: false },
];

// Níveis de risco codificados como 0 a 3 para reaproveitar a régua de faixas.
const cutoffs: CutoffRange[] = [
  { min: 0, max: 0, severity: 'Sem risco identificado na triagem', clinicalImplication: 'Nenhuma resposta positiva. Manter avaliação clínica habitual.', badgeColor: 'green' },
  { min: 1, max: 1, severity: 'Risco baixo', clinicalImplication: 'Desejo de morte ou ideação sem método, intenção ou plano. Avaliação clínica, psicoeducação e seguimento em saúde mental.', badgeColor: 'yellow' },
  { min: 2, max: 2, severity: 'Risco moderado', clinicalImplication: 'Ideação com método, ou comportamento suicida há mais de 3 meses. Avaliação psiquiátrica no mesmo dia, plano de segurança e restrição de meios.', badgeColor: 'orange' },
  { min: 3, max: 3, severity: 'Risco alto', clinicalImplication: 'Ideação com intenção ou plano no último mês, ou comportamento suicida nos últimos 3 meses. Avaliação psiquiátrica imediata e precauções de segurança.', badgeColor: 'red' },
];

const PROTOCOL: Record<number, string> = {
  1: 'Resposta positiva na triagem de risco de suicídio (risco baixo). Aprofunde a avaliação clínica, aborde fatores de risco e proteção, ofereça os contatos de crise (CVV 188) e agende retorno próximo.',
  2: 'RISCO MODERADO. Faça avaliação psiquiátrica completa ainda hoje. Construa plano de segurança por escrito, restrinja acesso a meios letais, envolva familiar ou acompanhante e garanta seguimento em poucos dias. CVV 188. SAMU 192.',
  3: 'RISCO ALTO. Não deixe o paciente sozinho. Acione avaliação psiquiátrica imediata, retire meios letais do ambiente, mantenha observação contínua e considere internação. Comunique a família ou o responsável. SAMU 192.',
};

export const cssrs: PsychiatricScale = {
  id: 'cssrs', name: 'Columbia-Suicide Severity Rating Scale (versão triagem)', acronym: 'C-SSRS', category: 'suicide_risk', type: 'clinician_administered',
  estimatedMinutes: 3, timeframe: 'Último mês (ideação) e vida / últimos 3 meses (comportamento)', emergency: true,
  description: 'Triagem estruturada de ideação e comportamento suicida, com estratificação de risco em três níveis.',
  instructions: 'Faça as perguntas 1 e 2. Se a resposta à pergunta 2 for "Sim", faça as perguntas 3, 4 e 5. Faça sempre a pergunta 6. Use as palavras do próprio paciente para esclarecer as respostas.',
  licenseNote: 'O uso da C-SSRS é gratuito, mas o Columbia Lighthouse Project recomenda treinamento do aplicador e disponibiliza a versão oficial em português. Confira a redação oficial antes do uso institucional.',
  scoreLabel: 'Nível de risco', minScore: 0, maxScore: 3,
  validationInfo: {
    originalAuthors: 'Posner K, Brown GK, Stanley B, et al.', year: 2011,
    brazilianValidation: 'Versão em português do Brasil distribuída pelo Columbia Lighthouse Project.',
    psychometrics: 'Boa validade convergente e divergente e alta sensibilidade para comportamento suicida em três estudos multicêntricos.',
  },
  about: {
    purposes: ['risk_triage', 'screening'],
    objective: 'Padronizar a detecção de ideação e comportamento suicida e orientar o nível de resposta clínica.',
    targetPopulation: 'Adolescentes e adultos em qualquer contexto de cuidado, incluindo emergência. Aplicada por profissional treinado.',
    limitations: [
      'Nenhuma escala prediz suicídio de forma confiável no nível individual. O resultado orienta, mas não substitui, o julgamento clínico.',
      'Triagem negativa não exclui risco: pacientes podem negar ideação. Valorize mudança de comportamento, relato de terceiros e fatores de risco agudos (intoxicação, agitação, insônia grave, alta recente).',
      'A estratificação em três níveis é uma convenção operacional de triagem, não uma probabilidade.',
    ],
    references: [
      'Posner K, Brown GK, Stanley B, et al. The Columbia-Suicide Severity Rating Scale: initial validity and internal consistency findings from three multisite studies with adolescents and adults. Am J Psychiatry. 2011;168(12):1266-1277.',
      'The Columbia Lighthouse Project. C-SSRS Screener with Triage Points. cssrs.columbia.edu.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const yes = (k: string) => a[k] === 1;
    const ideationVisible = yes('cssrs_2');
    let level = 0;
    if (yes('cssrs_1') || yes('cssrs_2')) level = 1;
    if ((ideationVisible && yes('cssrs_3')) || yes('cssrs_6')) level = Math.max(level, 2);
    if ((ideationVisible && (yes('cssrs_4') || yes('cssrs_5'))) || (yes('cssrs_6') && yes('cssrs_7'))) level = 3;
    const cutoff = cutoffs[level];
    return { total: level, cutoff, classification: cutoff.severity, clinicalAlert: level > 0 ? PROTOCOL[level] : undefined };
  },
};
