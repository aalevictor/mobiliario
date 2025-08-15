import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default async function OpenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-col w-full min-h-screen bg-[#e9edde]">
    <Navbar />
    <div className="flex flex-col w-full h-full bg-[#e9edde]">
      {children}
    </div>
    <Footer />
  </div>;
}