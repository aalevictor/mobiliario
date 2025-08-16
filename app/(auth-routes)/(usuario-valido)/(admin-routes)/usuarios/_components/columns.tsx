/** @format */

'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Usuario } from '@prisma/client';
import ModalUsuario from './modal_usuario';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

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
		header: () => <p className='text-center'></p>,
		cell: ({ row }) => {
			return (
				<div className='flex items-center justify-center'>
					<ModalUsuario usuario={row.original}>
						<Button variant='outline'>
							<Pencil />
						</Button>
					</ModalUsuario>
				</div>
			);
		},
	},
];
