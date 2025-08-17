import { auth } from "@/auth";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  return <div className="flex flex-col w-full h-screen bg-[#e9edde]">
    <Navbar />
    <div className="flex flex-col w-full bg-[#e9edde]">
      {children}
    </div>
    <Footer />
  </div>;
}