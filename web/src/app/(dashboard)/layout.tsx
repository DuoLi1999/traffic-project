import { Sidebar, Header } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Sidebar />
      <main className="ml-60 mt-[65px] min-h-[calc(100vh-65px)] bg-background p-6">
        {children}
      </main>
    </>
  );
}
