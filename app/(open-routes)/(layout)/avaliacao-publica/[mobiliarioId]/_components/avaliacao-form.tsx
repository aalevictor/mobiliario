"use client"

import { useState } from "react"
import { z } from "zod"
import { Perfil_Avaliador, Tipo_Mobiliario } from "@prisma/client"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

const schema = z.object({
  perfil: z.enum(["MORADOR", "FREQUENTE", "VISITANTE", "OUTRO"]).optional(),
  perfilOutro: z.string().optional(),
  identidade: z.string().default("3"),
  frequencia: z.string().default("3"),
  ergonomia: z.string().default("3"),
  resistenciaClima: z.string().default("3"),
  resistenciaUso: z.string().default("3"),
  materiais: z.string().default("3"),
  operacao: z.string().default("3"),
  aprovacao: z.string().default("3"),
  comentario: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function AvaliacaoForm({
  mobiliarioId,
  protocolo,
  tipo,
}: {
  mobiliarioId: string
  protocolo: string
  tipo: Tipo_Mobiliario
}) {
  const [submitting, setSubmitting] = useState(false)
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      identidade: "3",
      frequencia: "3",
      ergonomia: "3",
      resistenciaClima: "3",
      resistenciaUso: "3",
      materiais: "3",
      operacao: "3",
      aprovacao: "3",
    },
  })

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    try {
      const payload = {
        perfil: (values.perfil ?? "OUTRO") as Perfil_Avaliador,
        perfilOutro: values.perfil === "OUTRO" ? values.perfilOutro || undefined : undefined,
        identidade: Number(values.identidade),
        frequencia: Number(values.frequencia),
        ergonomia: Number(values.ergonomia),
        resistenciaClima: Number(values.resistenciaClima),
        resistenciaUso: Number(values.resistenciaUso),
        materiais: Number(values.materiais),
        operacao: Number(values.operacao),
        aprovacao: Number(values.aprovacao),
        comentario: values.comentario || undefined,
      }

      const res = await fetch(`/api/avaliacao-publica/${mobiliarioId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.error || "Falha ao enviar avaliação")
      }

      toast.success("Avaliação enviada com sucesso!")
      form.reset({
        identidade: "3",
        frequencia: "3",
        ergonomia: "3",
        resistenciaClima: "3",
        resistenciaUso: "3",
        materiais: "3",
        operacao: "3",
        aprovacao: "3",
      })
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  function RatingField({
    name,
    label,
    description,
  }: {
    name:
      | "identidade"
      | "frequencia"
      | "ergonomia"
      | "resistenciaClima"
      | "resistenciaUso"
      | "materiais"
      | "operacao"
      | "aprovacao"
    label: string
    description: string
  }) {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base">{label}</FormLabel>
            <p className="text-sm text-muted-foreground mb-2 break-words">{description}</p>
            <FormControl>
              <ToggleGroup
                type="single"
                variant="outline"
                size="lg"
                value={field.value}
                onValueChange={(v) => field.onChange(v || "3")}
                className="w-full justify-between gap-2"
              >
                {["1", "2", "3", "4", "5"].map((v) => (
                  <ToggleGroupItem
                    key={v}
                    value={v}
                    aria-label={`Nota ${v}`}
                    className="bg-white text-base data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:border-primary"
                  >
                    {v}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid gap-4">
          <FormField
            control={form.control}
            name="perfil"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Perfil do Avaliador (opcional)</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger
                      className="bg-white text-base w-full min-w-0 whitespace-normal"
                      style={{ width: "100%" }}
                    >
                      <SelectValue placeholder="Selecione um perfil (ou deixe em branco)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-w-[calc(100vw-2rem)] sm:max-w-[360px]">
                    <SelectItem value="MORADOR">Morador da região</SelectItem>
                    <SelectItem value="FREQUENTE">Usuário frequente do espaço público</SelectItem>
                    <SelectItem value="VISITANTE">Visitante eventual</SelectItem>
                    <SelectItem value="OUTRO">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("perfil") === "OUTRO" && (
            <FormField
              control={form.control}
              name="perfilOutro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descreva seu perfil</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ex.: estudante, turista, etc." className="bg-white text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RatingField
            name="identidade"
            label="Identidade com a cidade"
            description="O mobiliário reflete a diversidade e a identidade de São Paulo?"
          />
          <RatingField
            name="frequencia"
            label="Frequência e forma de uso"
            description="Parece útil e aplicável ao dia a dia dos usuários do espaço público?"
          />
          <RatingField
            name="ergonomia"
            label="Ergonomia e conforto"
            description="É confortável e acessível para diferentes pessoas (crianças, idosos, PCD, etc.)?"
          />
          <RatingField
            name="resistenciaClima"
            label="Resistência ao clima"
            description="O mobiliário aparenta suportar sol, chuva e outras condições climáticas?"
          />
          <RatingField
            name="resistenciaUso"
            label="Resistência ao mau uso ou vandalismo"
            description="Parece robusto e seguro para resistir a danos ou usos indevidos?"
          />
          <RatingField
            name="materiais"
            label="Materiais e instalação"
            description="Os materiais parecem adequados, bem acabados e corretamente instalados?"
          />
          <RatingField
            name="operacao"
            label="Operação e manutenção"
            description="Parece fácil de limpar, manter ou operar (ex.: troca de sacos das papeleiras ou irrigação das floreiras)?"
          />
          <RatingField
            name="aprovacao"
            label="Aprovação geral"
            description="Você gostaria de ver este mobiliário instalado em outros lugares da cidade?"
          />
        </div>

        <FormField
          control={form.control}
          name="comentario"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Comentários adicionais</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Espaço para sugestões, opiniões ou críticas"
                  className="min-h-28 bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 backdrop-blur-md p-3 sm:p-4 sm:hidden">
          <div className="container mx-auto max-w-4xl px-4 sm:px-6">
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Enviando..." : "Enviar avaliação"}
            </Button>
          </div>
        </div>
        <div className="hidden sm:flex justify-end">
          <Button type="submit" disabled={submitting}>
            {submitting ? "Enviando..." : "Enviar avaliação"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
