import type { CutoffRange, PsychiatricScale, ScaleItem } from '../../types/scale';
import { anchored } from '../../lib/options';
import { simpleSum } from '../../lib/scoring';

/** Monta 0 a 7 a partir das âncoras definidas no original. Graus sem texto aparecem como "grau intermediário". */
const s07 = (a: Record<number, string>) => Array.from({ length: 8 }, (_, v) => ({ label: String(v), value: v, description: a[v] ?? '' })).map((o) => (o.description ? o : { label: o.label, value: o.value, description: 'Grau intermediário.' }));
const sens = (tipo: string, leve: string) => s07({ 0: 'Ausente.', 1: `${leve} muito leve.`, 2: `${leve} leve.`, 3: `${leve} moderado.`, 4: `Alucinações ${tipo} moderadamente graves.`, 5: `Alucinações ${tipo} graves.`, 6: `Alucinações ${tipo} extremamente graves.`, 7: `Alucinações ${tipo} contínuas.` });

const items: ScaleItem[] = [
  { text: 'Náuseas e vômitos', hint: 'Pergunte: "Você sente enjoo? Vomitou?"', options: s07({ 0: 'Sem náuseas nem vômitos.', 1: 'Náusea leve, sem vômitos.', 4: 'Náusea intermitente, com ânsia de vômito.', 7: 'Náusea constante, ânsia frequente e vômitos.' }) },
  { text: 'Tremor', hint: 'Braços estendidos e dedos afastados.', options: s07({ 0: 'Sem tremor.', 1: 'Não visível, mas sentido ao encostar a ponta dos dedos.', 4: 'Moderado, com os braços estendidos.', 7: 'Grave, mesmo com os braços não estendidos.' }) },
  { text: 'Sudorese paroxística', options: s07({ 0: 'Sem sudorese visível.', 1: 'Sudorese quase imperceptível, palmas úmidas.', 4: 'Gotas de suor visíveis na fronte.', 7: 'Sudorese profusa.' }) },
  { text: 'Ansiedade', hint: 'Pergunte: "Você está nervoso?"', options: s07({ 0: 'Sem ansiedade, tranquilo.', 1: 'Levemente ansioso.', 4: 'Moderadamente ansioso ou em guarda, de modo que se infere ansiedade.', 7: 'Equivalente a estado de pânico agudo, como no delirium grave ou em reações psicóticas agudas.' }) },
  { text: 'Agitação', options: s07({ 0: 'Atividade normal.', 1: 'Atividade um pouco acima do normal.', 4: 'Moderadamente inquieto e irrequieto.', 7: 'Anda de um lado para o outro durante a maior parte da entrevista ou se debate constantemente.' }) },
  { text: 'Distúrbios táteis', hint: 'Pergunte: "Sente coceira, agulhadas, queimação, dormência ou bichos andando na pele?"', options: sens('táteis', 'Prurido, formigamento, queimação ou dormência') },
  { text: 'Distúrbios auditivos', hint: 'Pergunte: "Os sons estão mais intensos? Assustam? Ouve algo que o perturba ou que sabe não existir?"', options: sens('auditivas', 'Sons mais intensos ou assustadores, em grau') },
  { text: 'Distúrbios visuais', hint: 'Pergunte: "A luz parece forte demais? A cor está diferente? Incomoda os olhos? Vê algo que o perturba ou que sabe não existir?"', options: sens('visuais', 'Sensibilidade à luz, em grau') },
  { text: 'Cefaleia ou sensação de cabeça cheia', hint: 'Pergunte: "Sente a cabeça diferente? Como se houvesse uma faixa apertando?" Não pontue tontura.', options: s07({ 0: 'Ausente.', 1: 'Muito leve.', 2: 'Leve.', 3: 'Moderada.', 4: 'Moderadamente grave.', 5: 'Grave.', 6: 'Muito grave.', 7: 'Extremamente grave.' }) },
  { text: 'Orientação e turvação do sensório', hint: 'Pergunte: "Que dia é hoje? Onde você está? Quem sou eu?"', options: anchored(['Orientado, consegue fazer adições seriadas.', 'Não consegue fazer adições seriadas ou tem incerteza sobre a data.', 'Desorientado quanto à data em até 2 dias.', 'Desorientado quanto à data em mais de 2 dias.', 'Desorientado quanto a lugar e/ou pessoa.']) },
].map((it, i) => ({ id: `ciwa_${i + 1}`, number: i + 1, ...it }));

const cutoffs: CutoffRange[] = [
  { min: 0, max: 9, severity: 'Abstinência leve', clinicalImplication: 'Em geral sem necessidade de benzodiazepínico em esquema guiado por sintomas. Reavaliar periodicamente, repor tiamina e hidratar.', badgeColor: 'green' },
  { min: 10, max: 18, severity: 'Abstinência moderada', clinicalImplication: 'Indicado benzodiazepínico conforme protocolo do serviço. Reavaliar a cada 1 a 2 horas até escore abaixo do limiar.', badgeColor: 'orange' },
  { min: 19, max: 67, severity: 'Abstinência grave', clinicalImplication: 'Risco elevado de convulsões e delirium tremens. Tratamento hospitalar com monitorização.', badgeColor: 'red' },
];

export const ciwaar: PsychiatricScale = {
  id: 'ciwaar', name: 'Clinical Institute Withdrawal Assessment for Alcohol, Revised', acronym: 'CIWA-Ar', category: 'substances', type: 'clinician_administered',
  estimatedMinutes: 5, timeframe: 'Momento da avaliação', emergency: true,
  description: 'Gravidade da síndrome de abstinência alcoólica em 10 itens, para guiar o tratamento por sintomas.',
  instructions: 'Avalie o paciente no momento do exame. Reaplique em intervalos regulares (por exemplo, a cada 1 a 4 horas conforme a gravidade) para titular o tratamento.',
  licenseNote: 'Escala de domínio público. Âncoras completas em tradução de trabalho: nos sete primeiros itens o original define apenas os graus 0, 1, 4 e 7.', minScore: 0, maxScore: 67,
  validationInfo: {
    originalAuthors: 'Sullivan JT, Sykora K, Schneiderman J, Naranjo CA, Sellers EM', year: 1989,
    brazilianValidation: 'Recomendada no Consenso Brasileiro sobre a Síndrome de Abstinência do Álcool (Laranjeira R et al., 2000).',
    psychometrics: 'Alta confiabilidade entre avaliadores (r acima de 0,8) no estudo original.',
  },
  about: {
    purposes: ['severity', 'monitoring'],
    objective: 'Graduar a abstinência alcoólica e orientar dose e frequência de benzodiazepínicos em esquema guiado por sintomas.',
    targetPopulation: 'Adultos com abstinência alcoólica capazes de se comunicar. Aplicada por médico ou enfermagem treinada.',
    limitations: [
      'Depende de comunicação verbal: não use em paciente intubado, sedado, com delirium franco ou barreira de linguagem. Nesses casos prefira escalas objetivas ou esquema de dose fixa.',
      'Não é diagnóstica. Sepse, hipoglicemia, encefalopatia hepática, TCE, abstinência de outras substâncias e tireotoxicose também pontuam.',
      'Não inclui sinais vitais. Taquicardia, hipertensão e febre devem ser monitorizadas em paralelo.',
      'Os limiares variam entre protocolos (8 a 10 para iniciar medicação; 15 a 20 para abstinência grave). Siga o protocolo institucional.',
    ],
    references: [
      'Sullivan JT, Sykora K, Schneiderman J, Naranjo CA, Sellers EM. Assessment of alcohol withdrawal: the revised Clinical Institute Withdrawal Assessment for Alcohol scale (CIWA-Ar). Br J Addict. 1989;84(11):1353-1357.',
      'Laranjeira R, Nicastri S, Jerônimo C, Marques AC. Consenso sobre a Síndrome de Abstinência do Álcool (SAA) e o seu tratamento. Rev Bras Psiquiatr. 2000;22(2):62-71.',
      'The ASAM Clinical Practice Guideline on Alcohol Withdrawal Management. J Addict Med. 2020;14(3S Suppl 1):1-72.',
    ],
  },
  cutoffs, items,
  calculateScore: (a) => {
    const r = simpleSum(items, cutoffs, a);
    const hall = [6, 7, 8].some((k) => (a[`ciwa_${k}`] ?? 0) >= 4);
    const disor = (a.ciwa_10 ?? 0) >= 3;
    const alert = r.total >= 19 || hall || disor;
    return {
      ...r,
      clinicalAlert: alert
        ? `${r.total >= 19 ? 'Abstinência grave (≥ 19). ' : ''}${hall ? 'Alucinações presentes. ' : ''}${disor ? 'Desorientação importante. ' : ''}Risco de convulsões e delirium tremens: tratar em ambiente hospitalar com monitorização, benzodiazepínico conforme protocolo, tiamina parenteral antes de glicose, correção hidroeletrolítica (Mg, K) e investigação de causas clínicas associadas.`
        : undefined,
    };
  },
};
