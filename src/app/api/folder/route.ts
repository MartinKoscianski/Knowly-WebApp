import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from '../auth/[...nextauth]/route';

// GET: Liste les dossiers de l'utilisateur connecté
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json([], { status: 401 });
  }
  const folders = await prisma.folder.findMany({ where: { userId } });
  return NextResponse.json(folders);
}

// POST: Crée un nouveau dossier pour l'utilisateur connecté
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await request.json();
  const folder = await prisma.folder.create({ data: { ...data, userId } });
  return NextResponse.json(folder);
}
