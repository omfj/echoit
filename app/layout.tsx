import { cn } from "@/lib/cn";
import "@/styles/globals.css";
import { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "echoit!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          // "pride-gradient min-h-screen flex flex-col p-3",
          "bg-primary min-h-screen flex flex-col p-3",
          inter.className
        )}
      >
        <div className="bg-white flex flex-col flex-1">{children}</div>
      </body>
    </html>
  );
}
