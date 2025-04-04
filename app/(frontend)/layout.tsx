import type { Metadata } from "next";
import "../../styles/globals.scss";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import Providers from "@/providers";
import { DashboardHeader } from "@/components/dashboard-header";

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.dev",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <DashboardHeader />
            {children}
          </div>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
