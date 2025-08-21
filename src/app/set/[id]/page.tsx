"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FlashcardList from "@/components/FlashcardList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SetPage({ params }: { params: Promise<{ id: string }> }) {
  const [set, setSet] = useState<any>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = React.use(params);

  useEffect(() => {
    fetch(`/api/set/${id}`)
      .then(res => res.json())
      .then(data => {
        setSet(data);
        setName(data.name || "");
        setDescription(data.description || "");
        setLoading(false);
      });
  }, [id]);

  const save = async () => {
    await fetch(`/api/set/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    });
    router.refresh();
  };

  if (loading) return <div>Chargement...</div>;
  if (!set || set.error) return <div>Set introuvable ou accès refusé.</div>;

  return (
    <div className="max-w-xl mx-auto mt-8 px-2">
      <Button onClick={() => router.back()} variant="outline" size="sm" className="mb-4">⬅️ Retour</Button>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Modifier le set</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Nom</label>
            <Input value={name} onChange={e => setName(e.target.value)} className="w-full" />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Description</label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full" />
          </div>
          <Button onClick={save} className="mb-2">Enregistrer</Button>
        </CardContent>
      </Card>
      <FlashcardList setId={id} />
    </div>
  );
}
