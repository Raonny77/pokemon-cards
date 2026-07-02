import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

// Le o token do cookie e retorna o usuario logado (ou null)
export function getUserFromRequest() {
  const token = cookies().get("token")?.value;

  if (!token) return null;

  return verifyToken(token);
}
