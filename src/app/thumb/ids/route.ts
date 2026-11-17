import { NextResponse } from "next/server";
import { BACKGROUND_CATALOG } from "@/lib/backgrounds";

// Lista dos ids do lab, para o script que gera as miniaturas.
export function GET() {
  return NextResponse.json(BACKGROUND_CATALOG.map((e) => ({ id: e.id, componente: e.kind === "component" })));
}
