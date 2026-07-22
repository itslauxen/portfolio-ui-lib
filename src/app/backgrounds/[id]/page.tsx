import { redirect } from "next/navigation";

// Rota antiga: cada item da biblioteca agora vive em /biblioteca/[id].
export default function BackgroundItemRedirect({ params }: { params: { id: string } }) {
  redirect(`/biblioteca/${params.id}`);
}
