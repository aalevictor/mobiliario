import { Permissao, Tipo_Usuario } from "@prisma/client";

export interface IUsuario {
    id: number;
    login: string;
    nome: string;
    email: string;
    permissao: string;
    criadoEm: Date;
    atualizadoEm: Date;
}

export interface IPaginadoUsuario {
    pagina: number;
    limite: number;
    total: number;
    data: IUsuario[];
}

export interface ICreateUsuario {
    email: string;
    nome: string;
    permissao: Permissao;
    tipo: Tipo_Usuario;
    login?: string;
    senha?: string;
}