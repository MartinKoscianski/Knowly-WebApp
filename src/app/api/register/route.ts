import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, password } = await req.json();
  if (!name || !password) {
    return NextResponse.json({ error: "Missing name or password" }, { status: 400 });
  }
  const existing = await prisma.user.findFirst({ where: { name } });
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, password: hashed },
  });
  return NextResponse.json({ id: user.id, name: user.name });
}
