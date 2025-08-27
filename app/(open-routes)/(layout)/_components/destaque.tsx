import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Destaque() {
    const dataAberturaPreCadastro = new Date('2025-08-25 00:00:00');
    const dataLimitePreCadastro = new Date('2025-09-15 23:59:59.999');
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
                CONFIRA O CRONOGRAMA E FAÇA SUA PRÉ-INSCRIÇÃO
              </h2>
              <p className="text-[#3B2D3A] mb-2">
                Após a pré-inscrição você terá acesso à área restrita, onde verá seu código identificador (ID) 
                e poderá submeter os documentos necessários para inscrição entre os dias 
                <strong> 08/09/2025 e 15/09/2025</strong>. 
              </p>
              <p className="text-[#3B2D3A] mb-2">
                <strong>CONFIRA OS DOCUMENTOS NECESSÁRIOS PARA INSCRIÇÃO NO ITEM 9.2 DO EDITAL.</strong> 
              </p>
              <p className="text-[#3B2D3A] mb-8">
                Não perca a chance de contribuir com ideias para o futuro da maior cidade do Brasil. Inscreva seu projeto e 
                faça parte deste concurso!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {podePreCadastrar ?
                    <Link
                        href={"/inscricao"}
                    >
                    <Button
                        size="lg"
                        className="px-4 py-1 text-lg hover:opacity-80 font-semibold cursor-pointer"
                    >
                        Faça já sua pré-inscrição
                    </Button>
                </Link> :
                    <Button
                        size="lg"
                        className="px-4 py-1 text-lg opacity-50 cursor-not-allowed font-semibold"
                        disabled
                    >
                        Inscrições encerradas
                    </Button>
                }
              </div>
            </div>
          </div>
        </section>
    )
}