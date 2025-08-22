"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children, geistSans, geistMono }: { children: React.ReactNode, geistSans: any, geistMono: any }) {
  const pathname = usePathname();
  const isLogin = pathname === "/";
  if (isLogin) {
    return (
      <html lang="fr">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen`}>
          {children}
        </body>
      </html>
    );
  }
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background min-h-screen`}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar pathname={pathname} />
            <main className="flex-1 mx-auto w-full py-8 px-4">
              <SidebarTrigger />
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}