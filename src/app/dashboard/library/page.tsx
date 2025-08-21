import FolderExplorer from "../../../components/FolderExplorer";

export default function LibraryPage() {
  return (
    <div className="w-full py-10 px-4">
      <h1 className="text-3xl font-bold mb-2">Ma bibliothèque</h1>
      <p className="text-muted-foreground mb-8">Gérez vos dossiers et sets de fiches facilement.</p>
      <FolderExplorer />
    </div>
  );
}
