import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Récupère un dossier par ID
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const folder = await prisma.folder.findUnique({ where: { id: params.id } });
  if (!folder) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(folder);
}

// PATCH: Renomme un dossier
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { name } = await req.json();
  const folder = await prisma.folder.update({ where: { id: params.id }, data: { name } });
  return NextResponse.json(folder);
}

// DELETE: Supprime un dossier
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.folder.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
