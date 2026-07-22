import { redirect } from "next/navigation";
import { BACKGROUND_CATALOG, getEffectMeta } from "@/lib/backgrounds";

// /biblioteca abre direto no estúdio, no item padrão.
const DEFAULT_ID = getEffectMeta("gradientblinds") ? "gradientblinds" : BACKGROUND_CATALOG[0].id;

export default function BibliotecaIndexPage() {
  redirect(`/biblioteca/${DEFAULT_ID}`);
}
