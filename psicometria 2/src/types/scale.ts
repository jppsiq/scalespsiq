/**
 * CAMADA DE DADOS: contratos TypeScript de todos os instrumentos.
 *
 * Tudo que a UI sabe sobre uma escala vem destas interfaces. Para adicionar um
 * instrumento novo basta criar um arquivo em data/scales/ que exporte um
 * PsychiatricScale e registrá-lo em data/scales/index.ts. Nenhum componente
 * precisa ser alterado.
 */

export type ScaleCategory =
  | 'mood'
  | 'anxiety'
  | 'psychosis'
  | 'adhd'
  | 'substances'
  | 'cognition'
  | 'function'
  | 'eating'
  | 'sleep'
  | 'general'
  | 'suicide_risk';

export type ScaleType = 'self_administered' | 'clinician_administered';

/** Finalidades clínicas possíveis de um instrumento. */
export type ClinicalPurpose = 'screening' | 'severity' | 'monitoring' | 'diagnostic_support' | 'risk_triage';

/** Cores semânticas de faixa. O mapeamento para classes fica em lib/ui.ts. */
export type BadgeColor = 'green' | 'yellow' | 'orange' | 'red' | 'slate';

export type Answers = Record<string, number>;

export interface ScaleOption {
  label: string;
  value: number;
  /** Texto de apoio opcional (âncora descritiva). */
  description?: string;
}

/** Estímulo mostrado ao paciente junto do item: figura (ex.: cubo do MoCA) ou texto em destaque (ex.: "FECHE OS OLHOS"). */
export interface ItemStimulus {
  kind: 'image' | 'text';
  /** URL da imagem (importada como asset pelo Vite). */
  src?: string;
  text?: string;
  alt: string;
  caption?: string;
  /** Largura de exibição. Padrão: 'sm' para SVG, tamanho natural para imagem raster. */
  size?: 'sm' | 'md' | 'lg';
}

export interface ScaleItem {
  id: string;
  number: number;
  text: string;
  /** Orientação curta ao aplicador, exibida abaixo do enunciado. */
  hint?: string;
  options: ScaleOption[];
  subscale?: string;
  /** Título de seção: quando muda entre itens consecutivos, a UI imprime um cabeçalho. */
  section?: string;

  /** Estímulo visual associado ao item. */
  stimulus?: ItemStimulus;
  /** Altura (mm) de área em branco na folha impressa, para desenho ou escrita do paciente. */
  responseSpaceMm?: number;

  /** Item que pode disparar alerta clínico imediato (hard stop). */
  isRedFlagTrigger?: boolean;
  /** Valor a partir do qual o alerta dispara. Padrão: 1 (qualquer resposta > 0). */
  redFlagThreshold?: number;

  /** Item de pontuação invertida: o valor contabilizado é (máx + mín - resposta). */
  reverse?: boolean;
  /** false = item coletado mas fora do escore total (ex.: item funcional do PHQ-9). Padrão: true. */
  scored?: boolean;
  /** true = não bloqueia a conclusão da avaliação. */
  optional?: boolean;
  /** Lógica de salto: o item só aparece (e só é exigido) quando retorna true. */
  showIf?: (answers: Answers) => boolean;
}

export interface CutoffRange {
  min: number;
  max: number;
  severity: string;
  clinicalImplication: string;
  badgeColor: BadgeColor;
}

/** Linha da tabela de acurácia exibida em "Sobre o instrumento". */
export interface PsychometricRow {
  cutoff: string;
  sensitivity: string;
  specificity: string;
  source: string;
}

export interface SubscaleInfo {
  key: string;
  label: string;
  max?: number;
}

export interface ScoreResult {
  total: number;
  subscores?: Record<string, number>;
  classification: string;
  /** Faixa em que o total caiu, quando o instrumento usa faixas. */
  cutoff?: CutoffRange;
  /** Texto do alerta clínico. Presente = a UI mostra o banner vermelho. */
  clinicalAlert?: string;
  /** Observações interpretativas adicionais (ex.: critério de triagem positivo). */
  notes?: string[];
}

export interface PsychiatricScale {
  id: string;
  name: string;
  acronym: string;
  category: ScaleCategory;
  type: ScaleType;
  estimatedMinutes: number;
  description: string;
  instructions: string;
  /** Janela temporal avaliada (ex.: "Últimas 2 semanas"). */
  timeframe?: string;
  /** Aparece no filtro "Emergência/Risco". */
  emergency?: boolean;
  /** Imagem do formulário original. Quando presente, é ela que sai na impressão do "instrumento em branco". */
  formImage?: string;
  /** Aviso de licenciamento ou de uso de âncoras resumidas. */
  licenseNote?: string;

  /** Rótulo do número principal quando ele não é uma soma (ex.: "Nível de risco"). Padrão: "Escore total". */
  scoreLabel?: string;
  minScore: number;
  maxScore: number;
  subscales?: SubscaleInfo[];

  validationInfo: {
    originalAuthors: string;
    year: number;
    brazilianValidation?: string;
    psychometrics: string;
  };

  about: {
    purposes: ClinicalPurpose[];
    objective: string;
    targetPopulation: string;
    accuracy?: PsychometricRow[];
    limitations: string[];
    references: string[];
  };

  cutoffs: CutoffRange[];
  items: ScaleItem[];

  /**
   * CAMADA DE REGRAS: função pura. Recebe as respostas e devolve o resultado.
   * Deve tolerar respostas parciais (a UI a chama a cada clique).
   */
  calculateScore: (answers: Answers) => ScoreResult;
}

/** Dados de identificação usados apenas no relatório. Nunca são persistidos. */
export interface PatientInfo {
  name: string;
  identifier: string;
  date: string;
  professional: string;
  notes: string;
}
