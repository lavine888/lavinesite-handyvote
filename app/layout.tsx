import type { Metadata } from "next";
import "./globals.css";
import "./handy-replica.css";
import "./reference-alignment.css";
import "./reference-screen.css";
import "./reference-experience.css";
import HandyReplica from "@/components/HandyReplica";

export const metadata: Metadata = {
  title: "Lavine Xie — Digital Workbench",
  description: "AI Product Builder working across agent systems, creative technology and quantitative ideas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div id="app-root">
          <HandyReplica>{children}</HandyReplica>
        </div>
      </body>
    </html>
  );
}
