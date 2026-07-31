// Artigos do "blog" do portfólio. Conteúdo bilíngue por bloco.
// Adicione novos artigos aqui; a página /artigos/[slug] os renderiza.

export type ArticleBlock =
  | { type: "h2"; pt: string; en: string }
  | { type: "p"; pt: string; en: string }
  | { type: "ul"; pt: string[]; en: string[] }
  | { type: "table"; head: { pt: string; en: string }[]; rows: { pt: string; en: string }[][] };

export interface Article {
  slug: string;
  date: string;
  readMins: number;
  title: { pt: string; en: string };
  subtitle: { pt: string; en: string };
  blocks: ArticleBlock[];
}

export const articles: Article[] = [
  {
    slug: "not-hard-just-wide",
    date: "2025",
    readMins: 7,
    title: { pt: "Não é difícil, é amplo", en: "Not Hard, Just Wide" },
    subtitle: {
      pt: "Migrando uma plataforma de 300 marcas para fora do Material UI v4",
      en: "Migrating a 300-brand platform off Material UI v4",
    },
    blocks: [
      {
        type: "p",
        en: "Our production build took 54.5 seconds. Our dev server took about a minute to start. With five developers hitting that several times a day, it was the kind of cost you stop noticing because it's always been there.",
        pt: "Nosso build de produção levava 54,5 segundos. Nosso dev server levava cerca de um minuto pra subir. Com cinco desenvolvedores batendo nisso várias vezes por dia, era aquele tipo de custo que você para de notar porque sempre esteve ali.",
      },
      {
        type: "p",
        en: "But the build times weren't the real problem. They were the symptom I could measure.",
        pt: "Mas os tempos de build não eram o problema de verdade. Eram o sintoma que eu conseguia medir.",
      },
      { type: "h2", en: "The actual problem", pt: "O problema de verdade" },
      {
        type: "p",
        en: "The platform — a white-label CRM and messaging product spread across six repositories — was pinned to Node 16. Not by choice. Material UI v4 was what held us there, and every attempt to move Node forward ran into it.",
        pt: "A plataforma — um CRM e produto de mensageria whitelabel espalhado por seis repositórios — estava presa ao Node 16. Não por escolha. O Material UI v4 era o que nos segurava ali, e toda tentativa de avançar o Node esbarrava nele.",
      },
      {
        type: "p",
        en: "What made this stubborn wasn't technical difficulty. There was no clever fix to find, no subtle bug to chase. Getting off MUI v4 means going to v5, and v5 replaces JSS with Emotion. That's not a dependency bump — it's rewriting the styling layer of every component in the application.",
        pt: "O que tornava isso teimoso não era dificuldade técnica. Não havia solução esperta a achar, nem bug sutil a caçar. Sair do MUI v4 significa ir pro v5, e o v5 troca o JSS pelo Emotion. Isso não é atualizar uma dependência — é reescrever a camada de estilo de cada componente da aplicação.",
      },
      { type: "p", en: "So the problem wasn't hard. It was wide.", pt: "Então o problema não era difícil. Era amplo." },
      {
        type: "p",
        en: "That distinction matters, because wide problems rot differently than hard ones. A hard problem attracts attention; someone eventually finds it interesting enough to solve. A wide problem just sits there, because no individual piece is difficult and the whole thing is enormous. Nobody wants to be the person who touches every component in the codebase.",
        pt: "Essa distinção importa, porque problemas amplos apodrecem diferente dos difíceis. Um problema difícil atrai atenção; alguém acaba achando ele interessante o bastante pra resolver. Um problema amplo só fica ali parado, porque nenhuma peça isolada é difícil e o todo é enorme. Ninguém quer ser a pessoa que mexe em cada componente do código.",
      },
      { type: "h2", en: "It was also a chain", pt: "Também era uma corrente" },
      {
        type: "p",
        en: "Once I mapped it out, there was no incremental path:",
        pt: "Depois que mapeei, não havia caminho incremental:",
      },
      {
        type: "ul",
        en: [
          "Node 16 was pinned by MUI v4",
          "Getting off MUI v4 means MUI v5",
          "MUI v5 needs React 18",
          "React 18 with our setup meant replacing the build",
        ],
        pt: [
          "Node 16 estava preso pelo MUI v4",
          "Sair do MUI v4 significa MUI v5",
          "MUI v5 precisa de React 18",
          "React 18 no nosso setup significava trocar o build",
        ],
      },
      {
        type: "p",
        en: "Four upgrades, none of which could ship independently. Any attempt to stage them would have left the app in a state that didn't build. It had to go through as one piece.",
        pt: "Quatro upgrades, nenhum deles podia ir ao ar de forma independente. Qualquer tentativa de fatiar teria deixado o app num estado que não buildava. Tinha que passar como uma peça só.",
      },
      { type: "h2", en: "What made it feasible", pt: "O que tornou viável" },
      {
        type: "p",
        en: "Here's the part I want to actually make a point about.",
        pt: "Aqui está a parte sobre a qual eu quero mesmo fazer um ponto.",
      },
      {
        type: "p",
        en: "A month before any of this, I'd been working on something unrelated — or so I thought. The platform is white-label, with 300+ partner brands each needing their own look, and every screen was solving that independently. The same component reimplemented in several places with slightly different styling. Fix a bug in one, and it stayed broken in the others.",
        pt: "Um mês antes de tudo isso, eu estava trabalhando em algo sem relação — ou eu achava. A plataforma é whitelabel, com mais de 300 marcas parceiras, cada uma precisando do seu visual, e cada tela resolvia isso de forma independente. O mesmo componente reimplementado em vários lugares com estilos ligeiramente diferentes. Corrija um bug em um, e ele seguia quebrado nos outros.",
      },
      {
        type: "p",
        en: "So I built a design system: design tokens for the theming layer, a shared component library on top, and a feature-based restructuring of the codebase so it was obvious where things lived.",
        pt: "Então construí um design system: design tokens pra camada de tema, uma biblioteca de componentes compartilhada por cima, e uma reestruturação do código por feature pra ficar óbvio onde cada coisa morava.",
      },
      {
        type: "p",
        en: "I built it for consistency. What it actually bought me was a cheap migration.",
        pt: "Construí pensando em consistência. O que ele de fato me deu foi uma migração barata.",
      },
      {
        type: "p",
        en: "By the time I started, most of the platform was composing a small set of shared components rather than styling screens one by one. The surface that could break had collapsed. Instead of every screen being a risk, only the root components were.",
        pt: "Quando comecei, a maior parte da plataforma compunha um pequeno conjunto de componentes compartilhados em vez de estilizar tela por tela. A superfície que podia quebrar havia encolhido. Em vez de cada tela ser um risco, só os componentes-raiz eram.",
      },
      {
        type: "p",
        en: "I didn't make the migration safe by testing harder. I made it safe by shrinking what could break.",
        pt: "Eu não tornei a migração segura testando mais. Tornei segura encolhendo o que podia quebrar.",
      },
      { type: "h2", en: "Execution", pt: "Execução" },
      {
        type: "p",
        en: "The work itself was mechanical, which is what made two weeks realistic. @mui/codemod handled the bulk of the v4 → v5 transformation. Large-scale search and replace handled most of the rest. Wide problems are exactly the kind that tooling is good at — the reason they don't get solved isn't capability, it's appetite.",
        pt: "O trabalho em si era mecânico, e foi isso que tornou duas semanas realista. O @mui/codemod cuidou da maior parte da transformação v4 → v5. Busca e substituição em larga escala cuidaram de quase todo o resto. Problemas amplos são exatamente o tipo em que ferramentas são boas — o motivo de não serem resolvidos não é capacidade, é apetite.",
      },
      { type: "h2", en: "Validating it", pt: "Validando" },
      {
        type: "p",
        en: "The risk here isn't functional. When you swap a styling engine, your tests keep passing and your screens come out subtly wrong. Unit tests don't catch a button with the wrong padding.",
        pt: "O risco aqui não é funcional. Quando você troca o motor de estilo, seus testes continuam passando e suas telas saem sutilmente erradas. Testes unitários não pegam um botão com o padding errado.",
      },
      {
        type: "p",
        en: "So I validated in layers, each catching a different failure mode:",
        pt: "Então validei em camadas, cada uma pegando um modo de falha diferente:",
      },
      {
        type: "ul",
        en: [
          "Codemods — mechanical consistency across thousands of files, no human typos",
          "Manual QA with the dev team — technical breakage and behavior",
          "A week in staging with our sales team — the visual layer",
        ],
        pt: [
          "Codemods — consistência mecânica em milhares de arquivos, sem erros de digitação humanos",
          "QA manual com o time de dev — quebras técnicas e comportamento",
          "Uma semana em staging com nosso time de vendas — a camada visual",
        ],
      },
      {
        type: "p",
        en: "That third one did the real work. Our sales team lives in that CRM every day. They know what every screen is supposed to look like in a way no test suite encodes, and they notice wrongness immediately. Giving them a week of normal use was worth more than any snapshot test I could have written in the same time.",
        pt: "A terceira fez o trabalho de verdade. Nosso time de vendas vive naquele CRM todo dia. Eles sabem como cada tela deveria parecer de um jeito que nenhuma suíte de testes codifica, e notam o errado na hora. Dar a eles uma semana de uso normal valeu mais que qualquer snapshot test que eu escrevesse no mesmo tempo.",
      },
      {
        type: "p",
        en: "What they found was narrow: paddings on buttons, selects and text fields. And because those were shared components, fixing them at the root and in the global styles fixed them everywhere at once — which is the design system paying for itself a second time.",
        pt: "O que acharam foi estreito: paddings em botões, selects e campos de texto. E como eram componentes compartilhados, corrigir na raiz e nos estilos globais corrigia em todo lugar de uma vez — o design system se pagando pela segunda vez.",
      },
      { type: "h2", en: "Results", pt: "Resultados" },
      {
        type: "table",
        head: [
          { pt: "", en: "" },
          { pt: "Antes", en: "Before" },
          { pt: "Depois", en: "After" },
        ],
        rows: [
          [
            { pt: "Build de produção (frio)", en: "Production build (cold)" },
            { pt: "54,5s", en: "54.5s" },
            { pt: "2,3s", en: "2.3s" },
          ],
          [
            { pt: "Build de produção (Webpack, cache quente)", en: "Production build (Webpack warm cache)" },
            { pt: "22,4s", en: "22.4s" },
            { pt: "—", en: "—" },
          ],
          [
            { pt: "Dev server (início frio)", en: "Dev server cold start" },
            { pt: "~60s", en: "~60s" },
            { pt: "~80ms", en: "~80ms" },
          ],
          [
            { pt: "Versão do Node", en: "Node version" },
            { pt: "Presa no 16", en: "Pinned to 16" },
            { pt: "Livre", en: "Unpinned" },
          ],
        ],
      },
      {
        type: "p",
        en: "About 24× faster on production builds. Even measured against Webpack's best case — a warm babel-loader cache — it's still roughly 10×, and Vite delivers 2.3s consistently rather than depending on cache state. Predictability turned out to matter as much as the raw number.",
        pt: "Cerca de 24× mais rápido nos builds de produção. Mesmo medindo contra o melhor caso do Webpack — cache quente do babel-loader — ainda é uns 10×, e o Vite entrega 2,3s de forma consistente em vez de depender do estado do cache. Previsibilidade acabou importando tanto quanto o número bruto.",
      },
      {
        type: "p",
        en: "The dev server change is different in kind, not just degree. Webpack bundles the whole application before serving anything. Vite serves native ESM and transforms only the module the browser asks for, so startup doesn't scale with project size. Eighty milliseconds on a six-repository platform is the same eighty milliseconds you'd get on a toy app.",
        pt: "A mudança no dev server é diferente em tipo, não só em grau. O Webpack empacota a aplicação inteira antes de servir qualquer coisa. O Vite serve ESM nativo e transforma só o módulo que o navegador pede, então o start não escala com o tamanho do projeto. Oitenta milissegundos numa plataforma de seis repositórios são os mesmos oitenta milissegundos de um app de brinquedo.",
      },
      { type: "h2", en: "What I'd do differently", pt: "O que eu faria diferente" },
      {
        type: "p",
        en: "Automated visual regression testing — Chromatic, Percy, or Playwright snapshots — would have given us a repeatable safety net instead of a one-time human effort. The manual QA worked, but it doesn't scale and it won't be there for the next migration.",
        pt: "Testes automatizados de regressão visual — Chromatic, Percy ou snapshots do Playwright — teriam dado uma rede de segurança repetível em vez de um esforço humano único. O QA manual funcionou, mas não escala e não vai estar lá na próxima migração.",
      },
      {
        type: "p",
        en: "I'd also want broader theme coverage in staging. With 300 partner brands, a component that's correct under one theme isn't necessarily correct under all of them.",
        pt: "Eu também gostaria de uma cobertura de temas mais ampla em staging. Com 300 marcas parceiras, um componente correto sob um tema não é necessariamente correto sob todos.",
      },
      { type: "h2", en: "The takeaway", pt: "A lição" },
      {
        type: "p",
        en: "The lesson here isn't about Vite, and it isn't really about Material UI.",
        pt: "A lição aqui não é sobre o Vite, e nem é realmente sobre o Material UI.",
      },
      {
        type: "p",
        en: "It's that the moment to invest in shared architecture is before you need it. The design system didn't justify itself through visual consistency, though it delivered that. It justified itself by making an expensive change cheap — and by then it was already in place, which is the only way that ever works.",
        pt: "É que o momento de investir em arquitetura compartilhada é antes de você precisar dela. O design system não se justificou pela consistência visual, embora tenha entregue isso. Ele se justificou tornando uma mudança cara em barata — e a essa altura já estava no lugar, que é a única forma de isso funcionar.",
      },
    ],
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
