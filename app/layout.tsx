import type { Metadata } from "next";
import "./globals.css";
import "./scene-fixes.css";

export const metadata: Metadata = {
  title: "Lavine Xie — Digital Workbench",
  description: "AI Product Builder working across agent systems, creative technology and quantitative ideas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
