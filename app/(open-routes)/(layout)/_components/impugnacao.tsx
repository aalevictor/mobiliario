import ModalPergunta from "@/components/modal-pergunta";

export default function Impugnacao() {
    return (
        <section className="py-12 bg-[#F3F9E7]" >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl intersect:motion-preset-slide-up motion-delay-150 font-bold mb-5 text-[#3B2D3A] uppercase">
                Pedidos de Impugnação
              </h2>
              <p className="text-[#3B2D3A] intersect:motion-preset-slide-up motion-delay-200 text-balance mb-8">
                Tem alguma dúvida sobre o concurso? Pergunte aqui.
              </p>
              <div className="flex flex-col intersect:motion-preset-slide-up motion-delay-300 sm:flex-row gap-4 justify-center">
                <ModalPergunta />
              </div>
            </div>
          </div>
        </section>
    )
}