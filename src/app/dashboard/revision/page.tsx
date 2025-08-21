"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";

interface Flashcard {
  id: string;
  recto: string;
  verso: string;
  hint?: string;
  flashcardSet: { name: string };
}

export default function RevisionPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [showVerso, setShowVerso] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/revision")
      .then((res) => res.json())
      .then((data) => {
        setFlashcards(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Chargement…</div>;
  if (flashcards.length === 0) return <div className="p-8">Aucune carte à réviser aujourd'hui 🎉</div>;

  const card = flashcards[current];
  if (!card || !card.flashcardSet) {
    return <div className="p-8">Erreur de chargement des cartes. Veuillez réessayer.</div>;
  }

  function handleFlip() {
    setShowVerso((v) => !v);
  }


  async function handleResult(result: "su" | "non_su") {
    const cardId = flashcards[current].id;
    await fetch("/api/revision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flashcardId: cardId, result }),
    });
    setShowVerso(false);
    setShowHint(false);
    if (result === "su") {
      // Retirer la carte du tableau (elle est apprise)
      setFlashcards((prev) => prev.filter((c, i) => i !== current));
      // Si on était à la dernière carte, reculer l'index
      setCurrent((c) => (c >= flashcards.length - 1 ? 0 : c));
    } else {
      // Remettre la carte à la fin du tableau
      setFlashcards((prev) => {
        const card = prev[current];
        const newArr = prev.filter((_, i) => i !== current);
        newArr.push(card);
        return newArr;
      });
      // Passer à la carte suivante (qui a pris la place)
      setCurrent((c) => (c >= flashcards.length - 1 ? 0 : c));
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <div className="mb-4 text-gray-500 text-sm">{current + 1} / {flashcards.length} cartes</div>
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 text-center cursor-pointer select-none transition-transform hover:scale-105"
        onClick={handleFlip}
      >
        <div className="font-bold text-lg mb-2">{card.flashcardSet.name}</div>
        {!showVerso ? (
          <>
            <div className="text-2xl min-h-[3rem]">{card.recto}</div>
            {card.hint && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mt-2 mb-1"
                onClick={e => { e.stopPropagation(); setShowHint(h => !h); }}
                aria-label="Afficher l'indice"
              >
                <Lightbulb className={showHint ? "text-yellow-400" : "text-gray-400"} />
              </Button>
            )}
            {showHint && card.hint && (
              <div className="text-xs text-yellow-600">Indice : {card.hint}</div>
            )}
            <div className="mt-4 text-xs text-gray-400">Clique pour retourner la carte</div>
          </>
        ) : (
          <>
            <div className="text-2xl min-h-[3rem]">{card.verso}</div>
            <div className="mt-4 text-xs text-gray-400">Clique pour voir le recto</div>
          </>
        )}
      </div>
      <div className="flex gap-4 mt-8">
        <Button
          variant="outline"
          onClick={() => handleResult("non_su")}
          disabled={current >= flashcards.length}
        >
          Non su
        </Button>
        <Button
          onClick={() => handleResult("su")}
          disabled={current >= flashcards.length}
        >
          Su
        </Button>
      </div>
    </div>
  );
}
