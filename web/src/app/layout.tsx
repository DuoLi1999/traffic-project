import type { Metadata } from "next";
import "./globals.css";
import { Sidebar, Header } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "交通安全宣传教育智能化平台",
  description: "交通安全宣传教育智能化平台 - XX市公安局交警支队",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <Header />
        <Sidebar />
        <main className="ml-60 mt-[65px] min-h-[calc(100vh-65px)] bg-background p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
