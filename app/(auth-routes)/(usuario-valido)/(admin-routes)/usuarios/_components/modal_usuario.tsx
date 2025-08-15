'use client'

import { Usuario, Permissao } from ".prisma/client";
import ModalUsuarioPermissao from "./modal_usuario_permissao";

interface ModalUsuarioProps {
    usuario?: Usuario;
    children?: React.ReactNode;
    permissao?: Permissao;
}

export default function ModalUsuario({ usuario, children, permissao }: ModalUsuarioProps) {
    if (!permissao) return null;
    return <ModalUsuarioPermissao permissao={permissao} usuario={usuario}>{children}</ModalUsuarioPermissao>;
}
