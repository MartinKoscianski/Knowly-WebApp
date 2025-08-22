import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth/[...nextauth]/route';
import { NextRequest, NextResponse } from 'next/server';


// PATCH: Modifier une flashcard (recto, verso, hint)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();

  const card = await prisma.flashcard.findFirst({
    where: { id, flashcardSet: { userId } }
  });
  if (!card) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const updated = await prisma.flashcard.update({
    where: { id },
    data: { recto: data.recto, verso: data.verso, hint: data.hint },
  });

  return NextResponse.json(updated);
}


// DELETE: Supprimer une flashcard
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const card = await prisma.flashcard.findFirst({
    where: { id, flashcardSet: { userId } }
  });
  if (!card) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.flashcard.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}

