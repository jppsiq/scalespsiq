/** Registro central do catálogo. Para incluir um instrumento novo: importar e adicionar ao array. */
import type { PsychiatricScale } from '../../types/scale';
import { phq9 } from './phq9';
import { hamd17 } from './hamd17';
import { mdq } from './mdq';
import { ymrs } from './ymrs';
import { gad7 } from './gad7';
import { ybocs } from './ybocs';
import { pcl5 } from './pcl5';
import { asrs } from './asrs';
import { bprs } from './bprs';
import { panss } from './panss';
import { audit } from './audit';
import { ciwaar } from './ciwaar';
import { dast10 } from './dast10';
import { meem } from './meem';
import { moca } from './moca';
import { cssrs } from './cssrs';
import { madrs } from './madrs';
import { epds } from './epds';
import { gds15 } from './gds15';
import { hama } from './hama';
import { isi } from './isi';
import { ftnd } from './ftnd';
import { cage } from './cage';
import { aims } from './aims';
import { cgi } from './cgi';
import { snapiv } from './snapiv';
import { pfeffer } from './pfeffer';
import { katz } from './katz';
import { lawton } from './lawton';
import { whodas } from './whodas';
import { zarit } from './zarit';
import { gaf } from './gaf';
import { mchat } from './mchat';
import { aq50 } from './aq50';
import { sdq } from './sdq';
import { cdr } from './cdr';
import { fab } from './fab';
import { tdr } from './tdr';
import { cam } from './cam';
import { sas } from './sas';
import { bars } from './bars';
import { bfcrs } from './bfcrs';
import { cdss } from './cdss';
import { hcl32 } from './hcl32';
import { lsas } from './lsas';
import { cows } from './cows';
import { eat26 } from './eat26';

export const SCALES: PsychiatricScale[] = [
  // Humor
  phq9, hamd17, madrs, epds, gds15, mdq, hcl32, ymrs,
  // Ansiedade, TOC e trauma
  gad7, hama, lsas, ybocs, pcl5,
  // Neurodesenvolvimento
  mchat, aq50, asrs, snapiv, sdq,
  // Psicose e esquizofrenia
  bprs, panss, cdss, bfcrs,
  // Uso de substâncias
  audit, cage, ciwaar, cows, dast10, ftnd,
  // Neurocognição
  meem, moca, tdr, fab, cam, cdr, pfeffer,
  // Funcionalidade e cuidador
  katz, lawton, whodas, gaf, zarit,
  // Comportamento alimentar
  eat26,
  // Sono
  isi,
  // Impressão global e efeitos adversos
  cgi, aims, sas, bars,
  // Risco e segurança
  cssrs,
];

export const getScale = (id: string) => SCALES.find((s) => s.id === id);
