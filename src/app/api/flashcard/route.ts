import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/route';

// GET: Liste les flashcards d'un set pour l'utilisateur connecté
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json([], { status: 401 });
  const { searchParams } = new URL(req.url);
  const setId = searchParams.get('setId');
  if (!setId) return NextResponse.json([], { status: 400 });
  const cards = await prisma.flashcard.findMany({
    where: { flashcardSetId: setId, flashcardSet: { userId } },
    orderBy: { positionInSet: 'asc' },
  });
  return NextResponse.json(cards);
}

// POST: Crée une flashcard dans un set
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  if (!data.flashcardSetId || !data.recto || !data.verso) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  // Vérifier que le set appartient à l'utilisateur
  const set = await prisma.flashcardSet.findFirst({ where: { id: data.flashcardSetId, userId } });
  if (!set) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  // Calculer la position
  const count = await prisma.flashcard.count({ where: { flashcardSetId: data.flashcardSetId } });
  const card = await prisma.flashcard.create({
    data: {
      recto: data.recto,
      verso: data.verso,
      hint: data.hint || null,
      flashcardSetId: data.flashcardSetId,
      positionInSet: count,
    },
  });
  return NextResponse.json(card);
}
