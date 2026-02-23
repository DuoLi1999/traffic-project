import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}
