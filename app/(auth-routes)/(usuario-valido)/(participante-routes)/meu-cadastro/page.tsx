import { auth } from "@/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { meuCadastro } from "@/services/cadastros";
import { redirect } from "next/navigation";
import ResponsavelForm from "../_components/responsavel-form";
import EnderecoForm from "../_components/endereco-form";
import ParticipantesForm from "../_components/participantes-form";
import DocumentosForm from "../_components/documentos-form";
import ProjetosForm from "../_components/projetos-form";
import { revalidatePath } from "next/cache";
import { ICadastro } from "../../cadastros/page";
import ProtocoloDisplay from "../_components/protocolo-display";
import RecursoForm from "../_components/recurso-form";
import RecursoAvaliacaoForm from "../_components/recurso-avaliacao-form";
import ModelosAba from "../_components/modelos-aba";
import HabilitacaoForm from "../_components/habilitacao-form";

export default async function MeuCadastro(props: { searchParams: Promise<{ tab: string }> }) {
    const { tab } = await props.searchParams;
    const session = await auth();
    if (!session) redirect("/");

    const cadastro = await meuCadastro(session.user.id);
    if (!cadastro) redirect("/");
    const eDeferido = cadastro.avaliacao_licitadora && cadastro.avaliacao_licitadora.aprovado;
    const liberado = eDeferido || cadastro.avaliacao_licitadora?.liberadoAval;

    const inicioEnvioHabilitacao = new Date("2025-12-11 00:00:00");
    const fimEnvioHabilitacao = new Date("2025-12-13 05:30:00");
    const hoje = new Date();
    const envioHabilitacao = cadastro.avaliacao_licitadora?.classificado && hoje >= inicioEnvioHabilitacao && hoje <= fimEnvioHabilitacao;

    async function atualizarPagina(tab: string) {
        "use server";
        revalidatePath(`/meu-cadastro?tab=${tab}`);
    }

    const tabs = ["responsavel", "endereco", "participantes", "documentacao", "projetos", "recurso-avaliacao", "documentos-habilitacao"];

    return (
        <div className="container mx-auto h-full px-4 max-sm:px-2 py-6 max-w-6xl flex flex-col gap-3">            
            <Tabs defaultValue={tabs.includes(tab) ? tab : "responsavel"} className="w-full">
                <div className="flex justify-center">
                    <TabsList className="w-full max-w-3xl flex flex-wrap md:flex-nowrap gap-1 h-fit">
                        <TabsTrigger value="responsavel">Responsável</TabsTrigger>
                        <TabsTrigger value="endereco">Endereço</TabsTrigger>
                        <TabsTrigger value="participantes">Participantes</TabsTrigger>
                        <TabsTrigger value="documentacao">Documentação</TabsTrigger>
                        {cadastro.avaliacao_licitadora && !eDeferido && <TabsTrigger value="recurso">Recurso</TabsTrigger>}
                        {eDeferido && <TabsTrigger value="modelos">Modelos</TabsTrigger>}
                        {/* {liberado && <TabsTrigger value="recurso-avaliacao">Recurso</TabsTrigger>} */}
                        {eDeferido && <TabsTrigger value="projetos">Propostas Técnicas</TabsTrigger>}
                        {envioHabilitacao && (
                            <TabsTrigger value="documentos-habilitacao">Habilitação</TabsTrigger>
                        )}
                    </TabsList>
                </div>
                <div className="w-full flex flex-col gap-3">
                    {cadastro.protocolo && (
                        <ProtocoloDisplay protocolo={cadastro.protocolo} />
                    )}
                    <TabsContent value="responsavel" className="m-0">
                        <ResponsavelForm atualizarPagina={atualizarPagina} cadastro={cadastro as ICadastro} />
                    </TabsContent>
                    <TabsContent value="endereco" className="m-0">
                        <EnderecoForm atualizarPagina={atualizarPagina} cadastro={cadastro as ICadastro} />
                    </TabsContent>
                    <TabsContent value="participantes" className="m-0">
                        <ParticipantesForm atualizarPagina={atualizarPagina} cadastro={cadastro as ICadastro} />
                    </TabsContent>
                    <TabsContent value="documentacao" className="m-0">
                        <DocumentosForm atualizarPagina={atualizarPagina} cadastro={cadastro as ICadastro} />
                    </TabsContent>
                    {cadastro.avaliacao_licitadora && !eDeferido && <TabsContent value="recurso" className="m-0">
                        <RecursoForm atualizarPagina={atualizarPagina} cadastro={cadastro as ICadastro} />
                    </TabsContent>}
                    {eDeferido && <TabsContent value="modelos" className="m-0">
                        <ModelosAba />
                    </TabsContent>}
                    {/* {eDeferido && <TabsContent value="recurso-avaliacao" className="m-0">
                        <RecursoAvaliacaoForm atualizarPagina={atualizarPagina} cadastro={cadastro as ICadastro} />
                    </TabsContent>} */}
                    {eDeferido && <TabsContent value="projetos" className="m-0">
                        <ProjetosForm atualizarPagina={atualizarPagina} cadastro={cadastro as ICadastro} />
                    </TabsContent>}
                    {envioHabilitacao &&  (
                        <TabsContent value="documentos-habilitacao" className="m-0">
                            <HabilitacaoForm atualizarPagina={atualizarPagina} cadastro={cadastro as ICadastro} />
                        </TabsContent>
                    )}
                </div>
            </Tabs>
        </div>
    )
}