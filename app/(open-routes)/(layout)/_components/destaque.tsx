import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Destaque() {
    return (
        <section className="py-12" >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl intersect:motion-preset-slide-up motion-delay-150 font-bold mb-5 text-[#3B2D3A] uppercase">
                Cadastre-se e projete a cidade que você quer ver
              </h2>
              <p className="text-[#3B2D3A] intersect:motion-preset-slide-up motion-delay-200 text-balance mb-8">
                Não perca a chance de contribuir com ideias para o futuro da
                maior cidade do Brasil. Inscreva seu projeto e faça parte deste
                concurso.
              </p>
              <div className="flex flex-col intersect:motion-preset-slide-up motion-delay-300 sm:flex-row gap-4 justify-center">
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