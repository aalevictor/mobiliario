import Edital from "@/components/icones/edital";
import Esclarecimentos from "@/components/icones/esclarecimentos";
import Informes from "@/components/icones/informes";
import Termo from "@/components/icones/termo";
import ModalPergunta from "@/components/modal-pergunta";
import { Button } from "@/components/ui/button";

export default function Documentos() {
    return (
        <section
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
                    <h2 className="text-[#3B2D3A] text-2xl lg:text-3xl font-bold col-span-3">
                        EDITAL
                    </h2>
                    <div className="col-span-2">
                        <p className="text-[#3B2D3A] mb-4">
                            Todas as informações que você precisa para participar estão reunidas no edital do concurso. 
                            Faça o download e garanta que seu projeto atenda a todos os requisitos técnicos e formais estabelecidos.
                        </p>
                        <Button
                            size="lg"
                            className="px-4 py-1 text-lg font-semibold cursor-pointer"
                        >
                            Baixar edital
                        </Button>
                    </div>
                    <Edital size={160} />
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
                    <h2 className="text-[#3B2D3A] text-2xl lg:text-3xl font-bold col-span-3">
                        TERMO DE REFERÊNCIA
                    </h2>
                    <div className="col-span-2">
                        <p className="text-[#3B2D3A] mb-4">
                            O Termo de Referência é o documento essencial para entender o contexto, os objetivos e os parâmetros 
                            técnicos do concurso. Baixe agora e utilize-o como guia para fundamentar sua proposta.
                        </p>
                        <Button
                            size="lg"
                            className="px-4 py-1 text-lg font-semibold cursor-pointer"
                        >
                            Baixar termo
                        </Button>
                    </div>
                    <Termo size={160} />
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
                    <h2 className="text-[#3B2D3A] text-2xl lg:text-3xl font-bold col-span-3">
                        PEDIDOS DE ESCLARECIMENTOS
                    </h2>
                    <div className="col-span-2">
                        <p className="text-[#3B2D3A] mb-4">
                            Os interessados podem submeter pedidos de esclarecimento nos termos dos itens <strong>7.1 e 7.2</strong> 
                            do Edital, <strong>até o dia 14/09/2025</strong>, conforme consta no cronograma.
                        </p>
                        <ModalPergunta>
                            <Button
                                size="lg"
                                className="px-4 py-1 text-lg font-semibold cursor-pointer"
                            >
                                Pedir esclarecimento
                            </Button>
                        </ModalPergunta>
                    </div>
                    <Esclarecimentos size={160} />
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
                    <h2 className="text-[#3B2D3A] text-2xl lg:text-3xl font-bold col-span-3">
                        INFORMES
                    </h2>
                    <div className="col-span-2">
                        <p className="text-[#3B2D3A] mb-4">
                            Aqui você acompanha os informes do concurso, como blocos de respostas aos pedidos 
                            de esclarecimento, lista de IDs deferidos e indeferidos na etapa de inscrição, 
                            lista de classificação dos IDs na primeira fase, lista final dos IDs vencedores, 
                            entre outras informações importantes. Fique atento!
                        </p>
                        <Button
                            size="lg"
                            className="px-4 py-1 text-lg font-semibold cursor-pointer"
                        >
                            Acessar informes
                        </Button>
                    </div>
                    <Informes size={160} />
                </div>
            </div>
        </section>
    )
}