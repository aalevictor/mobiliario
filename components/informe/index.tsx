import { Informe } from "@/app/(auth-routes)/(usuario-valido)/(admin-routes)/informes-admin/page"
import InformeConteudo from "./informe-conteudo"

export default function InformeComponent({ informe }: { informe: Partial<Informe> }) {
    return <div className="relative mb-10 pl-8">
        <h5 className="text-md text-muted-foreground mt-2 mb-4 rounded-xl tracking-tight">
            {informe.dataPublicacao?.toLocaleDateString('pt-BR')}, {informe.dataPublicacao?.toLocaleTimeString('pt-BR')}
        </h5>
        <div className="bg-primary absolute left-0 top-3.5 flex size-4 items-center justify-center rounded-full" />
        <div
            className="w-full flex p-[3px] bg-[#D0DBBF]"
            style={{
                clipPath:
                "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
            }}
        >
            <div
                className="flex flex-col w-full bg-white p-8 gap-2"
                style={{
                    clipPath:
                    "polygon(10px 0%, calc(100% - 10px) 0%, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0% calc(100% - 10px), 0% 10px)",
                }}
            >
                {/* <h2 className="text-[#3B2D3A] text-2xl lg:text-3xl font-bold">
                    {informe.titulo || ""}
                </h2> */}
                <h2
                    className="text-[#3B2D3A] text-2xl lg:text-3xl font-bold"
                    dangerouslySetInnerHTML={{ __html: informe.titulo || "" }}
                />
                {informe.subtitulo && <h4 className="text-[#3B2D3A] text-md lg:text-lg">{informe.subtitulo}</h4>}
                <InformeConteudo conteudo={informe.conteudo} />
            </div>
        </div>
    </div>
}