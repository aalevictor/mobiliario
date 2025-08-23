"use client"

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Mail,
  MapPin,
  Globe,
} from "lucide-react";
import Image from "next/image";

interface EmailPreviewProps {
  templateType: string;
  data: {
    nome: string;
    email?: string;
    pergunta?: string;
    evento?: string;
    data?: string;
    titulo?: string;
    mensagem?: string;
  };
}

export default function EmailPreviewRenderer({ templateType, data }: EmailPreviewProps) {
  const styles = {
    corPrimaria: '#A5942B',
    corSecundaria: '#F3F9E7',
    corFundo: '#f9fafb',
    corTexto: '#3B2D3A',
    corTextoSecundario: '#6b7280',
    corDestaque: '#7874C1'
  };

  const renderBannerHero = (titulo: string, subtitulo?: string, badge?: string) => (
    <div 
      className="relative bg-gradient-to-br from-gray-800 to-gray-600 text-white text-center py-16 px-8 rounded-t-lg overflow-hidden"
      style={{
        backgroundImage: `url('/hero/pc/hero-b.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10">
        {badge && (
          <Badge 
            className="mb-5 px-4 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700"
            variant="secondary"
          >
            {badge}
          </Badge>
        )}
        
        <h2 className="text-4xl font-bold mb-4 text-shadow-lg">
          {titulo}
        </h2>
        
        {subtitulo && (
          <p className="text-xl max-w-md mx-auto text-shadow-md">
            {subtitulo}
          </p>
        )}
      </div>
    </div>
  );

  const renderContent = (nome: string, conteudo: string) => (
    <div className="p-10">
      <h3 className="text-2xl font-bold mb-5 text-gray-800">
        Prezado(a) {nome},
      </h3>
      
      <div 
        className="text-gray-600 text-base leading-relaxed"
        dangerouslySetInnerHTML={{ __html: conteudo }}
      />
    </div>
  );

  const renderCards = (cards: Array<{icone?: string; titulo: string; descricao: string}>) => (
    <div className="px-10 pb-10">
      <div className="space-y-5">
        {cards.map((card, index) => {
          const iconColors = [
            styles.corPrimaria,
            styles.corDestaque,
            styles.corSecundaria,
            styles.corTexto
          ];
          const cardColor = iconColors[index % iconColors.length];
          
          return (
            <Card key={index} className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-5">
                  <div 
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg"
                    style={{ backgroundColor: cardColor }}
                  >
                    {card.icone || '📋'}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">
                      {card.titulo}
                    </h4>
                    <p className="text-gray-600 leading-relaxed">
                      {card.descricao}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderCallToAction = (titulo: string, descricao: string, botaoTexto: string, botaoUrl: string) => (
    <div className="px-10 pb-10">
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-8 text-center">
          <h4 className="text-xl font-semibold text-gray-800 mb-3">
            {titulo}
          </h4>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {descricao}
          </p>
          
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium"
            asChild
          >
            <a href={botaoUrl} target="_blank" rel="noopener noreferrer">
              {botaoTexto}
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderFooter = () => (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 border-t-4 border-yellow-500 rounded-b-lg">
      <div className="text-center">
        {/* Logos */}
        <div className="flex justify-center items-center gap-16 mb-8">
          <div className="text-center">
            <Image 
              src="/logos/smul_branco.png" 
              alt="Prefeitura de São Paulo" 
              className="max-w-[200px]"
              width={200}
              height={200}
            />
          </div>
          
          <div className="text-center">
            <Image 
              src="/logos/spurbanismo_branco.png" 
              alt="SPUrbanismo" 
              className="max-w-[200px]"
              width={200}
              height={200}
            />
          </div>
        </div>
        
        {/* Informações de contato */}
        <Card className="max-w-md mx-auto mb-6 bg-white border-l-4 border-yellow-500">
          <CardContent className="p-5">
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  <strong>Endereço:</strong> Rua São Bento, 405 - Centro
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  <strong>CEP:</strong> 01011-100 | São Paulo | SP
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  <strong>Portal:</strong>{' '}
                  <a 
                    href="https://concursomoburb.prefeitura.sp.gov.br" 
                    className="text-purple-600 font-semibold hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    concursomoburb.prefeitura.sp.gov.br
                  </a>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <p className="text-xs text-gray-500 opacity-80">
          Este é um email automático do sistema do Concurso Mobiliário Urbano 2025.
        </p>
      </div>
    </div>
  );

  const renderTemplate = () => {
    switch (templateType) {
      case 'confirmacao':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
            {renderBannerHero('Inscrição Confirmada!', 'Sua participação no concurso foi registrada com sucesso', 'Concurso Mobiliário Urbano')}
            {renderContent(data.nome, `
              <p>Sua inscrição no <strong>Concurso Mobiliário Urbano</strong> foi realizada com sucesso!</p>
              <p>Em breve, entraremos em contato com as próximas etapas do processo. Fique atento ao seu e-mail para acompanhar todas as atualizações.</p>
              <p>Agradecemos sua participação e desejamos boa sorte!</p>
            `)}
            {renderCards([
              {
                icone: '📋',
                titulo: 'Documentação',
                descricao: 'Mantenha seus documentos sempre atualizados para agilizar o processo.'
              },
              {
                icone: '📅',
                titulo: 'Cronograma',
                descricao: 'Acompanhe o cronograma do concurso em nosso portal oficial.'
              }
            ])}
            {renderCallToAction(
              'Precisa de mais informações?',
              'Visite nosso portal oficial ou entre em contato conosco',
              'Acessar Minha Área',
              'https://concursomoburb.prefeitura.sp.gov.br/auth/login'
            )}
            {renderFooter()}
          </div>
        );

      case 'boas-vindas':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
            {renderBannerHero('Bem-vindo ao Concurso!', 'Estamos felizes em tê-lo conosco', 'Concurso Mobiliário Urbano')}
            {renderContent(data.nome, `
              <p>Seja bem-vindo ao <strong>Concurso Mobiliário Urbano</strong> da Prefeitura de São Paulo!</p>
              <p>Aqui você encontrará todas as informações necessárias para participar e acompanhar o andamento do concurso.</p>
              <p>Desejamos sucesso em sua jornada!</p>
            `)}
            {renderCards([
              {
                icone: '🚀',
                titulo: 'Primeiros Passos',
                descricao: 'Acesse nosso portal e complete seu cadastro para começar.'
              },
              {
                icone: '💬',
                titulo: 'Suporte',
                descricao: 'Nossa equipe está pronta para ajudar com qualquer dúvida.'
              }
            ])}
            {renderCallToAction(
              'Precisa de mais informações?',
              'Visite nosso portal oficial ou entre em contato conosco',
              'Acessar Portal',
              'https://concursomoburb.prefeitura.sp.gov.br'
            )}
            {renderFooter()}
          </div>
        );

      case 'lembrete':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
            {renderBannerHero('Lembrete Importante', `Não esqueça: ${data.evento}`, 'Concurso Mobiliário Urbano')}
            {renderContent(data.nome, `
              <p>Este é um lembrete sobre <strong>${data.evento}</strong> marcado para <strong>${data.data}</strong>.</p>
              <p>Certifique-se de estar preparado e não perca essa oportunidade!</p>
            `)}
            {renderCards([
              {
                icone: '⏰',
                titulo: 'Prazo',
                descricao: `Evento marcado para: ${data.data}`
              },
              {
                icone: '📝',
                titulo: 'Preparação',
                descricao: 'Verifique se todos os documentos e materiais estão prontos.'
              }
            ])}
            {renderCallToAction(
              'Precisa de mais informações?',
              'Visite nosso portal oficial ou entre em contato conosco',
              'Ver Cronograma',
              'https://concursomoburb.prefeitura.sp.gov.br/#cronograma'
            )}
            {renderFooter()}
          </div>
        );

      case 'notificacao':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
            {renderBannerHero(data.titulo || 'Informação Importante', 'Informação importante sobre o concurso', 'Concurso Mobiliário Urbano')}
            {renderContent(data.nome, data.mensagem || '')}
            {renderCallToAction(
              'Precisa de mais informações?',
              'Visite nosso portal oficial ou entre em contato conosco',
              'Ver Detalhes',
              'https://concursomoburb.prefeitura.sp.gov.br'
            )}
            {renderFooter()}
          </div>
        );

      case 'nova-duvida':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
            {renderBannerHero('Nova Dúvida Recebida', 'Um participante enviou uma nova pergunta', 'Concurso Mobiliário Urbano')}
            {renderContent('Equipe Administrativa', `
              <p>Uma nova dúvida foi enviada através do portal do concurso:</p>
              
              <div class="bg-gray-50 border-2 border-yellow-500 rounded-xl p-6 my-6 shadow-sm">
                <h4 class="text-lg font-semibold text-center mb-4 text-gray-800">
                  📋 Detalhes da Dúvida
                </h4>
                
                <div class="mb-4 p-3 bg-white rounded-lg border-l-4 border-purple-500">
                  <strong class="text-gray-800 block mb-1">👤 Nome:</strong>
                  <span class="text-gray-600 text-base">${data.nome}</span>
                </div>
                
                <div class="mb-4 p-3 bg-white rounded-lg border-l-4 border-yellow-500">
                  <strong class="text-gray-800 block mb-1">📧 Email:</strong>
                  <span class="text-gray-600 text-base">${data.email}</span>
                </div>
                
                <div class="mb-4 p-3 bg-white rounded-lg border-l-4 border-green-500">
                  <strong class="text-gray-800 block mb-2">❓ Pergunta:</strong>
                  <div class="text-gray-600 text-sm leading-relaxed p-2 bg-gray-50 rounded-md">
                    ${data.pergunta}
                  </div>
                </div>
                
                <div class="text-center p-3 bg-green-100 rounded-lg mt-4">
                  <span class="text-xs text-gray-700 font-semibold">
                    🕐 <strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR', { 
                      timeZone: 'America/Sao_Paulo',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
              
              <p class="text-center text-base text-gray-800 font-medium">
                Esta dúvida foi automaticamente registrada no sistema e está aguardando resposta da equipe administrativa.
              </p>
            `)}
            {renderCards([
              {
                icone: '⚡',
                titulo: 'Ação Necessária',
                descricao: 'Acesse o painel administrativo para responder esta dúvida o mais breve possível.'
              },
              {
                icone: '📚',
                titulo: 'Histórico',
                descricao: 'Todas as dúvidas e respostas ficam registradas no sistema para consulta futura.'
              },
              {
                icone: '🔔',
                titulo: 'Notificação',
                descricao: 'O participante será notificado automaticamente quando a dúvida for respondida.'
              }
            ])}
            {renderCallToAction(
              'Precisa de mais informações?',
              'Visite nosso portal oficial ou entre em contato conosco',
              'Responder Dúvida',
              'https://concursomoburb.prefeitura.sp.gov.br/duvidas'
            )}
            {renderFooter()}
          </div>
        );

      case 'personalizado':
        return (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-2xl mx-auto">
            {renderBannerHero('Atualização Importante', 'Novas diretrizes publicadas', 'Concurso Mobiliário Urbano')}
            {renderContent(data.nome, `
              <p>Prezados participantes,</p>
              <p>Informamos que foram publicadas novas diretrizes para o Concurso Mobiliário Urbano 2025.</p>
              <p>As principais mudanças incluem:</p>
              <ul class="my-5 pl-5 space-y-2">
                <li>Prorrogação do prazo de inscrição</li>
                <li>Novos critérios de avaliação</li>
                <li>Atualização do cronograma</li>
              </ul>
            `)}
            {renderCards([
              {
                icone: '📅',
                titulo: 'Prazo Estendido',
                descricao: 'Inscrições prorrogadas até 30 de abril de 2025'
              },
              {
                icone: '📋',
                titulo: 'Documentação',
                descricao: 'Verifique se seus documentos estão atualizados'
              },
              {
                icone: '💬',
                titulo: 'Suporte',
                descricao: 'Entre em contato em caso de dúvidas'
              }
            ])}
            {renderCallToAction(
              'Precisa de mais informações?',
              'Visite nosso portal oficial ou entre em contato conosco',
              'Ver Novas Diretrizes',
              'https://exemplo.com/diretrizes'
            )}
            {renderFooter()}
          </div>
        );

      default:
        return (
          <div className="text-center py-20 text-gray-500">
            <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Selecione um template para visualizar o preview</p>
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {renderTemplate()}
    </div>
  );
}
