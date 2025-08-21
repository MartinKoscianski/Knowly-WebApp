import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from '../../auth/[...nextauth]/route';

// PATCH: Déplacer un dossier (et ses sets) dans un autre dossier
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { folderId, newParentId } = await request.json();
  // Vérifier que le dossier appartient à l'utilisateur
  const folder = await prisma.folder.findUnique({ where: { id: folderId, userId } });
  if (!folder) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  // Déplacer le dossier
  await prisma.folder.update({ where: { id: folderId }, data: { parentFolderId: newParentId } });
  // Les sets restent liés au dossier, donc rien à faire pour eux
  return NextResponse.json({ ok: true });
}
