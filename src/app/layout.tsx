import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ChatWidget from "@/components/chat/ChatWidget";

export const metadata: Metadata = {
  title: "Nexscholar - Global Scholarship Discovery Platform",
  description:
    "Discover, apply for, and access global scholarship opportunities. Get expert consultation and document review services.",
  keywords:
    "scholarships, education, study abroad, funding, Africa, underserved regions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
