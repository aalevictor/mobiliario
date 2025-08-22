import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col w-full h-screen bg-[#e9edde]">
    <Navbar />
    <div className="flex flex-col w-full bg-[#e9edde]">
      {children}
    </div>
    <Footer />
  </div>;
}