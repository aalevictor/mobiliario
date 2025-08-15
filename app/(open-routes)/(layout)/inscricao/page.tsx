/** @format */

"use client";

import Stepper, { Step } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatarCEP,
  formatarCNPJ,
  formatarCPF,
  formatarTelefone,
  formataUF,
} from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { BaseSyntheticEvent, startTransition, useState } from "react";
import { toast } from "sonner";
import { ViaCepResposta } from "@/app/api/buscar-cep/[cep]/cep.dto";
import { IParticipante } from "@/app/api/cadastro/cadastro.dto";
import { useRouter } from "next/navigation";

export default function PreCadastroPage() {
  const initialStep = 1;
  // const [open, setOpen] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [step, setStep] = useState(initialStep);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [confirmarEmail, setConfirmarEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [carteira_tipo, setCarteira_tipo] = useState("CAU");
  const [carteira_numero, setCarteira_numero] = useState("");
  const [equipe, setEquipe] = useState(false);
  const [cep, setCep] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [termos, setTermos] = useState(false);
  const [envioUnico, setEnvioUnico] = useState(false);
  const [participantes, setParticipantes] = useState<IParticipante[]>([]);
  const [participanteNome, setParticipanteNome] = useState("");
  const [participanteDocumento, setParticipanteDocumento] = useState("");
  const router = useRouter();

  function Finalizado() {
    return (
      <div className="flex flex-col p-2 px-8 md:px-16 md:py-4">
        <h2 className="text-lg mb-2">Responsável pelo projeto</h2>
        <div className="flex flex-col gap-2 text-muted-foreground">
          <p>{nome}</p>
          <p>{email}</p>
          <p>{telefone}</p>
          <p>{cpf}</p>
          <p>{cnpj}</p>
          {carteira_numero && (
            <p>
              {carteira_tipo} - {carteira_numero}
            </p>
          )}
        </div>
        <Separator className="my-4" />
        <h2 className="text-lg mb-2">Endereço</h2>
        <div className="flex flex-col gap-2 text-muted-foreground">
          <p>{cep}</p>
          <p>
            {logradouro}
            {numero && `, ${numero}`}
            {complemento && ` - ${complemento}`}
          </p>
          <p>
            {cidade} - {uf}
          </p>
        </div>

        <Separator className="my-4" />
        <FormItem className="gap-1 flex items-center space-x-2">
          <Checkbox
            name="termos"
            checked={termos}
            onCheckedChange={(checked: boolean) => setTermos(checked as boolean)}
          />
          <Label
            htmlFor="termos"
            className="cursor-pointer"
            onClick={() => setTermos(!termos)}
          >
            Declaro que as informações aqui prestadas são verdadeiras mediante
            pena de lei .....
          </Label>
        </FormItem>
      </div>
    );
  }

  function Submit() {
    return (
      <Button
        disabled={!termos}
        variant={termos ? "default" : "outline"}
        type="submit"
      >
        {termos
          ? "Enviar"
          : "Você deve aceitar os termos"
        }
      </Button>
    );
  }

  function handleSubmit(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event?: BaseSyntheticEvent<object, any, any> | undefined
  ) {
    event?.preventDefault();
    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("email", email);
    formData.append("senha", senha);
    formData.append("telefone", telefone);
    formData.append("cpf", cpf);
    formData.append("cnpj", cnpj);
    formData.append("carteira_tipo", carteira_tipo);
    formData.append("carteira_numero", carteira_numero);
    formData.append("equipe", equipe.toString());
    formData.append("cep", cep);
    formData.append("logradouro", logradouro);
    formData.append("cidade", cidade);
    formData.append("uf", uf);
    if (numero) formData.append("numero", numero);
    if (complemento) formData.append("complemento", complemento);
    formData.append("participantes", JSON.stringify(participantes));
    startTransition(async () => {
      const res = await fetch(
        `/api/cadastro`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (res.status === 201) {
        toast.success("Cadastro Realizado. Verifique seu Email");
        router.push("auth/login");
        // setOpen(true);
      } else {
        toast.error("Erro ao enviar inscrição. Tente novamente.");
      }
    });
  }

  async function buscaCEP(cep: string) {
    cep = cep.replace(/\D/g, "").trim().substring(0, 8);
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data: ViaCepResposta = await response.json();
        setUf(data.uf ? data.uf : "");
        setCidade(data.localidade ? data.localidade : "");
        setLogradouro(data.logradouro ? data.logradouro : "");
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function stepCompleted() {
    if (checkStep1() && checkStep2() && checkStep3()) {
      return true;
    }
    return false;
  }

  function checkStep1() {
    return !envioUnico;
  }

  function checkStep2() {
    if (!nome || nome.trim() === "" || nome.length < 3) return false;
    if (!email || email.trim() === "" || !email.includes("@")) return false;
    if (!telefone || telefone.trim() === "" || telefone.length < 14) return false;
    if (!cpf || cpf.trim() === "" || cpf.length < 14) return false;
    if (!cnpj || cnpj.trim() === "" || cnpj.length < 18) return false;
    if (!carteira_tipo || !carteira_numero || carteira_numero.trim() === "") return false;
    if (!senha || senha.trim() === "" || senha.length < 6) return false;
    if (!confirmarSenha || confirmarSenha.trim() === "" || senha !== confirmarSenha) return false;
    return true;
  }

  function checkStep3() {
    let step3 = true;
    if (equipe) step3 = validaEquipe();
    if (!equipe) step3 = validaEndereco();
    return step3;
  }

  function validaEndereco() {
    let valida = true;
    if (
      !cep ||
      !logradouro ||
      !cidade ||
      !uf ||
      cep === "" ||
      logradouro === "" ||
      cidade === "" ||
      uf === "" ||
      uf.length !== 2 ||
      cep.length !== 9
    )
      valida = false;
    return valida;
  }

  function validaEquipe() {
    let valida = true;
    valida = participantes.length > 0;
    return valida;
  }

  function adicionarParticipante() {
    setParticipantes([
      ...participantes,
      { nome: participanteNome, documento: participanteDocumento },
    ]);
    setParticipanteNome("");
    setParticipanteDocumento("");
  }

  function removerParticipante(index: number): void {
    const newParticipantes = [...participantes];
    newParticipantes.splice(index, 1);
    setParticipantes(newParticipantes);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function disableNextButton(): boolean | undefined {
    let valido = true;
    valido = checkStep1();
    valido = checkStep2();
    return valido;
  }

  return (
    <div className="container mx-auto h-full min-h-screen flex items-center justify-center">
      <div className="max-w-3xl w-full mx-auto">
        <form onSubmit={handleSubmit}>
          <Stepper
            initialStep={initialStep}
            onStepChange={(step) => {
              console.log(step);
              setStep(step)
            }}
            backButtonText="Voltar"
            nextButtonText="Próximo"
            completeButtonText="Finalizar"
            disableStepIndicators={true}
            stepCircleContainerClassName="w-full bg-white"
            contentClassName="my-6"
            final={<Finalizado />}
            submitButton={<Submit />}
            disableNextButton={false}
          >
            <Step>
              <div className="flex flex-col gap-4">
                <h2>Instruções sobre o envio dos dados</h2>
                <span className="text-muted-foreground">
                  Preencha os campos abaixo com os dados pessoais e
                  empresariais. Os arquivos de inscrição e projetos devem ser
                  anexados ao formulário.
                </span>
                <span className="font-bold">
                  Esse é um periodo de pré inscrição.
                </span>
                <div className="gap-1 flex items-center space-x-2">
                  <Checkbox
                    name="envioUnico"
                    onCheckedChange={(checked: boolean) =>
                      setEnvioUnico(checked as boolean)
                    }
                    checked={envioUnico}
                  />
                  <Label
                    className="cursor-pointer"
                    onClick={() => setEnvioUnico(!envioUnico)}
                  >
                    Declaro que li e desejo continuar.
                  </Label>
                </div>
              </div>
            </Step>
            <Step>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-4 gap-6">
                  <div className="col-span-4 md:col-span-4 flex flex-col gap-3">
                    <Label>Nome</Label>
                    <Input
                      placeholder="Nome do responsável pelo projeto"
                      name="nome"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2 flex flex-col gap-3">
                    <Label>CPF</Label>
                    <Input
                      placeholder="000.000.000-00"
                      name="cpf"
                      value={cpf}
                      onChange={(e) => setCpf(formatarCPF(e.target.value))}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 flex flex-col gap-3">
                    <Label>CNPJ</Label>
                    <Input
                      placeholder="00.000.0000/0000-00"
                      name="cnpj"
                      value={cnpj}
                      onChange={(e) => setCnpj(formatarCNPJ(e.target.value))}
                    />
                  </div>

                  <div className="col-span-4 md:col-span-4 flex flex-col gap-3">
                    <Label>Telefone</Label>
                    <Input
                      placeholder="(00) 90000-0000"
                      name="telefone"
                      value={telefone}
                      onChange={(e) =>
                        setTelefone(formatarTelefone(e.target.value))
                      }
                    />
                  </div>
                  <div className="col-span-4 md:col-span-1 flex flex-col gap-3">
                    <Label>CAU/CREA</Label>
                    <Select
                      onValueChange={setCarteira_tipo}
                      defaultValue={carteira_tipo}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Tipo</SelectLabel>
                          <SelectItem value="CAU">CAU</SelectItem>
                          <SelectItem value="CREA">CREA</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-4 md:col-span-3 flex flex-col gap-3">
                    <Label>Número de identificação</Label>
                    <Input
                      placeholder={
                        carteira_tipo === "CAU" ? "A000000-0" : "0000000000"
                      }
                      name="carteira_numero"
                      value={carteira_numero}
                      onChange={(e) => setCarteira_numero(e.target.value)}
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2 flex flex-col gap-3">
                    <Label>Email</Label>
                    <Input
                      placeholder="exemplo@email.com"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="col-span-4 md:col-span-2 flex flex-col gap-3">
                    <Label>Confirmar Email</Label>
                    <Input
                      placeholder="seu@email.com"
                      name="confirmarEmail"
                      type="email"
                      value={confirmarEmail}
                      onChange={(e) => setConfirmarEmail(e.target.value)}
                    />
                  </div>

                  {confirmarEmail !== email && (
                    <div className="col-span-4">
                      <span className="text-sm font-medium text-destructive">
                        Email não coincidem
                      </span>
                    </div>
                  )}

                  <div className="col-span-4 md:col-span-2 flex flex-col gap-3">
                    <Label>Senha</Label>
                    <Input
                      placeholder="Digite sua senha"
                      type="password"
                      name="senha"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                    />
                  </div>
                  <div className="col-span-4 md:col-span-2 flex flex-col gap-3">
                    <Label>Confirmar Senha</Label>
                    <Input
                      placeholder="Confirme sua senha"
                      type="password"
                      name="confirmarSenha"
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                    />
                  </div>
                  {confirmarSenha !== senha && (
                    <div className="col-span-4">
                      <span className="text-sm font-medium text-destructive">
                        Senha não coincidem
                      </span>
                    </div>
                  )}
                  <div className="col-span-4 md:col-span-4 gap-1 flex items-center space-x-2">
                    <Checkbox
                      name="equipe"
                      onCheckedChange={(checked: boolean) =>
                        setEquipe(checked as boolean)
                      }
                      checked={equipe}
                    />
                    <Label
                      className="cursor-pointer"
                      onClick={() => setEquipe(!equipe)}
                    >
                      Essa inscrição representa uma equipe.
                    </Label>
                  </div>
                </div>
              </div>
            </Step>
            {equipe && (
              <Step>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-6 gap-3 items-end">
                    <div className="col-span-6 rounded overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-primary hover:bg-primary">
                            <TableHead colSpan={3}>
                              <div className="grid grid-cols-10 gap-1 w-full text-primary-foreground">
                                <div className="col-span-5">Nome</div>
                                <div className="col-span-4">Documento</div>
                                <div className="col-span-1"></div>
                              </div>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell colSpan={3}>
                              <div className="grid grid-cols-10 gap-3 sm:gap-1 w-full">
                                <Input
                                  className="col-span-10 sm:col-span-5"
                                  placeholder="Nome do participante (empresa/pessoa física)"
                                  name="participanteNome"
                                  value={participanteNome}
                                  onChange={(e) =>
                                    setParticipanteNome(e.target.value)
                                  }
                                />
                                <Input
                                  className="col-span-10 sm:col-span-4"
                                  placeholder="CPF/CNPJ"
                                  name="participanteDocumento"
                                  value={participanteDocumento}
                                  onChange={(e) =>
                                    setParticipanteDocumento(
                                      formatarCPF(e.target.value)
                                    )
                                  }
                                />
                                <Button
                                  className="col-span-10 mt-2 sm:mt-0 sm:col-span-1"
                                  type="button"
                                  onClick={() => adicionarParticipante()}
                                >
                                  <Plus />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          {participantes.map((participante, index) => (
                            <TableRow key={index}>
                              <TableCell colSpan={3}>
                                <div className="grid grid-cols-10 gap-1 w-full items-center">
                                  <div className="col-span-5">
                                    {participante.nome}
                                  </div>
                                  <div className="col-span-4">
                                    {participante.documento}
                                  </div>
                                  <Button
                                    type="button"
                                    variant="link"
                                    className="col-span-1 rounded-full text-destructive"
                                    onClick={() => removerParticipante(index)}
                                  >
                                    <X />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </Step>
            )}
            <Step>
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-4 md:col-span-4 flex flex-col gap-3">
                  <Label>CEP</Label>
                  <Input
                    name="cep"
                    placeholder="00000-000"
                    value={cep}
                    onBlur={(e) => buscaCEP(e.target.value)}
                    onChange={(e) => {
                      setCep(formatarCEP(e.target.value));
                      setLogradouro("");
                      setCidade("");
                      setUf("");
                    }}
                  />
                </div>
                <div className="col-span-4 md:col-span-1 flex flex-col gap-3">
                  <Label>Estado</Label>
                  <Input
                    disabled
                    placeholder="UF"
                    value={uf}
                    className="disabled:opacity-100"
                    onChange={(e) => setUf(formataUF(e.target.value))}
                    readOnly
                  />
                </div>
                <div className="col-span-4 md:col-span-3 flex flex-col gap-3">
                  <Label>Cidade</Label>
                  <Input
                    disabled
                    placeholder="Cidade"
                    name="cidade"
                    className="disabled:opacity-100"
                    value={cidade}
                    onChange={(e) => setCidade(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="col-span-4 md:col-span-3 flex flex-col gap-3">
                  <Label>Logradouro</Label>
                  <Input
                    disabled
                    placeholder="Logradouro"
                    className="disabled:opacity-100"
                    name="logradouro"
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                    readOnly
                  />
                </div>
                <div className="col-span-4 md:col-span-1 flex flex-col gap-3">
                  <Label>Número</Label>
                  <Input
                    placeholder="Número"
                    name="numero"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                  />
                </div>
                <div className="col-span-4 md:col-span-4 flex flex-col gap-3">
                  <Label>Complemento</Label>
                  <Input
                    placeholder="Complemento"
                    name="complemento"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                  />
                </div>
              </div>
            </Step>
          </Stepper>
        </form>
      </div>
    </div>
  );
}
