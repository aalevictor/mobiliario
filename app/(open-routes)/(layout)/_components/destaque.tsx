import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Destaque() {
    const dataAberturaPreCadastro = new Date('2025-08-25 00:00:00');
    const dataLimitePreCadastro = new Date('2025-09-22 23:59:59.999');
    const dataAtual = new Date();
    const podePreCadastrar = dataAtual >= dataAberturaPreCadastro && dataAtual <= dataLimitePreCadastro;
    return (
        <section 
          className="py-12 relative bg-contain bg-center bg-no-repeat
            bg-[url('/background/mobile.png')] 
            sm:bg-[url('/background/tablet.png')] 
            lg:bg-[url('/background/pc.png')]"
        >
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-5 text-[#3B2D3A] uppercase">
                CONFIRA O CRONOGRAMA E ACOMPANHE OS INFORMES
              </h2>
              <p className="text-[#3B2D3A] mb-2">
                {"O período de submissão das propostas técnicas em nível de Estudo Preliminar é entre os dias "}  
                <strong>13/10/2025 e 27/10/2025</strong>. 
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                        href={"/informes"}
                    >
                    <Button
                        size="lg"
                        className="px-4 py-1 text-lg hover:opacity-80 font-semibold cursor-pointer"
                    >
                        Informes
                    </Button>
                </Link>
                <Link
                        href={"/meu-cadastro"}
                    >
                    <Button
                        size="lg"
                        className="px-4 py-1 text-lg hover:opacity-80 font-semibold cursor-pointer"
                    >
                        Área do Participante
                    </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
    )
}