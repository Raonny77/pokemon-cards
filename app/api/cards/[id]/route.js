import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getUserFromRequest } from "@/lib/getUserFromRequest";

// Busca um card especifico
export async function GET(request, { params }) {
  const usuario = getUserFromRequest();

  if (!usuario) {
    return NextResponse.json(
      { success: false, error: "Nao autenticado" },
      { status: 401 }
    );
  }

  const card = await prisma.card.findFirst({
    where: { id: Number(params.id), userId: usuario.id },
  });

  if (!card) {
    return NextResponse.json(
      { success: false, error: "Card nao encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: card });
}

// Edita um card existente
export async function PUT(request, { params }) {
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

    const cardExistente = await prisma.card.findFirst({
      where: { id: Number(params.id), userId: usuario.id },
    });

    if (!cardExistente) {
      return NextResponse.json(
        { success: false, error: "Card nao encontrado" },
        { status: 404 }
      );
    }

    const card = await prisma.card.update({
      where: { id: Number(params.id) },
      data: {
        name,
        type,
        hp: Number(hp),
        attack,
        description,
        image,
        rarity,
      },
    });

    return NextResponse.json({ success: true, data: card });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao editar card" },
      { status: 500 }
    );
  }
}

// Exclui um card
export async function DELETE(request, { params }) {
  const usuario = getUserFromRequest();

  if (!usuario) {
    return NextResponse.json(
      { success: false, error: "Nao autenticado" },
      { status: 401 }
    );
  }

  const cardExistente = await prisma.card.findFirst({
    where: { id: Number(params.id), userId: usuario.id },
  });

  if (!cardExistente) {
    return NextResponse.json(
      { success: false, error: "Card nao encontrado" },
      { status: 404 }
    );
  }

  await prisma.card.delete({ where: { id: Number(params.id) } });

  return NextResponse.json({ success: true, data: null });
}
