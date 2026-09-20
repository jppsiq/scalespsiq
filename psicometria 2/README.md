# Psicometria Clínica

Aplicação web para aplicar escalas psiquiátricas, calcular escores, consultar a base teórica de cada instrumento e imprimir ou exportar fichas em A4.

Stack: React 18, TypeScript, Vite, Tailwind CSS 3, lucide-react, html2pdf.js, Vitest.

## Como executar

```bash
npm install
npm run dev            # http://localhost:5173
npm test               # 114 testes do motor de cálculo e da integridade do catálogo
npm run build          # dist/ para deploy estático
npm run build:single   # dist-single/index.html único, abre com duplo clique
```

Requer Node 18 ou superior.

## Arquitetura

Três camadas com dependência em um único sentido: UI -> regras -> dados.

```
src/
├── types/
│   └── scale.ts             Contratos: PsychiatricScale, ScaleItem, CutoffRange, ScoreResult...
├── data/scales/             CAMADA DE DADOS (um arquivo por instrumento)
│   ├── index.ts             Registro do catálogo (SCALES, getScale)
│   ├── phq9.ts              Soma + item fora do escore + gatilho de risco no item 9
│   ├── asrs.ts              Contagem por limiar (Parte A) + somas por domínio
│   ├── mdq.ts               Critério composto (3 condições)
│   ├── dast10.ts            Item de pontuação invertida
│   ├── cssrs.ts             Lógica de salto (showIf) + estratificação por regra
│   ├── ymrs.ts              Itens de peso duplo
│   ├── meem.ts, moca.ts     Item a item, com estímulos visuais (assets/) e formulário original
│   ├── hamd17, ymrs, madrs, ciwaar   Âncoras descritivas completas por grau
│   ├── gds15.ts             Cinco itens invertidos
│   ├── aims.ts, snapiv.ts   Interpretação por regra (Schooler-Kane; contagem de sintomas)
│   ├── cdr.ts               Soma das caixas + estágio global pelas regras de Morris
│   ├── cam.ts               Algoritmo diagnóstico de delirium (1 e 2, mais 3 ou 4)
│   ├── fab.ts               BAF, com ilustrações SVG próprias das provas motoras
│   ├── tdr.ts               Relógio: escore de Shulman + registro qualitativo da execução
│   ├── mchat.ts, aq50.ts    TEA: rastreio infantil e quociente do adulto
│   ├── gaf.ts               Item único com faixas de 10 pontos
│   └── gad7, hama, lsas, ybocs, pcl5, epds, hcl32, madrs, sdq, bprs, panss, cdss, bfcrs,
│       audit, cage, cows, ftnd, isi, katz, lawton, whodas, zarit, sas, bars, eat26, cgi, pfeffer
├── assets/                  Figuras: moca/ (formulário e recortes), meem/ (pentágonos),
│                            fab/ (série de Luria, instruções conflitantes, go-no-go, preensão),
│                            tdr/ (folha de aplicação A4 e exemplos de pontuação)
├── lib/                     CAMADA DE REGRAS (funções puras, sem React)
│   ├── scoring.ts           sumItems, itemScore (inversão), classify, countAtOrAbove,
│   │                        visibleItems, isComplete, triggeredRedFlags, simpleSum
│   ├── scoring.test.ts      Testes
│   ├── options.ts           Conjuntos de opções reutilizáveis
│   ├── ui.ts                Rótulos e cores semânticas -> classes
│   └── pdf.ts               window.print() e html2pdf.js (carregado sob demanda)
├── hooks/
│   ├── useAssessment.ts     Respostas, progresso, completude e resultado ao vivo
│   ├── useHashRoute.ts      Rotas #/ e #/escala/<id>
│   └── useTheme.ts          Tema claro/escuro
├── components/              CAMADA DE VISUALIZAÇÃO
│   ├── Dashboard.tsx        Catálogo, busca e filtros
│   ├── ScaleView.tsx        Abas: Aplicar, Sobre o instrumento, Imprimir e PDF
│   ├── AssessmentForm.tsx   Preenchimento, progresso, pendências
│   ├── ItemCard.tsx         Item com rádios nativos estilizados
│   ├── ResultPanel.tsx      Escore, régua de gravidade, subescalas
│   ├── SeverityRuler.tsx    Régua proporcional às faixas de corte
│   ├── AlertBanner.tsx      Alerta clínico (hard stop)
│   ├── AboutPanel.tsx       Ficha técnica, interpretação, limitações, referências
│   ├── PrintView.tsx        Modo, identificação e ações de exportação
│   └── PrintSheet.tsx       Folha A4 (em branco ou relatório)
├── index.css                Tailwind + regras @page / @media print
├── App.tsx
└── main.tsx
```

## Como adicionar uma escala

1. Crie `src/data/scales/minhaescala.ts` exportando um `PsychiatricScale`.
2. Para soma simples com faixas, `calculateScore: (a) => simpleSum(items, cutoffs, a)` resolve.
3. Registre em `src/data/scales/index.ts`.
4. Rode `npm test`: os testes de integridade conferem se as faixas cobrem todo o intervalo, se o máximo teórico bate com `maxScore` e se os ids são únicos.

Catálogo atual: 47 instrumentos em 11 categorias.

Recursos do schema: `stimulus` (figura ou texto mostrado ao paciente, com `size` de exibição), `responseSpaceMm` (área em branco na folha impressa), `formImage` (formulário original usado como folha em branco), `options[].description` (âncora descritiva por grau), `reverse` (inversão), `scored: false` (item fora do total), `optional`, `showIf` (salto), `isRedFlagTrigger` + `redFlagThreshold` (alerta), `subscale`, `section`, `scoreLabel`.

## Impressão e PDF

- **Imprimir ou salvar como PDF** usa `window.print()` com as regras de `index.css`: `@page { size: A4 }`, `.no-print` oculta navegação e painéis, `.avoid-break` impede que um item seja cortado entre páginas e `print-color-adjust: exact` preserva a régua colorida. O PDF sai vetorial e pesquisável. É o caminho recomendado.
- **Baixar arquivo PDF** usa html2pdf.js. É prático, mas gera o conteúdo como imagem.
- A folha (`.sheet`) usa cores fixas e claras, independentemente do tema da interface.

## Privacidade (LGPD)

Respostas e dados de identificação ficam apenas na memória da aba. Não há backend, banco, cookies nem telemetria. O único dado gravado no navegador é a preferência de tema. Se for acrescentar persistência, trate como dado sensível de saúde.

## Cobertura do catálogo

| Domínio | Instrumentos |
| --- | --- |
| Humor | PHQ-9, HAM-D 17, MADRS, EPDS, GDS-15, MDQ, HCL-32, YMRS |
| Ansiedade, TOC e trauma | GAD-7, HAM-A, LSAS, Y-BOCS, PCL-5 |
| Neurodesenvolvimento e infância | M-CHAT-R, AQ-50, ASRS-v1.1, SNAP-IV, SDQ |
| Psicose e esquizofrenia | BPRS, PANSS, Calgary (CDSS), Bush-Francis |
| Uso de substâncias | AUDIT, CAGE, CIWA-Ar, COWS, DAST-10, Fagerström |
| Neurocognição | MEEM, MoCA, TDR (relógio), BAF (FAB), CAM, CDR, Pfeffer |
| Funcionalidade e cuidador | Katz (ABVD), Lawton (AIVD), WHODAS 2.0, AGF, Zarit |
| Comportamento alimentar | EAT-26 |
| Sono | ISI |
| Impressão global e efeitos adversos | CGI, AIMS, Simpson-Angus, Barnes |
| Risco e segurança | C-SSRS |

Lacunas conhecidas: escalas de risco de violência (HCR-20, licenciada), instrumentos diagnósticos de TEA (ADOS-2 e ADI-R, que exigem certificação e material próprio), BDI-II e BAI (Pearson), Epworth, e escalas de personalidade.

## Antes de usar na assistência

- **TDR.** O teste é de domínio público, mas existem mais de dez sistemas de pontuação com faixas diferentes. Esta aplicação usa o julgamento global de 0 a 5 de Shulman, o mesmo da validação brasileira de Atalaia-Silva e Lourenço (2008). Registre sempre o sistema usado: escores de sistemas diferentes não são comparáveis. A folha de aplicação e os seis relógios de exemplo são desenhos próprios.
- **BAF.** As quatro ilustrações são esquemas próprios feitos para orientar o examinador, e não material original do teste. As âncoras estão em tradução de trabalho a partir da versão brasileira de Beato et al. (2007). O corte de 12 pontos vem da amostra original, de escolaridade alta: use os dados normativos brasileiros por anos de estudo (Beato et al., 2012).
- **MoCA.** O formulário e as figuras vêm do arquivo fornecido pelo serviço (versão experimental brasileira, UNIFESP 2007, © Z. Nasreddine). O uso clínico exige treinamento e certificação, e a incorporação em software exige licença (mocacognition.com). Mantenha para uso interno e regularize antes de distribuir.
- **MEEM.** Itens conforme o modelo de formulário fornecido (orientação com "estação", palavras PENTE, RUA, AZUL). Os pentágonos são um SVG próprio. O MMSE original é administrado pela PAR, Inc.
- **PANSS.** Continua só com os nomes dos itens: os critérios de pontuação são propriedade da MHS e não foram reproduzidos.
- **Âncoras completas (HAM-D, YMRS, MADRS, CIWA-Ar) e itens de ASRS, PCL-5, MDQ, DAST-10, AUDIT, C-SSRS, ISI, AIMS.** Estão em tradução de trabalho: confira com a versão brasileira validada antes do uso formal. PHQ-9, GAD-7, EPDS, GDS-15, SNAP-IV, Fagerström, CAGE e Pfeffer seguem a redação das versões brasileiras, transcrita de memória, e também devem ser conferidas.
- **Não incluídas por restrição de licença:** BDI-II e BAI (Pearson), Epworth, HCR-20, ADOS-2 e ADI-R.
- **Instrumentos que exigem etapa fora do aplicativo:** M-CHAT-R (entrevista de seguimento M-CHAT-R/F), Bush-Francis (escala completa de 23 itens), Y-BOCS (checklist de sintomas), EAT-26 (dados antropométricos e perguntas sobre comportamentos compensatórios).
- **Números de acurácia e pontos de corte.** Conferir nas fontes primárias citadas em cada aba.
- **Protocolo de crise.** Ajuste `SUICIDE_PROTOCOL` (lib/scoring.ts) e `cssrs.ts` ao fluxo do seu serviço.
