

import NextAuth, { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";


// NextAuth configuration for credentials (id/mdp) with Prisma and bcrypt
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Connexion par identifiant",
      credentials: {
        name: { label: "Nom", type: "text", placeholder: "Votre nom" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        // Vérification des credentials
        const { name, password } = credentials as { name: string; password: string };
        if (!name || !password) return null;
        const user = await prisma.user.findFirst({ where: { name } });
        if (!user || !user.password) return null;
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return null;
        return user;
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/",
  },
  callbacks: {
    // Ajoute l'id utilisateur dans la session côté client
    async session({ session, token }) {
      if (token?.sub) {
        (session.user as any) = {
          ...session.user,
          id: token.sub,
        };
      }
      return session;
    },
  },
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
