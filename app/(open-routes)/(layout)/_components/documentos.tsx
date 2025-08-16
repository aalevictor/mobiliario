import ModalPergunta from "@/components/modal-pergunta";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Documentos() {
    return (
        <section
            id="docs"
            className="w-[90%] lg:w-[600px] mx-auto space-y-4 flex flex-col my-4"
        >
            <div 
                className="w-full flex p-[3px] bg-[#D0DBBF]"
                style={{
                    clipPath:
                    "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                }}
            >
                <div
                    className="grid grid-cols-3 w-full bg-white p-8 gap-4"
                    style={{
                        clipPath:
                        "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                    }}
                >
                    <h2 className="text-[#3B2D3A] text-2xl lg:text-3xl xl:text-4xl font-bold col-span-3">
                        EDITAL
                    </h2>
                    <div className="col-span-2">
                        <p className="text-[#3B2D3A] mb-4">
                            Todas as informações que você precisa para participar estão reunidas no edital do concurso. Faça o download e garanta que seu projeto atenda a todos os requisitos técnicos e formais estabelecidos.
                        </p>
                        <Button
                            size="lg"
                            className="px-4 py-1 text-lg font-semibold cursor-pointer"
                        >
                            Baixar edital
                        </Button>
                    </div>
                    <Image
                        src="/documentos/edital.png"
                        alt="Termo de referência"
                        width={132}
                        height={132}
                        className="w-full h-full self-center justify-self-center max-w-[132px] max-h-[132px] object-contain"
                    />
                </div>
            </div>
            <div 
                className="w-full flex p-[3px] bg-[#D0DBBF]"
                style={{
                    clipPath:
                    "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                }}
            >
                <div
                    className="grid grid-cols-3 w-full bg-white p-8 gap-4"
                    style={{
                        clipPath:
                        "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                    }}
                >
                    <h2 className="text-[#3B2D3A] text-2xl lg:text-3xl xl:text-4xl font-bold col-span-3">
                        TERMO DE REFERÊNCIA
                    </h2>
                    <div className="col-span-2">
                        <p className="text-[#3B2D3A] mb-4">
                            O Termo de Referência é o documento essencial para entender o contexto, os objetivos e os parâmetros técnicos do concurso. Baixe agora e utilize-o como guia para fundamentar sua proposta.
                        </p>
                        <Button
                            size="lg"
                            className="px-4 py-1 text-lg font-semibold cursor-pointer"
                        >
                            Baixar termo
                        </Button>
                    </div>
                    <Image
                        src="/documentos/termo_referencia.png"
                        alt="Termo de referência"
                        width={132}
                        height={132}
                        className="w-full h-full self-center justify-self-center max-w-[132px] max-h-[132px] object-contain"
                    />
                </div>
            </div>
            <div 
                className="w-full flex p-[3px] bg-[#D0DBBF]"
                style={{
                    clipPath:
                    "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                }}
            >
                <div
                    className="grid grid-cols-3 w-full bg-white p-8 gap-4"
                    style={{
                        clipPath:
                        "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                    }}
                >
                    <h2 className="text-[#3B2D3A] text-2xl lg:text-3xl xl:text-4xl font-bold col-span-3">
                        PEDIDOS DE ESCLARECIMENTOS
                    </h2>
                    <div className="col-span-2">
                        <p className="text-[#3B2D3A] mb-4">
                            Tem alguma dúvida sobre o concurso? Pergunte aqui.
                        </p>
                        <ModalPergunta>
                            <Button
                                size="lg"
                                className="px-4 py-1 text-lg font-semibold cursor-pointer"
                            >
                                Enviar pergunta
                            </Button>
                        </ModalPergunta>
                    </div>
                    <Image
                        src="/documentos/edital.png"
                        alt="Esclarecimentos"
                        width={132}
                        height={132}
                        className="w-full h-full self-center justify-self-center max-w-[132px] max-h-[132px] object-contain"
                    />
                </div>
            </div>
        </section>
    )
}