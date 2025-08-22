"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Sair() {
    const router = useRouter();
	return (
        <Button
            variant='destructive'
            className='cursor-pointer hover:bg-destructive-foreground hover:text-destructive focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#A5942B]'
            title='Sair'
            aria-label="Fazer logout da conta"
            onClick={async () => {
                await signOut({ redirect: false });
                // Força o refresh da página e redirecionamento mesmo se já estiver na home
                router.refresh();
                router.push("/");
                // Fallback: se o router.push não funcionar, força o reload
                setTimeout(() => {
                    window.location.href = "/";
                }, 100);
            }}
        >
            <LogOut aria-hidden="true" />
            <span className="sr-only">Sair</span>
        </Button>
	)
}