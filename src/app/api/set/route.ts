import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/route';

// GET: Liste les sets d'un dossier pour l'utilisateur connecté
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json([], { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const folderId = searchParams.get('folderId');
  if (!folderId) return NextResponse.json([], { status: 400 });
  const sets = await prisma.flashcardSet.findMany({ where: { userId, folderId } });
  return NextResponse.json(sets);
}

// POST: Crée un set dans un dossier pour l'utilisateur connecté
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await request.json();
  if (!data.folderId || !data.name) {
    return NextResponse.json({ error: 'Missing folderId or name' }, { status: 400 });
  }
  const set = await prisma.flashcardSet.create({ data: { ...data, userId } });
  return NextResponse.json(set);
}
