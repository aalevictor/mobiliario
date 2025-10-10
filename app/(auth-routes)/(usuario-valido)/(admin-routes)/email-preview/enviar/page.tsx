import { emailsAprovados, emailsParticipantes } from "@/services/cadastros";
import EnviarForm from "./_components/enviar_form";
import { emailsDuvidas } from "@/services/duvidas";

export default async function EnviarEmail() {
    const emailsDuvidasEmail = [
        "isa@panapana.arq.br",
        "nicollepazmaia@gmail.com",
        "gianine.laiza@novidario.com.br",
        "srmarceloj@gmail.com",
        "marcela.rzd@gmail.com"
    ];
    const emailsParticipantesLista = await emailsParticipantes();
    const emailsAprovadosLista = await emailsAprovados();
    const emailsDuvidasPortal = await emailsDuvidas();

    return (
        <EnviarForm
            emailsParticipantes={emailsParticipantesLista}
            emailsDuvidasPortal={emailsDuvidasPortal}
            emailsDuvidasEmail={emailsDuvidasEmail}
            emailsAprovados={emailsAprovadosLista}
            mailApi={process.env.MAIL_API || ""}
            mailFrom={process.env.MAIL_FROM || ""}
            mailBcc={process.env.MAIL_BCC || ""}
        />
    )
}