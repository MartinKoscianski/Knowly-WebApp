import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function FlashcardList({ setId }: { setId: string }) {
  const [cards, setCards] = useState<any[]>([]);
  const [recto, setRecto] = useState("");
  const [verso, setVerso] = useState("");
  const [hint, setHint] = useState("");

  const fetchCards = async () => {
    const res = await fetch(`/api/flashcard?setId=${setId}`);
    setCards(await res.json());
  };
  useEffect(() => { fetchCards(); }, [setId]);

  const createCard = async () => {
    await fetch("/api/flashcard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flashcardSetId: setId, recto, verso, hint }),
    });
    setRecto("");
    setVerso("");
    setHint("");
    fetchCards();
  };

  const [editId, setEditId] = useState<string | null>(null);
  const [editRecto, setEditRecto] = useState("");
  const [editVerso, setEditVerso] = useState("");
  const [editHint, setEditHint] = useState("");

  const startEdit = (card: any) => {
    setEditId(card.id);
    setEditRecto(card.recto);
    setEditVerso(card.verso);
    setEditHint(card.hint || "");
  };
  const cancelEdit = () => {
    setEditId(null);
    setEditRecto("");
    setEditVerso("");
    setEditHint("");
  };
  const saveEdit = async () => {
    await fetch(`/api/flashcard/${editId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recto: editRecto, verso: editVerso, hint: editHint }),
    });
    cancelEdit();
    fetchCards();
  };
  const deleteCard = async (id: string) => {
    await fetch(`/api/flashcard/${id}`, { method: "DELETE" });
    fetchCards();
  };

  return (
    <Card className="mt-8 p-4">
      <h2 className="text-lg font-bold mb-2">Flashcards</h2>
      <div className="flex gap-2 mb-2 flex-wrap">
        <Input value={recto} onChange={e => setRecto(e.target.value)} placeholder="Recto" className="max-w-xs" />
        <Input value={verso} onChange={e => setVerso(e.target.value)} placeholder="Verso" className="max-w-xs" />
        <Input value={hint} onChange={e => setHint(e.target.value)} placeholder="Indice (optionnel)" className="max-w-xs" />
        <Button onClick={createCard} variant="default">Ajouter</Button>
      </div>
      <ul className="space-y-2">
        {cards.map(card => (
          <li key={card.id}>
            <Card className="p-3">
              {editId === card.id ? (
                <>
                  <Input value={editRecto} onChange={e => setEditRecto(e.target.value)} className="mb-1" placeholder="Recto" />
                  <Input value={editVerso} onChange={e => setEditVerso(e.target.value)} className="mb-1" placeholder="Verso" />
                  <Input value={editHint} onChange={e => setEditHint(e.target.value)} className="mb-1" placeholder="Indice (optionnel)" />
                  <div className="flex gap-2 mt-2">
                    <Button onClick={saveEdit} size="sm">Enregistrer</Button>
                    <Button onClick={cancelEdit} variant="outline" size="sm">Annuler</Button>
                  </div>
                </>
              ) : (
                <>
                  <span><b>Recto :</b> {card.recto}</span>
                  <span><b>Verso :</b> {card.verso}</span>
                  {card.hint && <span className="text-xs text-muted-foreground">Indice : {card.hint}</span>}
                  <div className="flex gap-2 mt-2">
                    <Button onClick={() => startEdit(card)} variant="outline" size="sm">Modifier</Button>
                    <Button onClick={() => deleteCard(card.id)} variant="destructive" size="sm">Supprimer</Button>
                  </div>
                </>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </Card>
  );
}
