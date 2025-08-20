import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mobiliariourbano.prefeitura.sp.gov.br';
    const heroImageUrl = `${baseUrl}/hero/pc/hero-b.png`;
    
    // Verificar se a variável de ambiente está configurada
    const envVar = process.env.NEXT_PUBLIC_APP_URL;
    
    // Testar se a URL da imagem é acessível
    let imageAccessible = false;
    let imageResponse = null;
    
    try {
      const response = await fetch(heroImageUrl, { method: 'HEAD' });
      imageAccessible = response.ok;
      imageResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      console.error("❌ Erro ao acessar imagem:", error);
    }
    
    return NextResponse.json({
      success: true,
      debug: {
        baseUrl,
        heroImageUrl,
        envVar,
        imageAccessible,
        imageResponse,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error("❌ Erro ao testar imagem:", error);
    
    return NextResponse.json(
      { 
        error: "Erro interno do servidor ao testar imagem",
        details: error instanceof Error ? error.message : "Erro desconhecido"
      },
      { status: 500 }
    );
  }
}
