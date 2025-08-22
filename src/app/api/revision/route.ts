import { z } from "zod";
// POST: Enregistrer le résultat d'une révision
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user && 'id' in session.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const schema = z.object({
    flashcardId: z.string(),
    result: z.enum(["su", "non_su"]),
  });
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { flashcardId, result } = parsed.data;

  // Récupérer la flashcard
  const flashcard = await prisma.flashcard.findUnique({
    where: { id: flashcardId },
    include: { flashcardSet: true },
  });
  if (!flashcard || flashcard.flashcardSet.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Calcul de la prochaine date de révision
  let nextReview = new Date();
  let reviewCount = flashcard.reviewCount ?? 0;
  if (result === "su") {
    reviewCount++;
  // Espacement personnalisé : 1, 3, 7, 12, 30, 90, 210 jours
  const days = [1, 3, 7, 12, 30, 90, 210];
  const addDays = days[Math.min(reviewCount - 1, days.length - 1)];
  nextReview.setDate(nextReview.getDate() + addDays);
  } else {
    // "Non su" : remettre la carte au fond de la pile, retirer un niveau (min 0), prochaine révision = aujourd'hui
    reviewCount = Math.max(0, reviewCount - 1);
    // nextReview = aujourd'hui (déjà fait)
  }

  await prisma.flashcard.update({
    where: { id: flashcardId },
    data: {
      reviewCount,
      nextReview,
      lastReviewed: new Date(),
    },
  });

  return NextResponse.json({ success: true });
}
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET: Récupérer les flashcards à réviser aujourd'hui pour l'utilisateur connecté
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !(session.user && 'id' in session.user)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Récupérer toutes les flashcards dont nextReview est null ou <= aujourd'hui
  const flashcards = await prisma.flashcard.findMany({
    where: {
      flashcardSet: {
        userId: (session.user as any).id,
      },
      OR: [
        { nextReview: null },
        { nextReview: { lte: today } },
      ],
    },
    include: {
      flashcardSet: true,
    },
    orderBy: {
      nextReview: "asc",
    },
  });

  return NextResponse.json(flashcards);
}
