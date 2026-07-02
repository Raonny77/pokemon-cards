import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Preencha todos os campos" },
        { status: 400 }
      );
    }

    const usuarioExistente = await prisma.user.findUnique({
      where: { email },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { success: false, error: "Este e-mail ja esta cadastrado" },
        { status: 400 }
      );
    }

    const senhaCriptografada = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: senhaCriptografada,
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("ERRO NO CADASTRO:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao cadastrar usuario" },
      { status: 500 }
    );
  }
}
