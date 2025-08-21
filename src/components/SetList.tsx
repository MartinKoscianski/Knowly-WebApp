import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function SetList({ folderId, moveTargets }: { folderId: string, moveTargets?: any[] }) {
  const [sets, setSets] = useState<any[]>([]);
  const [newSetName, setNewSetName] = useState("");
  const router = useRouter();
  // Déplacer un set dans un autre dossier
  const moveSet = async (setId: string, newFolderId: string) => {
    await fetch("/api/set/move", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setId, newFolderId }),
    });
    fetchSets();
  };

  const fetchSets = async () => {
    const res = await fetch(`/api/set?folderId=${folderId}`);
    setSets(await res.json());
  };
  useEffect(() => { fetchSets(); }, [folderId]);

  const createSet = async () => {
    await fetch("/api/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSetName, folderId }),
    });
    setNewSetName("");
    fetchSets();
  };

  return (
    <div className="w-full space-y-4 mt-4">
      <div className="flex gap-2 flex-wrap mb-2">
        <Input
          value={newSetName}
          onChange={e => setNewSetName(e.target.value)}
          placeholder="Nouveau set..."
          className="max-w-xs"
        />
        <Button onClick={createSet} variant="default">Créer</Button>
      </div>
      <ul className="space-y-1">
        {sets.map(set => (
          <li key={set.id} className="flex items-center gap-2 group">
            <span className="font-semibold truncate max-w-[180px]">{set.name}</span>
            <Button onClick={() => router.push(`/set/${set.id}`)} variant="ghost" size="icon" title="Ouvrir">
              📄
            </Button>
            {moveTargets && moveTargets.length > 0 && (
              <details>
                <summary><Button variant="ghost" size="icon" title="Déplacer">↔️</Button></summary>
                <div className="flex flex-col gap-1 mt-1">
                  {moveTargets.filter(f => f.id !== folderId).map(target => (
                    <Button key={target.id} onClick={() => moveSet(set.id, target.id)} size="sm" variant="outline">
                      {target.name}
                    </Button>
                  ))}
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
