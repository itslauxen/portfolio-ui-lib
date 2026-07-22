// ============================================================================
// Modelo de dados central do site.
// Tudo (animações, backgrounds, prompts) implementa BaseAsset, então a
// biblioteca consegue buscar/filtrar por cima de um catálogo unificado.
// ============================================================================

export type AssetKind = "animation" | "background" | "prompt";

/** Trecho de código copiável mostrado em um asset. */
export interface CodeSnippet {
  /** "css" | "tsx" | "js" | "html" ... usado para o rótulo/realce. */
  language: string;
  /** Rótulo opcional exibido na aba (ex.: "CSS", "HTML"). */
  label?: string;
  code: string;
}

/** Campos comuns a qualquer item da biblioteca. */
export interface BaseAsset {
  id: string;
  /** Usado na URL: /animacoes/[slug]. Único dentro do tipo. */
  slug: string;
  kind: AssetKind;
  title: string;
  description: string;
  tags: string[];
  /** Data ISO (YYYY-MM-DD), usada para ordenar por mais recente. */
  createdAt: string;
  /** Aparece em destaque na home quando true. */
  featured?: boolean;
}

export interface AnimationAsset extends BaseAsset {
  kind: "animation";
  /**
   * Id do preview ao vivo registrado em src/previews/registry.tsx.
   * Deixe vazio se ainda não houver preview, o card mostra só o código.
   */
  previewId?: string;
  snippets: CodeSnippet[];
}

export interface BackgroundAsset extends BaseAsset {
  kind: "background";
  previewId?: string;
  snippets: CodeSnippet[];
}

export interface PromptAsset extends BaseAsset {
  kind: "prompt";
  /** O texto do prompt em si (o que é copiado). */
  prompt: string;
  /** Ferramenta/modelo alvo, ex.: "Midjourney", "ChatGPT", "Claude". */
  model?: string;
  /** Categoria temática, ex.: "Imagem", "Código", "Escrita". */
  category: string;
}

export type LibraryAsset = AnimationAsset | BackgroundAsset | PromptAsset;

// ---------------------------------------------------------------------------
// Portfólio (vitrine)
// ---------------------------------------------------------------------------

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  year: string;
  /** Link para o projeto ao vivo (opcional). */
  url?: string;
  /** Link para o repositório (opcional). */
  repo?: string;
  /** Caminho da imagem de capa em /public (opcional). */
  cover?: string;
  /** Id de um efeito da biblioteca para preview AO VIVO no card do projeto
   *  (opcional; tem prioridade sobre `cover`). */
  previewEffect?: string;
  /** Aparece em destaque na home quando true. */
  featured?: boolean;
}

export interface Skill {
  name: string;
  /** 0–100 para a barra de proficiência. */
  level: number;
  category: string;
}

export interface Profile {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  location?: string;
  email?: string;
  socials: { label: string; url: string }[];
}
