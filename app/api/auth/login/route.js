import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Preencha todos os campos" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "E-mail ou senha invalidos" },
        { status: 401 }
      );
    }

    const senhaCorreta = await comparePassword(password, user.password);

    if (!senhaCorreta) {
      return NextResponse.json(
        { success: false, error: "E-mail ou senha invalidos" },
        { status: 401 }
      );
    }

    const token = generateToken(user);

    const response = NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
    });

    // Salva o token em um cookie httpOnly (controle de sessao)
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("ERRO NO LOGIN:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao fazer login" },
      { status: 500 }
    );
  }
}
