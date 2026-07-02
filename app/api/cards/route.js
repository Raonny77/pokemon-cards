import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

// Lista os cards do usuario logado (com busca opcional por nome)
export async function GET(request) {
  const usuario = getUserFromRequest();

  if (!usuario) {
    return NextResponse.json(
      { success: false, error: "Nao autenticado" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const nome = searchParams.get("nome");

  const cards = await prisma.card.findMany({
    where: {
      userId: usuario.id,
      ...(nome && {
        name: { contains: nome, mode: "insensitive" },
      }),
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: cards });
}

// Cria um novo card
export async function POST(request) {
  const usuario = getUserFromRequest();

  if (!usuario) {
    return NextResponse.json(
      { success: false, error: "Nao autenticado" },
      { status: 401 }
    );
  }

  try {
    const { name, type, hp, attack, description, image, rarity } =
      await request.json();

    if (!name || !type || !hp || !attack || !description || !image || !rarity) {
      return NextResponse.json(
        { success: false, error: "Preencha todos os campos" },
        { status: 400 }
      );
    }

    const card = await prisma.card.create({
      data: {
        name,
        type,
        hp: Number(hp),
        attack,
        description,
        image,
        rarity,
        userId: usuario.id,
      },
    });

    return NextResponse.json({ success: true, data: card });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao criar card" },
      { status: 500 }
    );
  }
}
