/** @format */

'use client';

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from './ui/table';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	className?: string;
}

export default function DataTable<TData, TValue>({
	columns,
	data,
	className,
}: DataTableProps<TData, TValue>) {
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});
	return (
	
			<div className={cn('rounded-md', className)}>
				<Table className='bg-background dark:bg-muted/50 rounded'>
					<TableHeader className='bg-primary hover:bg-primary'>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow
								className='hover:bg-primary'
								key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead
											className='text-white text-xs text-nowrap'
											key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									className='px-4'
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className='text-sm px-4 text-nowrap font-light'>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'>
									Sem resultados.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		
	);
}

export function TableSkeleton() {
	return <Skeleton className='h-240 w-full rounded-xl' />;
}
