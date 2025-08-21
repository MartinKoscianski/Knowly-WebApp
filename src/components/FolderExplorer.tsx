"use client";
import React, { useEffect, useState } from "react";
import SetList from "./SetList";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function FolderExplorer() {
  const [folders, setFolders] = useState<any[]>([]);
  const [newName, setNewName] = useState("");
  const [parentId, setParentId] = useState<string | null>(null); // dossier courant
  const [selected, setSelected] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [path, setPath] = useState<any[]>([]); // chemin de navigation

  // Charger les dossiers
  // Récupère les dossiers enfants du dossier courant
  const fetchFolders = async (pid = parentId) => {
    const res = await fetch("/api/folder");
    const all = await res.json();
    setFolders(all.filter((f: any) => f.parentFolderId === pid));
  };
  useEffect(() => { fetchFolders(); }, [parentId]);

  // Créer un dossier
  const createFolder = async () => {
    await fetch("/api/folder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, parentFolderId: parentId }),
    });
    setNewName("");
    fetchFolders();
  };

  // Renommer un dossier
  const renameFolder = async (id: string) => {
    await fetch(`/api/folder/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: renameValue }),
    });
    setRenameValue("");
    setSelected(null);
    fetchFolders();
  };

  // Supprimer un dossier
  const deleteFolder = async (id: string) => {
    await fetch(`/api/folder/${id}`, { method: "DELETE" });
    fetchFolders();
  };

  // Naviguer dans un dossier (afficher ses sous-dossiers)
  const enterFolder = (folder: any) => {
    setParentId(folder.id);
    setPath([...path, folder]);
  };

  // Déplacer un dossier dans un autre dossier
  const moveFolder = async (folderId: string, newParentId: string | null) => {
    await fetch("/api/folder/move", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folderId, newParentId }),
    });
    fetchFolders();
  };

  // Liste des dossiers cibles pour déplacement (hors dossier courant et ses enfants)
  const getMoveTargets = (excludeId: string) => {
    // Exclure le dossier à déplacer et ses sous-dossiers
    const exclude = new Set([excludeId]);
    const markChildren = (id: string) => {
      folders.filter(f => f.parentFolderId === id).forEach(f => {
        exclude.add(f.id);
        markChildren(f.id);
      });
    };
    markChildren(excludeId);
    return folders.filter(f => !exclude.has(f.id));
  };

  // Remonter d'un niveau
  const goUp = () => {
    const newPath = [...path];
    newPath.pop();
    setParentId(newPath.length ? newPath[newPath.length - 1].id : null);
    setPath(newPath);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        {parentId && (
          <Button variant="ghost" size="icon" onClick={goUp} title="Retour au dossier parent">
            <span aria-hidden>⬅️</span>
          </Button>
        )}
        <nav className="text-sm text-muted-foreground flex items-center gap-1">
          <span className="font-bold text-gray-400">/</span>
          {path.map((f: any, i: number) => (
            <span key={f.id + '-' + i} className="truncate max-w-[120px]">
              {f.name}
              <span className="font-bold text-gray-400">/</span>
            </span>
          ))}
        </nav>
      </div>
      <div className="flex gap-2 flex-wrap mb-4">
        <Input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          placeholder="Nouveau dossier..."
          className="max-w-xs"
        />
        <Button onClick={createFolder} variant="default">Créer</Button>
      </div>
      <ul className="space-y-1">
        {folders.map(folder => (
          <li key={folder.id} className="flex items-center gap-2 group">
            <Button variant="ghost" size="icon" onClick={() => enterFolder(folder)} title="Ouvrir le dossier">
              <span aria-hidden>📁</span>
            </Button>
            {selected === folder.id ? (
              <>
                <Input
                  value={renameValue}
                  onChange={e => setRenameValue(e.target.value)}
                  className="max-w-xs"
                  size={20}
                  autoFocus
                />
                <Button onClick={() => renameFolder(folder.id)} variant="default" size="sm">Valider</Button>
                <Button onClick={() => setSelected(null)} variant="outline" size="sm">Annuler</Button>
              </>
            ) : (
              <>
                <span className="truncate max-w-[120px]">{folder.name}</span>
                <Button onClick={() => { setSelected(folder.id); setRenameValue(folder.name); }} variant="ghost" size="icon" title="Renommer">
                  ✏️
                </Button>
                <Button onClick={() => deleteFolder(folder.id)} variant="ghost" size="icon" title="Supprimer">
                  🗑️
                </Button>
                <details>
                  <summary><Button variant="ghost" size="icon" title="Déplacer">↔️</Button></summary>
                  <div className="flex flex-col gap-1 mt-1">
                    <Button onClick={() => moveFolder(folder.id, null)} size="sm" variant="outline">Racine</Button>
                    {folders.filter(f => f.id !== folder.id).map(target => (
                      <Button key={target.id} onClick={() => moveFolder(folder.id, target.id)} size="sm" variant="outline">
                        {target.name}
                      </Button>
                    ))}
                  </div>
                </details>
              </>
            )}
          </li>
        ))}
      </ul>
      {parentId && <SetList folderId={parentId} moveTargets={folders} />}
    </div>
  );
}
