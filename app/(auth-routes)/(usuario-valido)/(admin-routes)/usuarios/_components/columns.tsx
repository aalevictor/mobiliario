/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Usuario } from '@prisma/client';
import ModalUsuario from './modal_usuario';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

// Componente de confirmação de exclusão
function ConfirmacaoExclusao({ usuario, onExcluir }: { usuario: Usuario, onExcluir: () => void }) {
    const [open, setOpen] = useState(false);
    const [isDeletando, setIsDeletando] = useState(false);

    const handleExcluir = async () => {
        setIsDeletando(true);
        try {
            const response = await fetch(`/api/usuario/${usuario.id}`, {
                method: 'DELETE',
            });
            
            if (response.ok) {
                toast.success('Usuário excluído com sucesso');
                onExcluir();
                setOpen(false);
            } else {
                const error = await response.json();
                toast.error(error.error || 'Erro ao excluir usuário');
            }
        } catch {
            toast.error('Erro ao excluir usuário');
        } finally {
            setIsDeletando(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                        Tem certeza que deseja excluir o usuário <strong>{usuario.nome}</strong>?
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-6 space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700">
                            <strong>Atenção:</strong> Esta ação não pode ser desfeita. O usuário será permanentemente removido do sistema.
                        </p>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isDeletando}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleExcluir}
                            disabled={isDeletando}
                        >
                            {isDeletando ? 'Excluindo...' : 'Excluir Usuário'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export const columns: ColumnDef<Usuario>[] = [
	{
		accessorKey: 'nome',
		header: 'Nome',
	},
	{
		accessorKey: 'login',
		header: 'Usuário',
	},
	{
		accessorKey: 'email',
		header: 'E-mail',
	},
	{
		accessorKey: 'permissao',
		header: 'Permissão',
	},
	{
		accessorKey: 'tipo',
		header: 'Tipo',
	},
	{
		accessorKey: 'status',
		header: () => <p className='text-center'>Status</p>,
		cell: ({ row }) => {
			const status = row.original.status;
			return (
				<div className='flex items-center justify-center'>
					<Badge variant={`${status == false ? 'destructive' : 'default'}`}>
						{status ? 'Ativo' : 'Inativo'}
					</Badge>
				</div>
			);
		},
	},
	{
		accessorKey: 'actions',
		header: () => <p className='text-center'>Ações</p>,
		cell: ({ row }) => {
			return row.original.permissao !== "PARTICIPANTE" && (
				<div className='flex items-center justify-center gap-2'>
					<ModalUsuario usuario={row.original}>
						<Button variant='outline' size="sm">
							<Pencil className="h-4 w-4" />
						</Button>
					</ModalUsuario>
					<ConfirmacaoExclusao 
						usuario={row.original} 
						onExcluir={() => {
							// Força a atualização da página para refletir a exclusão
							window.location.reload();
						}}
					/>
				</div>
			);
		},
	},
];
