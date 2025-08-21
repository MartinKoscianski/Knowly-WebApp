import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth/[...nextauth]/route';

// GET: Récupère un set par ID (si propriétaire)
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const set = await prisma.flashcardSet.findFirst({ where: { id: params.id, userId } });
  if (!set) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(set);
}

// PATCH: Modifier un set (nom, description)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await req.json();
  const set = await prisma.flashcardSet.update({
    where: { id: params.id, userId },
    data: { name: data.name, description: data.description },
  });
  return NextResponse.json(set);
}
