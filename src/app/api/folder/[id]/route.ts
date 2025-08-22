import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Récupère un dossier par ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const folder = await prisma.folder.findUnique({ where: { id } });
  if (!folder) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(folder);
}

// PATCH: Renomme un dossier
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { name } = await request.json();
  const folder = await prisma.folder.update({
    where: { id },
    data: { name }
  });
  return NextResponse.json(folder);
}

// DELETE: Supprime un dossier
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.folder.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
