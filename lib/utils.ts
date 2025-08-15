import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatarCNPJ(cnpj: string) {
  if (!cnpj) return cnpj;
  const limpo = cnpj && cnpj.replaceAll(".", "").replaceAll("/", "").replaceAll("-", "").substring(0, 14);
  if (limpo.length <= 2) return limpo.replace(/(\d{0,2})/, '$1');
  if (limpo.length <= 5) return limpo.replace(/(\d{0,2})(\d{0,3})/, '$1.$2');
  if (limpo.length <= 8) return limpo.replace(/(\d{0,2})(\d{0,3})(\d{0,3})/, '$1.$2.$3');
  if (limpo.length <= 12) return limpo.replace(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})/, '$1.$2.$3/$4');
  return limpo.replace(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2})/, '$1.$2.$3/$4-$5');
}

export function formatarCPF(cpf: string) {
  if (!cpf) return cpf;
  const limpo = cpf && cpf.replace(/\D/g, '').substring(0, 11);
  if (limpo.length <= 3) return limpo.replace(/(\d{0,3})/, '$1');
  if (limpo.length <= 6) return limpo.replace(/(\d{0,3})(\d{0,3})/, '$1.$2');
  if (limpo.length <= 9) return limpo.replace(/(\d{0,3})(\d{0,3})(\d{0,3})/, '$1.$2.$3');
  return limpo.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/, '$1.$2.$3-$4');
}

export function formatarTelefone(telefone: string) {
  if (!telefone) return telefone;
  const limpo = telefone && telefone.replace(/\D/g, '').substring(0, 11);
  if (limpo.length <= 2) return limpo.replace(/(\d{0,2})/, '$1');
  if (limpo.length <= 6) return limpo.replace(/(\d{0,2})(\d{0,4})/, '($1) $2');
  if (limpo.length <= 10) return limpo.replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, '($1) $2-$3');
  return limpo.replace(/(\d{0,2})(\d{0,5})(\d{0,4})/, '($1) $2-$3');
}

export function formatarCEP(cep: string) {
  if (!cep) return cep;
  const limpo = cep && cep.replace(/\D/g, '').substring(0, 8);
  if (limpo.length <= 5) return limpo.replace(/(\d{0,5})/, '$1');
  return limpo.replace(/(\d{0,5})(\d{0,3})/, '$1-$2');
}

export function formatarCAU(cau: string) {
  //A000000-0
  if (!cau) return cau;
  const limpo = cau && cau.replace(/\D/g, '').substring(0, 8);
  if (limpo.length <= 7) return limpo.replace(/(\d{0,7})/, '$1');
  return limpo.replace(/(\d{0,7})(\d{0,1})/, '$1-$2');
}

export function formatarCREA(crea: string) {
  //A000000-0
  if (!crea) return crea;
  const limpo = crea && crea.replace(/\D/g, '').substring(0, 8);
  if (limpo.length <= 7) return limpo.replace(/(\d{0,7})/, '$1');
  return limpo.replace(/(\d{0,7})(\d{0,1})/, '$1-$2');
}

export function formataUF(uf: string) {
  if (!uf) return uf;
  return uf.substring(0, 2).toUpperCase();
}

export function verificaData(dataInicio: string, dataFim: string): [Date, Date] {
  let inicio: Date, fim: Date;
  if (!dataInicio) inicio = new Date();
  else {
    const dataSeparada = dataInicio.split('-');
    inicio = new Date(
      +dataSeparada[2],
      +dataSeparada[1] - 1,
      +dataSeparada[0],
      0, 0, 0
    )
  }
  if (!dataFim) fim = new Date();
  else {
    const dataSeparada = dataFim.split('-');
    fim = new Date(
      +dataSeparada[2],
      +dataSeparada[1] - 1,
      +dataSeparada[0],
      23, 59, 59, 999
    )
  }
  return [inicio, fim];
}

export function verificaPagina(pagina: number, limite: number) {
  if (!pagina) pagina = 1;
  if (!limite) limite = 10;
  if (pagina < 1) pagina = 1;
  if (limite < 1) limite = 10;
  return [pagina, limite];
}

export function verificaLimite(pagina: number, limite: number, total: number) {
  if ((pagina - 1) * limite >= total) pagina = Math.ceil(total / limite);
  return [pagina, limite];
}

export function gerarSenha(tamanho: number = 10) {
  return Math.random().toString(36).slice(tamanho * -1);
}
