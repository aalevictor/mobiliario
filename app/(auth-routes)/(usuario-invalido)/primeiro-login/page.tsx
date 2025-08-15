import { auth } from "@/auth";
import FormAlterarSenha from "./_components/form-alterar-senha";
import { User } from "next-auth";

export default async function PrimeiroLogin() {
    const session = await auth();
    return <div className="flex flex-col items-center justify-center w-full">
        <FormAlterarSenha usuario={session?.user as User} />
    </div>;
}