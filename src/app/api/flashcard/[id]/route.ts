import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth/[...nextauth]/route';

// PATCH: Modifier une flashcard (recto, verso, hint)
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  // Vérifier que la flashcard appartient à l'utilisateur
  const card = await prisma.flashcard.findFirst({ where: { id: params.id, flashcardSet: { userId } } });
  if (!card) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const updated = await prisma.flashcard.update({
    where: { id: params.id },
    data: { recto: data.recto, verso: data.verso, hint: data.hint },
  });
  return NextResponse.json(updated);
}

// DELETE: Supprimer une flashcard
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  // Vérifier que la flashcard appartient à l'utilisateur
  const card = await prisma.flashcard.findFirst({ where: { id: params.id, flashcardSet: { userId } } });
  if (!card) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  await prisma.flashcard.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
