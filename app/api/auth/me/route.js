import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const token = cookies().get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Nao autenticado" },
      { status: 401 }
    );
  }

  const usuario = verifyToken(token);

  if (!usuario) {
    return NextResponse.json(
      { success: false, error: "Token invalido" },
      { status: 401 }
    );
  }

  return NextResponse.json({ success: true, data: usuario });
}
