"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import Stepper, { Step } from "@/components/stepper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Trash2, User } from "lucide-react";
import { formatarCEP, formatarCNPJ, formatarCPF, formatarTelefone } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Select, SelectValue, SelectItem, SelectContent, SelectGroup, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { ViaCepResposta } from "@/types/cep";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  instrucoes: z.boolean(),
  nome: z.string().min(3, "Nome é obrigatório"),
  email: z.email({ message: "E-mail inválido" }),
  confirmar_email: z.email({ message: "E-mail inválido" }),
  telefone: z.string().min(14, "Telefone é obrigatório"),
  cpf: z.string().min(14, "CPF é obrigatório"),
  cnpj: z.string().optional(),
  uf: z.string().min(2, "UF é obrigatória"),
  cidade: z.string().min(3, "Cidade é obrigatória"),
  logradouro: z.string().min(3, "Logradouro é obrigatório"),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  cep: z.string().min(9, "CEP é obrigatório"),
  equipe: z.boolean(),
  carteira_tipo: z.string().min(3, "Tipo de carteira é obrigatório"),
  carteira_numero: z.string().min(1, "Número de carteira é obrigatório"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  confirmar_senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  termos: z.boolean(),
});

export default function PreCadastroPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [participantesExistentes, setParticipantesExistentes] = useState<{ nome: string; documento: string }[]>([]);
    const [transition, startTransition] = useTransition();

    const [participanteNome, setParticipanteNome] = useState("");
    const [participanteDocumento, setParticipanteDocumento] = useState("");

    const form = useForm<z.input<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            instrucoes: false,
            nome: "",
            email: "",
            confirmar_email: "",
            telefone: "",
            cpf: "",
            cnpj: "",
            uf: "",
            cidade: "",
            logradouro: "",
            numero: "",
            complemento: "",
            cep: "",
            equipe: false,
            carteira_tipo: "",
            carteira_numero: "",
            senha: "",
            confirmar_senha: "",
            termos: false,
        },
    });

    const onSubmit = (data: z.input<typeof schema>) => {
        const dataEnvio = {
            equipe: data.equipe,
            nome: data.nome,
            senha: data.senha,
            email: data.email,
            telefone: data.telefone,
            cpf: data.cpf,
            cnpj: data.cnpj,
            carteira_tipo: data.carteira_tipo,
            carteira_numero: data.carteira_numero,
            cep: data.cep,
            logradouro: data.logradouro,
            cidade: data.cidade,
            uf: data.uf,
            numero: data.numero,
            complemento: data.complemento,
            participantes: participantesExistentes,
        }
        startTransition(async () => {
            const res = await fetch(
                `/api/cadastro`,
                {
                    method: "POST",
                    body: JSON.stringify(dataEnvio),
                }
            );        
            if (res.status === 201) {
                toast.success("Cadastro Realizado. Verifique seu Email");
                router.push("auth/login");
            } else {
                toast.error("Erro ao enviar inscrição. Tente novamente.");
            }
        });
    }

    function removerParticipante(documento: string): void {
        setParticipantesExistentes(participantesExistentes.filter(participante => participante.documento !== documento));
    }

    async function buscaCEP(cep: string) {
        cep = cep.replace(/\D/g, "").trim().substring(0, 8);
        if (cep.length === 8) {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data: ViaCepResposta = await response.json();
                form.setValue("uf", data.uf ? data.uf : "");
                form.setValue("cidade", data.localidade ? data.localidade : "");
                form.setValue("logradouro", data.logradouro ? data.logradouro : "");
            } catch (error) {
                console.error("Erro ao buscar CEP:", error);
            }
        }
    }

    function validaStep1(): boolean {
        if (!form.watch("instrucoes")) return false;
        return true;
    }

    function validaStep2(): boolean {
        if (
            !form.watch("nome") || 
            !form.watch("telefone") || 
            !form.watch("cpf") ||
            !form.watch("carteira_tipo") || 
            !form.watch("carteira_numero") || 
            !form.watch("email") || 
            !form.watch("confirmar_email") || 
            !form.watch("senha") || 
            !form.watch("confirmar_senha")
        ) return false;
        if (form.watch("senha") !== form.watch("confirmar_senha")) return false;
        if (form.watch("email") !== form.watch("confirmar_email")) return false;
        if (form.watch("cpf").length !== 14) return false;
        if (form.watch("telefone").length < 14) return false;
        if (form.watch("carteira_numero").length < 7) return false;
        if (form.watch("senha").length < 6) return false;
        if (!form.watch("email").includes("@")) return false;
        return true;
    }

    function validaStep3(): boolean {
        if (
            !form.watch("cep") || 
            !form.watch("logradouro") ||
            !form.watch("uf") || 
            !form.watch("cidade")
        ) return false;
        if (form.watch("cep").length !== 9) return false;
        if (form.watch("uf").length !== 2) return false;
        if (form.watch("cidade").length < 3) return false;
        if (form.watch("logradouro").length < 3) return false;
        return true;
    }

    function validaStepParticipantes(): boolean {
        if (participantesExistentes.length === 0) return false;
        return true;
    }

    function desabilitarProximo(): boolean {
        if (step === 1 && !validaStep1()) return true;
        if (step === 2 && !validaStep2()) return true;
        if (step === 3 && !validaStep3()) return true;
        if (form.watch("equipe")){
            if (step === 4 && !validaStepParticipantes()) return true;
        }
        return false;
    }

    function limparCampos() {
        form.setValue("uf", "");
        form.setValue("cidade", "");
        form.setValue("logradouro", "");
        form.setValue("numero", "");
        form.setValue("complemento", "");
    }

    function Finalizado() {
        const formData = form.getValues();
        
        return (
            <Card className="shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl">Resumo dos Dados</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                        Revise todas as informações preenchidas antes de enviar seu pré-cadastro.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Seção Responsável */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <User className="h-4 w-4 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-primary">Responsável pelo Projeto</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Nome Completo</span>
                                <p className="text-base font-medium">{formData.nome || "Não informado"}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Telefone</span>
                                <p className="text-base font-medium">{formData.telefone || "Não informado"}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">CPF</span>
                                <p className="text-base font-medium">{formData.cpf || "Não informado"}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">E-mail</span>
                                <p className="text-base font-medium">{formData.email || "Não informado"}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">CNPJ</span>
                                <p className="text-base font-medium">{formData.cnpj || "Não informado"}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Carteira Profissional</span>
                                <p className="text-base font-medium">
                                    {formData.carteira_tipo && formData.carteira_numero 
                                        ? `${formData.carteira_tipo} - ${formData.carteira_numero}`
                                        : "Não informado"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Seção Endereço */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-primary">Endereço</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                            <div>
                                <span className="text-sm font-medium text-gray-600">CEP</span>
                                <p className="text-base font-medium">{formData.cep || "Não informado"}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">UF</span>
                                <p className="text-base font-medium">{formData.uf || "Não informado"}</p>
                            </div>
                            <div className="md:col-span-2">
                                <span className="text-sm font-medium text-gray-600">Logradouro</span>
                                <p className="text-base font-medium">{formData.logradouro || "Não informado"}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Número</span>
                                <p className="text-base font-medium">{formData.numero || "Não informado"}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Cidade</span>
                                <p className="text-base font-medium">{formData.cidade || "Não informado"}</p>
                            </div>
                            {formData.complemento && (
                                <div className="md:col-span-2">
                                    <span className="text-sm font-medium text-gray-600">Complemento</span>
                                    <p className="text-base font-medium">{formData.complemento}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seção Equipe */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-primary">Tipo de Inscrição</h3>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Modalidade</span>
                            <p className="text-base font-medium">
                                {formData.equipe ? "Inscrição em Equipe" : "Inscrição Individual"}
                            </p>
                        </div>
                    </div>

                    {/* Seção Participantes - só exibe se for equipe */}
                    {formData.equipe && participantesExistentes.length > 0 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                    <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-semibold text-primary">Participantes da Equipe</h3>
                            </div>
                            <div className="space-y-3">
                                {participantesExistentes.map((participante, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <User className="h-5 w-5 text-gray-500" />
                                        <div>
                                            <p className="font-medium">{participante.nome}</p>
                                            <p className="text-sm text-gray-600">CPF: {participante.documento}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Seção Termos e Condições */}
                    <div className="space-y-4 border-t pt-6">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                                <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-primary">Confirmação e Termos</h3>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <FormField
                                control={form.control}
                                name="termos"
                                render={({ field }) => (
                                    <FormItem className="flex items-start gap-3">
                                        <FormControl>
                                            <Switch
                                                className="cursor-pointer mt-1"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                name={field.name}
                                                ref={field.ref}
                                                disabled={field.disabled}
                                            />
                                        </FormControl>
                                        <div className="space-y-2">
                                            <FormLabel className="cursor-pointer text-sm font-medium leading-relaxed">
                                                Declaro que as informações aqui prestadas são verdadeiras e estou ciente de que:
                                            </FormLabel>
                                            <ul className="text-xs text-gray-600 space-y-1 ml-0">
                                                <li>• A falsidade das informações prestadas implica nas sanções previstas em lei;</li>
                                                <li>• Este é um período de pré-inscrição e os dados poderão ser editados posteriormente;</li>
                                                <li>• Aceito os termos e condições do concurso conforme edital publicado;</li>
                                                <li>• As informações serão utilizadas exclusivamente para fins do concurso.</li>
                                            </ul>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    function Submit() {
      return (
        <Button
          disabled={!form.watch("termos")}
          variant={form.watch("termos") ? "default" : "outline"}
          type="submit"
        >
          {form.watch("termos")
            ? transition ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"
            : "Você deve aceitar os termos"
          }
        </Button>
      );
    }

    return <div className="container mx-auto h-full flex justify-center">
        <div className="max-w-3xl w-full mx-auto">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Stepper
                    initialStep={1}
                    onStepChange={setStep}
                    backButtonText="Voltar"
                    nextButtonText="Próximo"
                    completeButtonText="Finalizar"
                    disableStepIndicators={true}
                    stepCircleContainerClassName="w-full bg-white"
                    contentClassName="my-6 px-0"
                    final={<Finalizado />}
                    submitButton={<Submit />}
                    disableNextButton={desabilitarProximo()}
                >
                    <Step>
                        <Card className="shadow-none border-none">
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Inscrição</CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                (item 12 do Edital nº 001/SP-URB/2025)
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <span className="font-semibold">
                                        Etapa de Pré-inscrição (item 12.3.1 do Edital) 
                                    </span>
                                    <span className="font-bold text-red-500">
                                        O interessado deverá atentar para o item 9.2 do Edital (Documentos necessários para inscrição). 
                                    </span>
                                    <div className="gap-1 flex items-center space-x-2">
                                        <FormField
                                            control={form.control}
                                            name="instrucoes"
                                            render={({ field }) => (
                                                <FormItem className="flex items-center gap-2 justify-center">
                                                    <FormControl>
                                                        <Switch
                                                            className="cursor-pointer"
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            name={field.name}
                                                            ref={field.ref}
                                                            disabled={field.disabled}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="cursor-pointer h-full flex items-center">
                                                        Atesto ciência e concordância com os requisitos do Edital.
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Step>
                    <Step>
                        <Card className="shadow-none border-none">
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Responsável</CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    Confira os dados do responsável do seu cadastro.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                                    <FormField control={form.control} name="nome" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-3">
                                            <FormLabel className="text-sm sm:text-base">Nome Completo</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    placeholder="Digite o nome completo"
                                                    className="h-10 sm:h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="telefone" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-1">
                                            <FormLabel className="text-sm sm:text-base">Telefone</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    placeholder="(11) 99999-9999"
                                                    className="h-10 sm:h-11"
                                                    onChange={(e) => field.onChange(formatarTelefone(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="cpf" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-2">
                                            <FormLabel className="text-sm sm:text-base">CPF</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    placeholder="000.000.000-00"
                                                    className="h-10 sm:h-11"
                                                    onChange={(e) => field.onChange(formatarCPF(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="cnpj" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-2">
                                            <FormLabel className="text-sm sm:text-base">CNPJ</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    placeholder="00.000.000/0000-00"
                                                    className="h-10 sm:h-11"
                                                    onChange={(e) => field.onChange(formatarCNPJ(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="carteira_tipo" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-1">
                                            <FormLabel className="text-sm sm:text-base">CAU/CREA</FormLabel>
                                            <FormControl>
                                                <Select
                                                    {...field}
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full !h-10 sm:!h-11">
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
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="carteira_numero" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-3">
                                            <FormLabel className="text-sm sm:text-base">Número de identificação</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="0000000000"
                                                    className="h-10 sm:h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="email" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-2">
                                            <FormLabel className="text-sm sm:text-base">E-mail</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    type="email"
                                                    placeholder="seuemail@exemplo.com"
                                                    className="h-10 sm:h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="confirmar_email" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-2">
                                            <FormLabel className="text-sm sm:text-base">Confirmar E-mail</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field}
                                                    type="email"
                                                    placeholder="seuemail@exemplo.com"
                                                    className="h-10 sm:h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    {form.watch("confirmar_email") !== form.watch("email") && (
                                      <div className="col-span-4 mt-[-24px]">
                                        <span className="text-sm font-medium text-destructive">
                                          Emails não coincidem
                                        </span>
                                      </div>
                                    )}
                                    <FormField control={form.control} name="senha" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-2">
                                            <FormLabel className="text-sm sm:text-base">Senha</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="password" placeholder="********" className="h-10 sm:h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="confirmar_senha" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-2">
                                            <FormLabel className="text-sm sm:text-base">Confirmar Senha</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="password" placeholder="********" className="h-10 sm:h-11" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    {form.watch("confirmar_senha") !== form.watch("senha") && (
                                      <div className="col-span-4 mt-[-24px]">
                                        <span className="text-sm font-medium text-destructive">
                                          Senhas não coincidem
                                        </span>
                                      </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </Step>
                    <Step>
                        <Card className="w-full max-w-4xl mx-auto shadow-none border-none">
                            <CardHeader className="px-4 sm:px-6">
                                <CardTitle className="text-lg sm:text-xl">Endereço</CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    Preencha os campos abaixo com o endereço do seu cadastro.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
                                    <FormField control={form.control} name="cep" render={({ field }) => (
                                        <FormItem className="col-span-4">
                                            <FormLabel className="text-sm sm:text-base">CEP</FormLabel>
                                            <FormControl>
                                                <Input 
                                                    {...field} 
                                                    placeholder="00000-000" 
                                                    className="h-10 sm:h-11"
                                                    onChange={async (e) => {
                                                        const cep = formatarCEP(e.target.value)
                                                        field.onChange(cep)
                                                        limparCampos()
                                                        await buscaCEP(cep)
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="logradouro" render={({ field }) => (
                                        <FormItem className="col-span-4">
                                            <FormLabel className="text-sm sm:text-base">Logradouro</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Digite o logradouro"
                                                    className="h-10 sm:h-11 disabled:opacity-100"
                                                    disabled
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="numero" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-1">
                                            <FormLabel className="text-sm sm:text-base">Número</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Digite o número"
                                                    className="h-10 sm:h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="complemento" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-3">
                                            <FormLabel className="text-sm sm:text-base">Complemento</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Digite o complemento"
                                                    className="h-10 sm:h-11"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="uf" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-1">
                                            <FormLabel className="text-sm sm:text-base">UF</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Digite a UF"
                                                    className="h-10 sm:h-11 disabled:opacity-100"
                                                    disabled
                                                    value={field.value.toUpperCase()}
                                                    onChange={(e) => {
                                                        field.onChange(e.target.value.toUpperCase())
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="cidade" render={({ field }) => (
                                        <FormItem className="col-span-4 md:col-span-3">
                                            <FormLabel className="text-sm sm:text-base">Cidade</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    placeholder="Digite a cidade"
                                                    className="h-10 sm:h-11 disabled:opacity-100"
                                                    disabled
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField control={form.control} name="equipe" render={({ field }) => (
                                        <FormItem className="col-span-4">
                                            <FormLabel className="text-sm sm:text-base">Essa inscrição é para uma equipe?</FormLabel>
                                            <div className="flex items-center gap-2">
                                                <FormControl>
                                                    <Switch
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                        className="cursor-pointer"
                                                    />
                                                </FormControl>
                                                <FormLabel className="cursor-pointer text-sm sm:text-base !font-medium">{field.value ? "Sim" : "Não"}</FormLabel>
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />   
                                </div>
                            </CardContent>
                        </Card>
                    </Step>
                    {form.watch("equipe") && (
                        <Step>
                        <Card className="w-full max-w-4xl mx-auto shadow-none border-none">
                            <CardHeader className="px-4 sm:px-6">
                                <CardTitle className="text-lg sm:text-xl">Participantes</CardTitle>
                                <CardDescription className="text-sm sm:text-base">
                                    Gerencie os participantes do seu cadastro. Você pode adicionar novos participantes ou remover os existentes.
                                </CardDescription>
                            </CardHeader>                            
                            <CardContent className="px-4 sm:px-6 space-y-6">
                                {/* Lista de Participantes Existentes */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium">Participantes Cadastrados</h3>
                                        <Button
                                            onClick={() => setMostrarFormulario(!mostrarFormulario)}
                                            variant="outline"
                                            type="button"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Adicionar Participante
                                        </Button>
                                    </div>
                                    {participantesExistentes.length > 0 ? (
                                        <div className="space-y-3">
                                            {participantesExistentes.map((participante, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                                                    <div className="flex items-center gap-3">
                                                        <User className="h-5 w-5 text-gray-500" />
                                                        <div>
                                                            <p className="font-medium">{participante.nome}</p>
                                                            <p className="text-sm text-gray-600">CPF: {participante.documento}</p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        onClick={() => removerParticipante(participante.documento)}
                                                        variant="destructive"
                                                        size="sm"
                                                        className="flex items-center gap-2 hover:opacity-60 transition-opacity cursor-pointer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Remover
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                            <p>Nenhum participante cadastrado</p>
                                            <p className="text-sm">{`Clique em "Adicionar Participante" para começar`}</p>
                                        </div>
                                    )}
                                </div>
                                {mostrarFormulario && (
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-medium mb-4">Adicionar Novo Participante</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormItem>
                                                    <FormLabel>Nome Completo</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Nome completo do participante"
                                                            className="h-10"
                                                            value={participanteNome}
                                                            onChange={(e) => setParticipanteNome(e.target.value)}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                                <FormItem>
                                                    <FormLabel>CPF</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="000.000.000-00"
                                                            className="h-10"
                                                            value={participanteDocumento}
                                                            onChange={(e) => setParticipanteDocumento(formatarCPF(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            </div>
                                            
                                            <div className="flex gap-3 pt-4">
                                                <Button
                                                    type="button"
                                                    className="flex items-center gap-2"
                                                    onClick={() => {
                                                        setParticipantesExistentes([...participantesExistentes, { nome: participanteNome, documento: participanteDocumento }])
                                                        setParticipanteNome("")
                                                        setParticipanteDocumento("")
                                                        setMostrarFormulario(false)
                                                    }}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Adicionar Participante
                                                </Button>
                                                
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setMostrarFormulario(false)
                                                    }}
                                                >
                                                    Cancelar
                                                </Button>
                                            </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </Step>)}
                </Stepper>
            </form>
        </Form>
        </div>
    </div>
}