'use client';

import { useRouter } from 'next/navigation';
import ModalImportarExcel from './modal-importar-excel';

export default function ImportarExcelWrapper() {
    const router = useRouter();

    const handleImportSuccess = () => {
        router.refresh();
    };

    return (
        <ModalImportarExcel onImportSuccess={handleImportSuccess} />
    );
}