import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card";
import { buscarInforme } from "@/services/informes";
import { redirect } from "next/navigation";
import FormInforme from "./_components/form-informe";

export default async function InformeAdmin({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const informe = id === "novo" ? null : await buscarInforme(id);
    if (!informe && id !== "novo") redirect('/informes-admin');
    return (
        <div className="relative h-full container mx-auto px-4 py-6 max-w-8xl space-y-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {informe ? "Editar Informe" : "Novo Informe"}
                    </CardTitle>
                    <CardDescription>
                        Visualize, edite e gerencie todos os informes do sistema
                    </CardDescription>
                </CardHeader>
            </Card>
            <Card>
                <CardContent>
                    <FormInforme informe={informe} />
                </CardContent>
            </Card>
        </div>
    )
}