import { Footer } from "@/components/footer";
import { Header } from "@/components/header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <div className="flex-1" />
      <Footer />
    </>
  );
}
