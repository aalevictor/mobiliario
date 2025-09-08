export default function InformeConteudo({ conteudo }: { conteudo?: string }) {
    return (
        <div
            className="text-foreground mt-4"
            dangerouslySetInnerHTML={{ __html: conteudo || "" }}
        />
    )   
}