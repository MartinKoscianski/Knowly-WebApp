import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth/[...nextauth]/route';

// PATCH: Déplacer un set dans un autre dossier
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { setId, newFolderId } = await request.json();
  // Vérifier que le set appartient à l'utilisateur
  const set = await prisma.flashcardSet.findUnique({ where: { id: setId, userId } });
  if (!set) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // Déplacer le set
  await prisma.flashcardSet.update({ where: { id: setId }, data: { folderId: newFolderId } });
  return NextResponse.json({ ok: true });
}
