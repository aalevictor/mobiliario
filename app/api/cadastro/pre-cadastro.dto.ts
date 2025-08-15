export interface PreCadastro {
  nome: string;
  email: string;
  senha: string;
  cnpj: string;
  cpf: string;
  telefone: string;
  carteira_tipo: "CAU" | "CREA";
  carteira_numero: string;
  equipe: boolean;
  cep: string;
  uf: string;
  cidade: string;
  logradouro: string;
  numero?: string;
  complemento?: string;
  participantes?: IParticipante[];
}

export interface IParticipante {
  nome: string;
  documento: string;
}
