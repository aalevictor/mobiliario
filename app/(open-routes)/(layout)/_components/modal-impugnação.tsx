import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SendIcon } from "lucide-react";

export default function ModalImpugnacao() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    size="lg"
                    className="px-4 py-1 text-lg font-semibold cursor-pointer"
                >
                    Enviar solicitação
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Pedido de impugnação</DialogTitle>
                    <DialogDescription>
                        Por favor, preencha o formulário abaixo para enviar sua solicitação de impugnação.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button>
                        <SendIcon className="w-4 h-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}