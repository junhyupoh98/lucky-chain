import type { Metadata } from "next";
import "./globals.css";
import { AppProvidersV2 } from "./providers";

export const metadata: Metadata = {
  title: "Lucky Chain Operator Console",
  description: "Administrative tools for managing Lucky Chain lottery draws.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AppProvidersV2>{children}</AppProvidersV2>
      </body>
    </html>
  );
}
