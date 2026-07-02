import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true, data: null });

  // Remove o cookie do token, encerrando a sessao
  response.cookies.set("token", "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
  });

  return response;
}
