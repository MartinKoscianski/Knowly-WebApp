import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Liste tous les sets de flashcards
export async function GET() {
  const sets = await prisma.flashcardSet.findMany();
  return NextResponse.json(sets);
}

// POST: Crée un nouveau set de flashcards
export async function POST(request: Request) {
  const data = await request.json();
  const set = await prisma.flashcardSet.create({ data });
  return NextResponse.json(set);
}
