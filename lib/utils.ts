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

/**
 * Formata uma data para o formato brasileiro (dd/MM/yyyy HH:mm)
 */
export function formatarData(data: Date | string, incluirHora: boolean = true): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  if (isNaN(dataObj.getTime())) {
    return 'Data inválida';
  }

  const dia = dataObj.getDate().toString().padStart(2, '0');
  const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
  const ano = dataObj.getFullYear();
  
  if (!incluirHora) {
    return `${dia}/${mes}/${ano}`;
  }
  
  const hora = dataObj.getHours().toString().padStart(2, '0');
  const minuto = dataObj.getMinutes().toString().padStart(2, '0');
  
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

/**
 * Formata uma data para o formato brasileiro longo (dd de MMMM de yyyy)
 */
export function formatarDataLonga(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  if (isNaN(dataObj.getTime())) {
    return 'Data inválida';
  }

  const meses = [
    'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
    'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
  ];

  const dia = dataObj.getDate();
  const mes = meses[dataObj.getMonth()];
  const ano = dataObj.getFullYear();
  
  return `${dia} de ${mes} de ${ano}`;
}

/**
 * Formata uma data para o formato ISO (yyyy-MM-dd)
 */
export function formatarDataISO(data: Date | string): string {
  const dataObj = typeof data === 'string' ? new Date(data) : data;
  
  if (isNaN(dataObj.getTime())) {
    return '';
  }

  const ano = dataObj.getFullYear();
  const mes = (dataObj.getMonth() + 1).toString().padStart(2, '0');
  const dia = dataObj.getDate().toString().padStart(2, '0');
  
  return `${ano}-${mes}-${dia}`;
}
