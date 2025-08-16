import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Destaque() {
    return (
        <section 
          className="py-12 relative bg-contain bg-center bg-no-repeat
            bg-[url('/background/mobile.png')] 
            sm:bg-[url('/background/tablet.png')] 
            lg:bg-[url('/background/pc.png')]"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-5 text-[#3B2D3A] uppercase">
                Cadastre-se e projete a cidade que você quer ver
              </h2>
              <p className="text-[#3B2D3A] mb-8">
                Não perca a chance de contribuir com ideias para o futuro da
                maior cidade do Brasil. Inscreva seu projeto e faça parte deste
                concurso.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={"/inscricao"}>
                  <Button
                    size="lg"
                    className="px-4 py-1 text-lg font-semibold cursor-pointer"
                  >
                    Inscreva-se agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
    )
}