import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MeetMind",
  description: "AI Meeting Intelligence",
};

import { UploadModalProvider } from "@/context/UploadModalContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UploadModalProvider>
          {children}
          <Toaster richColors position="top-right" />
        </UploadModalProvider>
      </body>
    </html>
  );
}
