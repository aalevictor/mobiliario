import { Arquivo } from "@prisma/client";

export const NOME_TIPO_ARQUIVO: Record<string, string> = {
  DOC_ESPECIFICA: "Documentação Específica",
  PROJETOS: "Projetos",
  PROJETOS_2: "Projetos Fase 2",
};

export interface IArquivoListagem extends Arquivo {
  cadastro: {
    id: number;
    nome: string;
    email: string;
    protocolo: string | null;
  };
}

export function extrairExtensaoArquivo(caminho: string): string {
  return caminho.split(".").pop()?.toUpperCase() || "";
}
