/** @format */

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, ChevronsUpDown, RefreshCw, X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';

interface CampoFiltravel {
	nome: string;
	tag: string;
	tipo: TiposFiltros;
	default?: string;
	valores?: CampoSelect[] | CampoDataRange
	placeholder?: string
}

export enum TiposFiltros {
	TEXTO,
	DATA,
	SELECT,
	AUTOCOMPLETE,
	MULTISELECT
}

interface CampoSelect {
	value: string | number;
	label: string;
}

interface CampoDataRange {
	modo: 'unico' | 'intervalo';
}

interface FiltrosProps {
	camposFiltraveis?: CampoFiltravel[];
	className?: string;
}

export function Filtros({ camposFiltraveis, className }: FiltrosProps) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	
	const [filtros, setFiltros] = useState<{ [key: string]: string }>(
		camposFiltraveis ? camposFiltraveis.reduce((acc, item) => ({ ...acc, [item.tag]: item.default || '' }), {}): {}
	);

	useEffect(() => {
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		for (const [key, value] of searchParams) {
			setFiltros((prev) => ({
				...prev,
				[key]: value,
			}));
		}
	}, [searchParams]);

	function atualizaFiltros() {
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(filtros)) {
			if (value && value !== '') params.set(key, value);
		}
		const query = params.toString();
		router.push(query ? `${pathname}?${query}` : pathname);
		router.refresh();
	}

	function limpaFiltros() {
		setFiltros(camposFiltraveis ? camposFiltraveis.reduce((acc, item) => ({ ...acc, [item.tag]: '' }), {}) : {});
		router.replace(pathname);
		router.refresh();
	}

	function renderFiltros() {
		const filtros = [];
		if (camposFiltraveis) {
			for (const campo of camposFiltraveis) {
				switch (campo.tipo) {
					case TiposFiltros.TEXTO:
						filtros.push(RenderTexto(campo));
						break;
					case TiposFiltros.SELECT:
						filtros.push(RenderSelect(campo));
						break;
					case TiposFiltros.AUTOCOMPLETE:
						filtros.push(RenderAutocomplete(campo));
						break;
					case TiposFiltros.MULTISELECT:
						filtros.push(RenderMultiSelect(campo));
						break;
				}
			}
		}
		return filtros;
	  }

	function RenderTexto(campo: CampoFiltravel) {
		return (
			<div
				className='flex flex-col w-full min-w-0 md:w-60 md:min-w-60'
				key={campo.tag}>
				<p className='text-sm font-medium mb-1 truncate'>{campo.nome}</p>
				<Input
					value={filtros[campo.tag]}
					onChange={(e) =>
						setFiltros((prev) => ({ ...prev, [campo.tag]: e.target.value }))
					}
					className='bg-background w-full'
					placeholder={campo.placeholder}
				/>
			</div>
		);
	}

	function RenderSelect(campo: CampoFiltravel) {
		return (
			<div
				className='flex flex-col w-full min-w-0 md:w-60 md:min-w-60'
				key={campo.tag}>
				<p className='text-sm font-medium mb-1 truncate'>{campo.nome}</p>
				<Select
					onValueChange={(value) =>
						setFiltros((prev) => ({ ...prev, [campo.tag]: value }))
					}
					value={filtros[campo.tag]}>
					<SelectTrigger className='w-full bg-background'>
						<SelectValue placeholder={campo.placeholder} className='truncate' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='all'>
							Tudo
						</SelectItem>
						{campo.valores &&
							(campo.valores as CampoSelect[]).map((item) => {
								return (
									<SelectItem
										key={item.value}
										value={item.value.toString()}>
										{item.label}
									</SelectItem>
								);
							})}
					</SelectContent>
				</Select>
			</div>
		);
	}

	function RenderAutocomplete(campo: CampoFiltravel) {
		const [open, setOpen] = useState(false);
		const [value, setValue] = useState(campo.default || '');
		const valores = campo.valores as CampoSelect[] || [];
		return <div className='flex flex-col w-full min-w-0 md:w-60 md:min-w-60' key={campo.tag}>
			<p className='text-sm font-medium mb-1 truncate'>{campo.nome}</p>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between"
					>
					<span className='truncate'>
						{value
							? valores.find((opcao) => opcao.label === value)?.label
							: campo.placeholder }
					</span>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-full p-0">
					<Command>
						<CommandInput placeholder="Buscar opção" />
						<CommandList>
							<CommandEmpty>Opção não encontrada</CommandEmpty>
							<CommandGroup>
								{valores.map((opcao) => (
									<CommandItem
										key={opcao.value}
										value={opcao.value.toString()}
										onSelect={(currentValue) => {
											const next = currentValue === value ? "" : currentValue;
											setValue(next);
											setFiltros((prev) => ({ ...prev, [campo.tag]: next }));
											setOpen(false);
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === opcao.value ? "opacity-100" : "opacity-0"
											)}
										/>
										{opcao.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
				</Popover>
		</div>
	}

	function RenderMultiSelect(campo: CampoFiltravel) {
		const [open, setOpen] = useState(false);
		const valores = (campo.valores as CampoSelect[]) || [];
		const selecionados = (filtros[campo.tag] || '').split(',').filter(Boolean);

		function toggleValor(valor: string) {
			const next = selecionados.includes(valor)
				? selecionados.filter((v) => v !== valor)
				: [...selecionados, valor];
			setFiltros((prev) => ({ ...prev, [campo.tag]: next.join(',') }));
		}

		return (
			<div className='flex flex-col w-full min-w-0 md:w-60 md:min-w-60' key={campo.tag}>
				<p className='text-sm font-medium mb-1 truncate'>{campo.nome}</p>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							role="combobox"
							aria-expanded={open}
							className="w-full justify-between bg-background font-normal"
						>
							<span className='truncate'>
								{selecionados.length > 0
									? `${selecionados.length} selecionado${selecionados.length > 1 ? 's' : ''}`
									: campo.placeholder}
							</span>
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-full p-0" align="start">
						<Command>
							<CommandInput placeholder="Buscar opção" />
							<CommandList>
								<CommandEmpty>Opção não encontrada</CommandEmpty>
								<CommandGroup>
									{valores.map((opcao) => {
										const valorStr = opcao.value.toString();
										const isSelected = selecionados.includes(valorStr);
										return (
											<CommandItem
												key={valorStr}
												value={opcao.label}
												onSelect={() => toggleValor(valorStr)}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														isSelected ? "opacity-100" : "opacity-0"
													)}
												/>
												{opcao.label}
											</CommandItem>
										);
									})}
								</CommandGroup>
							</CommandList>
						</Command>
					</PopoverContent>
				</Popover>
			</div>
		);
	}

	return (
		<div className={cn('flex flex-col lg:flex-row lg:items-end gap-4 w-full overflow-x-auto', className)}>
			<div className='flex flex-col sm:flex-row flex-wrap gap-4 flex-1 min-w-0'>
				{renderFiltros()}
			</div>
			<div className="flex gap-2 shrink-0">
				<Button 
					size='sm'
					onClick={() => atualizaFiltros()} 
					title='Aplicar filtros'
					className='min-w-[40px]'
				>
					<RefreshCw className='h-4 w-4' />
				</Button>
				<Button
					variant={'destructive'}
					size='sm'
					onClick={() => limpaFiltros()}
					title='Limpar filtros'
					className='min-w-[40px]'
				>
					<X className='h-4 w-4' />
				</Button>
			</div>
		</div>
	);
}
