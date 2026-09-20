import { describe, expect, it } from 'vitest';
import { phq9 } from '../data/scales/phq9';
import { asrs } from '../data/scales/asrs';
import { dast10 } from '../data/scales/dast10';
import { mdq } from '../data/scales/mdq';
import { cssrs } from '../data/scales/cssrs';
import { SCALES } from '../data/scales';
import { isComplete } from './scoring';

const fill = (prefix: string, n: number, v: number) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`${prefix}_${i + 1}`, v]));

describe('PHQ-9', () => {
  it('soma e classifica', () => {
    const r = phq9.calculateScore(fill('phq9', 9, 2));
    expect(r.total).toBe(18);
    expect(r.cutoff?.severity).toBe('Moderadamente grave');
  });
  it('dispara alerta com item 9 > 0 mesmo com escore baixo', () => {
    expect(phq9.calculateScore({ ...fill('phq9', 9, 0), phq9_9: 1 }).clinicalAlert).toBeDefined();
    expect(phq9.calculateScore(fill('phq9', 9, 0)).clinicalAlert).toBeUndefined();
  });
  it('item funcional não entra no total', () => {
    expect(phq9.calculateScore({ ...fill('phq9', 9, 1), phq9_func: 3 }).total).toBe(9);
  });
});

describe('ASRS Parte A', () => {
  it('usa limiar 2 nos itens 1 a 3 e limiar 3 nos itens 4 a 6', () => {
    const allSometimes = asrs.calculateScore(fill('asrs', 18, 2));
    expect(allSometimes.subscores?.parteA).toBe(3); // só 1, 2 e 3 contam
    expect(allSometimes.classification).toBe('Rastreio negativo');
    const r = asrs.calculateScore({ ...fill('asrs', 18, 2), asrs_4: 3 });
    expect(r.subscores?.parteA).toBe(4);
    expect(r.classification).toBe('Rastreio positivo');
  });
});

describe('DAST-10', () => {
  it('inverte o item 3', () => {
    expect(dast10.calculateScore(fill('dast', 10, 0)).total).toBe(1); // "Não" no item 3 vale 1
    expect(dast10.calculateScore({ ...fill('dast', 10, 0), dast_3: 1 }).total).toBe(0);
  });
});

describe('MDQ', () => {
  it('exige os três critérios', () => {
    const base = fill('mdq', 13, 1);
    expect(mdq.calculateScore({ ...base, mdq_co: 1, mdq_imp: 1 }).classification).toBe('Rastreio negativo');
    expect(mdq.calculateScore({ ...base, mdq_co: 1, mdq_imp: 2 }).classification).toMatch(/positivo/);
  });
});

describe('C-SSRS', () => {
  it('estratifica o risco', () => {
    expect(cssrs.calculateScore({ cssrs_1: 0, cssrs_2: 0, cssrs_6: 0 }).total).toBe(0);
    expect(cssrs.calculateScore({ cssrs_1: 1, cssrs_2: 0, cssrs_6: 0 }).total).toBe(1);
    expect(cssrs.calculateScore({ cssrs_1: 1, cssrs_2: 1, cssrs_3: 1, cssrs_4: 0, cssrs_5: 0, cssrs_6: 0 }).total).toBe(2);
    expect(cssrs.calculateScore({ cssrs_1: 1, cssrs_2: 1, cssrs_3: 1, cssrs_4: 1, cssrs_5: 0, cssrs_6: 0 }).total).toBe(3);
    expect(cssrs.calculateScore({ cssrs_1: 0, cssrs_2: 0, cssrs_6: 1, cssrs_7: 0 }).total).toBe(2);
    expect(cssrs.calculateScore({ cssrs_1: 0, cssrs_2: 0, cssrs_6: 1, cssrs_7: 1 }).total).toBe(3);
  });
  it('itens 3 a 5 só são exigidos quando o item 2 é Sim', () => {
    expect(isComplete(cssrs.items, { cssrs_1: 0, cssrs_2: 0, cssrs_6: 0 })).toBe(true);
    expect(isComplete(cssrs.items, { cssrs_1: 1, cssrs_2: 1, cssrs_6: 0 })).toBe(false);
  });
});

describe('novas escalas', () => {
  it('GDS-15 inverte os itens 1, 5, 7, 11 e 13', async () => {
    const { gds15 } = await import('../data/scales/gds15');
    expect(gds15.calculateScore(fill('gds', 15, 0)).total).toBe(5);
    expect(gds15.calculateScore(fill('gds', 15, 1)).total).toBe(10);
  });
  it('AIMS aplica Schooler-Kane', async () => {
    const { aims } = await import('../data/scales/aims');
    expect(aims.calculateScore({ ...fill('aims', 12, 0), aims_1: 3 }).classification).toMatch(/atendido$/);
    expect(aims.calculateScore({ ...fill('aims', 12, 0), aims_1: 2, aims_4: 2 }).classification).toMatch(/atendido$/);
    expect(aims.calculateScore({ ...fill('aims', 12, 0), aims_1: 2 }).classification).toMatch(/não atendido/);
  });
  it('SNAP-IV conta sintomas por domínio', async () => {
    const { snapiv } = await import('../data/scales/snapiv');
    const a = { ...fill('snap', 18, 1), snap_1: 2, snap_2: 2, snap_3: 3, snap_4: 2, snap_5: 2, snap_6: 3 };
    expect(snapiv.calculateScore(a).classification).toMatch(/desatento/);
  });
  it('MEEM e MoCA somam 30 com todos os itens corretos', async () => {
    const { meem } = await import('../data/scales/meem');
    const { moca } = await import('../data/scales/moca');
    expect(meem.items.filter((i) => i.scored !== false).length).toBe(30);
    expect(moca.calculateScore(Object.fromEntries(moca.items.map((i) => [i.id, Math.max(...i.options.map((o) => o.value))]))).total).toBe(30);
    expect(moca.calculateScore({ ...Object.fromEntries(moca.items.map((i) => [i.id, Math.max(...i.options.map((o) => o.value))])), moca_edu: 0 }).total).toBe(30);
  });
});

describe('escalas com algoritmo próprio', () => {
  it('CAM exige as características 1 e 2 mais a 3 ou a 4', async () => {
    const { cam } = await import('../data/scales/cam');
    expect(cam.calculateScore({ cam_1: 1, cam_2: 1, cam_3: 1, cam_4: 0 }).total).toBe(1);
    expect(cam.calculateScore({ cam_1: 1, cam_2: 1, cam_3: 0, cam_4: 1 }).total).toBe(1);
    expect(cam.calculateScore({ cam_1: 1, cam_2: 0, cam_3: 1, cam_4: 1 }).total).toBe(0);
    expect(cam.calculateScore({ cam_1: 1, cam_2: 1, cam_3: 0, cam_4: 0 }).total).toBe(0);
    expect(cam.calculateScore({ cam_1: 1, cam_2: 1, cam_3: 1, cam_4: 0 }).clinicalAlert).toBeDefined();
  });
  it('CDR calcula soma das caixas e estágio global', async () => {
    const { cdr } = await import('../data/scales/cdr');
    const mk = (v: number[]) => Object.fromEntries(v.map((x, i) => [`cdr_${i + 1}`, x]));
    expect(cdr.calculateScore(mk([0, 0, 0, 0, 0, 0])).notes?.[0]).toMatch(/CDR 0 /);
    // memória 1 com três secundárias em 1: global segue a memória
    expect(cdr.calculateScore(mk([1, 1, 1, 1, 0, 0])).notes?.[0]).toMatch(/CDR 1/);
    // memória 0,5 com três ou mais secundárias em 1 ou mais: sobe para CDR 1
    expect(cdr.calculateScore(mk([0.5, 1, 1, 1, 0, 0])).notes?.[0]).toMatch(/CDR 1/);
    expect(cdr.calculateScore(mk([0.5, 1, 0, 0, 0, 0])).notes?.[0]).toMatch(/CDR 0,5/);
    expect(cdr.calculateScore(mk([3, 3, 3, 3, 3, 3])).total).toBe(18);
    expect(cdr.calculateScore(mk([0.5, 0.5, 0.5, 0.5, 0.5, 0])).cutoff?.severity).toMatch(/questionável/);
  });
  it('M-CHAT-R inverte os itens 2, 5 e 12', async () => {
    const { mchat } = await import('../data/scales/mchat');
    const todosSim = Object.fromEntries(mchat.items.map((i) => [i.id, 0]));
    expect(mchat.calculateScore(todosSim).total).toBe(3); // 2, 5 e 12 pontuam quando "Sim"
    expect(mchat.calculateScore({ ...todosSim, mchat_2: 1, mchat_5: 1, mchat_12: 1 }).total).toBe(0);
  });
  it('AIMS, Barnes e Bush-Francis disparam alerta nos casos graves', async () => {
    const { bars } = await import('../data/scales/bars');
    const { bfcrs } = await import('../data/scales/bfcrs');
    expect(bars.calculateScore({ bars_1: 2, bars_2: 2, bars_3: 2 }).clinicalAlert).toBeDefined();
    expect(bars.calculateScore({ bars_1: 1, bars_2: 0, bars_3: 0 }).clinicalAlert).toBeUndefined();
    expect(bfcrs.calculateScore({ bf_1: 1, bf_3: 2 }).clinicalAlert).toBeDefined();
    expect(bfcrs.calculateScore({ bf_1: 1 }).clinicalAlert).toBeUndefined();
  });
  it('Katz e Lawton respeitam os limites da escala', async () => {
    const { katz } = await import('../data/scales/katz');
    const { lawton } = await import('../data/scales/lawton');
    expect(katz.calculateScore(fill('katz', 6, 1)).classification).toBe('Independente');
    expect(katz.calculateScore(fill('katz', 6, 0)).total).toBe(0);
    expect(lawton.calculateScore(fill('lawton', 7, 1)).total).toBe(7);
    expect(lawton.calculateScore(fill('lawton', 7, 3)).classification).toBe('Independente');
  });
  it('EAT-26 inverte o item 26 e alerta em comportamento compensatório', async () => {
    const { eat26 } = await import('../data/scales/eat26');
    const zeros = Object.fromEntries(eat26.items.map((i) => [i.id, 0]));
    expect(eat26.calculateScore({ ...zeros, eat_26: 3 }).total).toBe(3);
    expect(eat26.calculateScore({ ...zeros, eat_9: 1 }).clinicalAlert).toBeDefined();
    expect(eat26.calculateScore(zeros).clinicalAlert).toBeUndefined();
  });
  it('AGF alerta nas faixas de risco', async () => {
    const { gaf } = await import('../data/scales/gaf');
    expect(gaf.calculateScore({ gaf_1: 15 }).clinicalAlert).toBeDefined();
    expect(gaf.calculateScore({ gaf_1: 55 }).clinicalAlert).toBeUndefined();
    expect(gaf.calculateScore({ gaf_1: 55 }).cutoff?.severity).toBe('60 a 51');
  });
});

describe('integridade do catálogo', () => {
  it.each(SCALES.map((s) => [s.acronym, s] as const))('%s: faixas cobrem todo o intervalo, sem buracos', (_, s) => {
    const sorted = [...s.cutoffs].sort((a, b) => a.min - b.min);
    expect(sorted[0].min).toBe(s.minScore);
    expect(sorted[sorted.length - 1].max).toBe(s.maxScore);
    for (let i = 1; i < sorted.length; i++) {
      const gap = sorted[i].min - sorted[i - 1].max; // 1 em escalas inteiras, 0,5 na CDR
      expect(gap).toBeGreaterThan(0);
      expect(gap).toBeLessThanOrEqual(1);
    }
  });
  it.each(SCALES.map((s) => [s.acronym, s] as const))('%s: máximo teórico confere com maxScore', (_, s) => {
    const max: Record<string, number> = {};
    for (const it of s.items) max[it.id] = it.reverse ? Math.min(...it.options.map((o) => o.value)) : Math.max(...it.options.map((o) => o.value));
    const r = s.calculateScore(max);
    // Escalas cujo "total" não é a soma máxima: contagens, algoritmos e itens com valor de ponto médio.
    if (!['asrs', 'cssrs', 'mdq', 'cam', 'gaf', 'bfcrs', 'sdq'].includes(s.id)) expect(r.total).toBe(s.maxScore);
  });
  it('ids únicos', () => {
    const ids = SCALES.flatMap((s) => s.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
