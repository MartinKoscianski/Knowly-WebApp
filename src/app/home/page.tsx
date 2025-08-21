import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FolderExplorer from "@/components/FolderExplorer";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-2">
      <Card className="w-full max-w-2xl mb-8">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Bienvenue sur Knowly</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground mb-4">
            Votre application de gestion de fiches de révision, dossiers et sets personnalisés.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="w-full">Aller au tableau de bord</Button>
            </Link>
            <Link href="/library">
              <Button variant="outline" size="lg" className="w-full">Voir la bibliothèque</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
