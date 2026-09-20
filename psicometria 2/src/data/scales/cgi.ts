import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { graded } from '../../lib/options';

const items: ScaleItem[] = [
  { id: 'cgi_s', number: 1, section: 'CGI-S: gravidade', text: 'Considerando sua experiência clínica com esta população, quão doente está o paciente neste momento?', options: graded(['Normal, não doente', 'Limítrofe para doença mental', 'Levemente doente', 'Moderadamente doente', 'Marcadamente doente', 'Gravemente doente', 'Entre os pacientes mais extremamente doentes'], 1) },
  { id: 'cgi_i', number: 2, section: 'CGI-I: melhora', text: 'Comparado ao estado no início do tratamento, quanto o paciente mudou?', hint: 'Opcional. Não se aplica à avaliação basal.', scored: false, optional: true, options: graded(['Muitíssimo melhor', 'Muito melhor', 'Minimamente melhor', 'Sem alteração', 'Minimamente pior', 'Muito pior', 'Muitíssimo pior'], 1) },
];

const cutoffs: CutoffRange[] = [
  { min: 1, max: 2, severity: 'Normal ou limítrofe', clinicalImplication: 'CGI-S ≤ 2 é usado como critério de remissão em diversos estudos.', badgeColor: 'green' },
  { min: 3, max: 3, severity: 'Levemente doente', clinicalImplication: 'Sintomas presentes com pouco prejuízo funcional.', badgeColor: 'yellow' },
  { min: 4, max: 4, severity: 'Moderadamente doente', clinicalImplication: 'Sintomas evidentes com prejuízo funcional moderado.', badgeColor: 'orange' },
  { min: 5, max: 7, severity: 'Marcadamente a extremamente doente', clinicalImplication: 'Prejuízo funcional importante. Avaliar nível de cuidado.', badgeColor: 'red' },
];

const IMPROVE = ['', 'muitíssimo melhor', 'muito melhor', 'minimamente melhor', 'sem alteração', 'minimamente pior', 'muito pior', 'muitíssimo pior'];

export const cgi: PsychiatricScale = {
  id: 'cgi', name: 'Clinical Global Impression', acronym: 'CGI', category: 'general', type: 'clinician_administered',
  estimatedMinutes: 1, timeframe: 'Última semana',
  description: 'Impressão clínica global de gravidade (CGI-S) e de melhora (CGI-I), aplicável a qualquer diagnóstico.',
  instructions: 'Pontue com base em toda a informação disponível: entrevista, observação, relato de familiares e da equipe.',
  scoreLabel: 'CGI-S', minScore: 1, maxScore: 7,
  validationInfo: { originalAuthors: 'Guy W (National Institute of Mental Health, ECDEU)', year: 1976, brazilianValidation: 'Domínio público, uso corrente em pesquisa no Brasil.', psychometrics: 'Boa sensibilidade à mudança. Correlaciona-se com PANSS, BPRS, HAM-D e YMRS (Leucht et al., 2005; Busner e Targum, 2007).' },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Resumir em um número o julgamento clínico de gravidade e de resposta. CGI-I de 1 ou 2 é definição usual de resposta.',
    targetPopulation: 'Qualquer paciente psiquiátrico. Pontuada por clínico experiente na população em questão.',
    limitations: ['Depende da experiência do avaliador e da população de referência: baixa comparabilidade entre serviços.', 'Não descreve quais sintomas mudaram. Use em conjunto com uma escala específica.', 'O CGI-I exige lembrar o estado basal, o que introduz viés em seguimentos longos.'],
    references: ['Guy W. ECDEU Assessment Manual for Psychopharmacology. Rockville: US Department of Health, Education, and Welfare; 1976.', 'Busner J, Targum SD. The Clinical Global Impressions Scale: applying a research tool in clinical practice. Psychiatry (Edgmont). 2007;4(7):28-37.'],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const total = a.cgi_s ?? 0;
    const cutoff = cutoffs.find((c) => total >= c.min && total <= c.max);
    return { total, cutoff, classification: cutoff?.severity ?? 'Sem classificação', notes: a.cgi_i ? [`CGI-I: ${a.cgi_i} (${IMPROVE[a.cgi_i]}).${a.cgi_i <= 2 ? ' Atende a definição usual de resposta.' : ''}`] : undefined };
  },
};
