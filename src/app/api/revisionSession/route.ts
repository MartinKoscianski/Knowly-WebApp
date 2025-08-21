import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Liste toutes les sessions de révision
export async function GET() {
  const sessions = await prisma.revisionSession.findMany();
  return NextResponse.json(sessions);
}

// POST: Crée une nouvelle session de révision
export async function POST(request: Request) {
  const data = await request.json();
  const session = await prisma.revisionSession.create({ data });
  return NextResponse.json(session);
}
