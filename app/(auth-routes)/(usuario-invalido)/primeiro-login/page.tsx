import { auth } from "@/auth";
import FormAlterarSenha from "./_components/form-alterar-senha";
import { User } from "next-auth";

export default async function PrimeiroLogin() {
    const session = await auth();
    return <div className="container mx-auto h-full px-4 max-sm:px-2 py-6 max-w-6xl flex flex-col gap-3">
        <FormAlterarSenha usuario={session?.user as User} />
    </div>;
}