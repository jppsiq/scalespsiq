/** CAM: algoritmo diagnóstico, não soma. Positivo quando há (1 e 2) e (3 ou 4). */
import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { YES_NO } from '../../lib/options';

const items: ScaleItem[] = [
  { id: 'cam_1', number: 1, text: 'Início agudo e curso flutuante', hint: 'Há evidência de mudança aguda do estado mental em relação ao basal? O comportamento anormal oscila ao longo do dia, indo e vindo ou variando de intensidade? Informação obtida com familiar ou equipe.', options: YES_NO, isRedFlagTrigger: true },
  { id: 'cam_2', number: 2, text: 'Desatenção', hint: 'O paciente teve dificuldade em focalizar a atenção, distraindo-se facilmente ou tendo dificuldade em acompanhar o que era dito? Pode ser testada com dígitos, meses do ano de trás para frente ou a tarefa de vigilância com a letra A.', options: YES_NO, isRedFlagTrigger: true },
  { id: 'cam_3', number: 3, text: 'Pensamento desorganizado', hint: 'O pensamento era desorganizado ou incoerente: conversa dispersa ou irrelevante, fluxo de ideias pouco claro ou ilógico, mudança imprevisível de assunto?', options: YES_NO },
  { id: 'cam_4', number: 4, text: 'Alteração do nível de consciência', hint: 'Qualquer resposta diferente de "alerta": vigilante (hiperalerta), letárgico (sonolento, facilmente despertável), estupor (difícil de despertar) ou coma.', options: YES_NO },
];

const cutoffs: CutoffRange[] = [
  { min: 0, max: 0, severity: 'Delirium não caracterizado', clinicalImplication: 'O algoritmo não foi preenchido. Isso não afasta delirium: o quadro flutua e a reavaliação em outro horário, sobretudo à noite, é obrigatória quando a suspeita persiste.', badgeColor: 'green' },
  { min: 1, max: 1, severity: 'Delirium provável', clinicalImplication: 'Algoritmo positivo. Trate como emergência clínica: busque a causa (infecção, distúrbio hidroeletrolítico, retenção urinária, fecaloma, dor, hipóxia, abstinência, fármacos anticolinérgicos e benzodiazepínicos), corrija-a e aplique medidas não farmacológicas.', badgeColor: 'red' },
];

export const cam: PsychiatricScale = {
  id: 'cam', name: 'Confusion Assessment Method', acronym: 'CAM', category: 'cognition', type: 'clinician_administered',
  estimatedMinutes: 5, timeframe: 'Momento da avaliação, comparado ao estado basal', emergency: true,
  description: 'Algoritmo de quatro características para o reconhecimento de delirium à beira do leito.',
  instructions: 'Aplique após uma avaliação cognitiva breve (por exemplo, o MEEM) e depois de conversar com quem acompanha o paciente. As características 1 e 2 são obrigatórias, acrescidas da 3 ou da 4.',
  scoreLabel: 'Algoritmo', minScore: 0, maxScore: 1,
  validationInfo: { originalAuthors: 'Inouye SK, van Dyck CH, Alessi CA, Balkin S, Siegal AP, Horwitz RI', year: 1990, brazilianValidation: 'Fabbri RMA, Moreira MA, Garrido R, Almeida OP, 2001.', psychometrics: 'Na validação brasileira, sensibilidade de 94,1% e especificidade de 96,4%.' },
  about: {
    purposes: ['screening', 'risk_triage', 'diagnostic_support'],
    objective: 'Detectar delirium de forma rápida e padronizada por profissionais não psiquiatras, em enfermaria, emergência e domicílio.',
    targetPopulation: 'Pacientes hospitalizados, sobretudo idosos e pessoas com demência prévia ou pós-operatório. Aplicado por profissional treinado.',
    accuracy: [{ cutoff: 'Algoritmo positivo', sensitivity: '94 a 100%', specificity: '90 a 95%', source: 'Inouye et al., 1990' }],
    limitations: [
      'Depende de uma avaliação cognitiva prévia e de informação sobre o estado basal: sem elas a sensibilidade cai muito.',
      'O delirium hipoativo, o mais frequente e o de pior prognóstico, passa despercebido quando o paciente é apenas "quieto e colaborativo".',
      'Não distingue delirium sobreposto a demência sem o relato de mudança aguda em relação ao basal.',
      'Não mede gravidade nem acompanha resposta. Para pacientes ventilados ou sedados, use a CAM-ICU.',
    ],
    references: [
      'Inouye SK, van Dyck CH, Alessi CA, Balkin S, Siegal AP, Horwitz RI. Clarifying confusion: the Confusion Assessment Method. Ann Intern Med. 1990;113(12):941-948.',
      'Fabbri RMA, Moreira MA, Garrido R, Almeida OP. Validity and reliability of the Portuguese version of the Confusion Assessment Method (CAM) for the detection of delirium in the elderly. Arq Neuropsiquiatr. 2001;59(2-A):175-179.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const y = (k: string) => a[k] === 1;
    const positive = y('cam_1') && y('cam_2') && (y('cam_3') || y('cam_4'));
    const cutoff = cutoffs[positive ? 1 : 0];
    return {
      total: positive ? 1 : 0, cutoff, classification: cutoff.severity,
      notes: [`Característica 1 (início agudo e flutuação): ${y('cam_1') ? 'presente' : 'ausente'}. Característica 2 (desatenção): ${y('cam_2') ? 'presente' : 'ausente'}. Característica 3 (pensamento desorganizado): ${y('cam_3') ? 'presente' : 'ausente'}. Característica 4 (alteração do nível de consciência): ${y('cam_4') ? 'presente' : 'ausente'}.`],
      clinicalAlert: positive ? 'Delirium provável. Investigue a causa de imediato: infecção (urinária, respiratória), distúrbio hidroeletrolítico e glicêmico, hipóxia, retenção urinária, fecaloma, dor não tratada, abstinência de álcool ou benzodiazepínico, e fármacos de alto risco. Suspenda ou reduza anticolinérgicos, benzodiazepínicos e opioides desnecessários. Aplique medidas não farmacológicas: reorientação, presença de acompanhante, óculos e aparelho auditivo, mobilização precoce, higiene do sono e retirada de cateteres e contenções. Antipsicóticos apenas em agitação com risco, na menor dose e pelo menor tempo. Delirium associa-se a maior mortalidade, maior tempo de internação e declínio cognitivo persistente.' : undefined,
    };
  },
};
