import { redirect } from "next/navigation";

// Rota antiga: a biblioteca agora vive em /biblioteca.
export default function BackgroundsRedirect() {
  redirect("/biblioteca");
}
