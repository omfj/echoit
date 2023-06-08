import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* @ts-expect-error Server Component */}
      <Header />
      {children}
      <div className="flex-1" />
      <Footer />
    </>
  );
}
