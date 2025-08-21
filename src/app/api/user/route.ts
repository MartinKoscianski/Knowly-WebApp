import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Liste tous les utilisateurs
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// POST: Crée un nouvel utilisateur
export async function POST(request: Request) {
  const data = await request.json();
  const user = await prisma.user.create({ data });
  return NextResponse.json(user);
}
