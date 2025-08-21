"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardStats() {
  const [folders, setFolders] = useState<number>(0);
  const [sets, setSets] = useState<number>(0);
  const [cards, setCards] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [f, s, c] = await Promise.all([
        fetch("/api/folder").then(r => r.json()),
        fetch("/api/set?folderId=all").then(r => r.json()),
        fetch("/api/flashcard?setId=all").then(r => r.json()),
      ]);
      setFolders(Array.isArray(f) ? f.length : 0);
      setSets(Array.isArray(s) ? s.length : 0);
      setCards(Array.isArray(c) ? c.length : 0);
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">Bienvenue sur votre tableau de bord !</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-4">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-600">{loading ? "-" : folders}</span>
              <span className="text-gray-600 mt-1">Dossiers</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-600">{loading ? "-" : sets}</span>
              <span className="text-gray-600 mt-1">Sets</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-blue-600">{loading ? "-" : cards}</span>
              <span className="text-gray-600 mt-1">Flashcards</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
