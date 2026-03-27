// Espelha o enum Proposta do schema Prisma
// Após rodar `prisma generate`, pode-se importar Proposta de "@prisma/client"
export const PROPOSTA_LABELS: Record<string, string> = {
    FASE1: "Fase 1",

    // Grupo 1
    G1_QUIOSQUE_MEDIO_PORTE: "G1 - Quiosque de Médio Porte",
    G1_QUIOSQUE_GRANDE_PORTE: "G1 - Quiosque de Grande Porte",
    G1_SANITARIO_PUBLICO: "G1 - Sanitário Público",
    G1_TOTEM_MARCO_REFERENCIAL: "G1 - Totem Marco Referencial",
    G1_TOTEM_DE_APOIO: "G1 - Totem de Apoio",
    G1_BEBEDOURO: "G1 - Bebedouro",

    // Grupo 2
    G2_BANCO_COLETIVO_SEM_ENCOSTO: "G2 - Banco Coletivo sem Encosto",
    G2_BANCO_COLETIVO_COM_ENCOSTO: "G2 - Banco Coletivo com Encosto",
    G2_BANCO_COLETIVO_COM_ENCOSTO_E_APOIOS: "G2 - Banco Coletivo com Encosto e Apoios",
    G2_PAPELEIRA_INDIVIDUAL: "G2 - Papeleira Individual",
    G2_PAPELEIRA_DUPLA: "G2 - Papeleira Dupla",
    G2_PARACICLO_UNITARIO: "G2 - Paraciclo Unitário",
    G2_CONJUNTO_DE_PARACICLOS: "G2 - Conjunto de Paraciclos",
    G2_TOTEM_ORIENTATIVO: "G2 - Totem Orientativo",
    G2_GUARDA_CORPO_FIXO: "G2 - Guarda-corpo Fixo",
    G2_GUARDA_CORPO_MOVEL: "G2 - Guarda-corpo Móvel",
    G2_BALIZADOR_FLEXIVEL: "G2 - Balizador Flexível",
    G2_BALIZADOR_SOLIDO: "G2 - Balizador Sólido",

    // Grupo 3
    G3_FLOREIRA: "G3 - Floreira",
    G3_VASO: "G3 - Vaso",
    G3_ELEMENTO_DE_SOMBREAMENTO_VERDE: "G3 - Elemento de Sombreamento Verde",
    G3_TUTOR_PARA_PLANTAS: "G3 - Tutor para Plantas",
    G3_PROTETOR_DE_RAIZES: "G3 - Protetor de Raízes",
}

export const PROPOSTA_GRUPOS = [
    {
        label: "Grupo 1 — Utilidade Pública com infraestrutura",
        items: [
            "G1_QUIOSQUE_MEDIO_PORTE",
            "G1_QUIOSQUE_GRANDE_PORTE",
            "G1_SANITARIO_PUBLICO",
            "G1_TOTEM_MARCO_REFERENCIAL",
            "G1_TOTEM_DE_APOIO",
            "G1_BEBEDOURO",
        ],
    },
    {
        label: "Grupo 2 — Descanso, Convívio e Utilidade Pública",
        items: [
            "G2_BANCO_COLETIVO_SEM_ENCOSTO",
            "G2_BANCO_COLETIVO_COM_ENCOSTO",
            "G2_BANCO_COLETIVO_COM_ENCOSTO_E_APOIOS",
            "G2_PAPELEIRA_INDIVIDUAL",
            "G2_PAPELEIRA_DUPLA",
            "G2_PARACICLO_UNITARIO",
            "G2_CONJUNTO_DE_PARACICLOS",
            "G2_TOTEM_ORIENTATIVO",
            "G2_GUARDA_CORPO_FIXO",
            "G2_GUARDA_CORPO_MOVEL",
            "G2_BALIZADOR_FLEXIVEL",
            "G2_BALIZADOR_SOLIDO",
        ],
    },
    {
        label: "Grupo 3 — Paisagem e adaptação climática",
        items: [
            "G3_FLOREIRA",
            "G3_VASO",
            "G3_ELEMENTO_DE_SOMBREAMENTO_VERDE",
            "G3_TUTOR_PARA_PLANTAS",
            "G3_PROTETOR_DE_RAIZES",
        ],
    },
]
