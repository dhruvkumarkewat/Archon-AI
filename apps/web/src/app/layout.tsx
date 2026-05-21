import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const robotoMono = Roboto_Mono({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevForge System — System-Powered Developer Platform",
  description:
    "Transform your development workflow with System-powered code analysis, bug detection, API documentation generation, and architecture visualization. Built with Modern innovation.",
  keywords: ["System", "developer tools", "code analysis", "bug detection", "API documentation"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${robotoMono.variable} ${inter.variable} h-full antialiased`}
    >
      <body className={`${robotoMono.variable} ${inter.variable} font-sans antialiased bg-system-gray-100 text-system-gray-800 min-h-screen relative`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
