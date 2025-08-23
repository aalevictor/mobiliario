import Banner from "./_components/banner";
import Informacoes from "./_components/informacoes";
import Apoio from "./_components/apoio";
import Documentos from "./_components/documentos";
import Destaque from "./_components/destaque";
import { auth } from "@/auth";
import { retornaPermissao } from "@/services/usuarios";

export default async function Home() {
  const session = await auth();
  const permissao = session?.user.id ? await retornaPermissao(session?.user.id as string) : '';
  return (
    <main id="main-content" className="flex flex-col w-full h-full bg-[#e9edde]" role="main">
      <Banner />
      <Informacoes />
      <Documentos permissao={permissao || ''} />
      <Apoio />
      <Destaque />
    </main>
  );
}
