"use client"

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  const slides = [
    { src: "/hero/pc/hero-u.png", alt: "Banner do concurso - Mobiliário urbano sustentável" },
    { src: "/hero/pc/hero-b.png", alt: "Banner do concurso - Design inovador para espaços públicos" },
    { src: "/hero/pc/hero-n.png", alt: "Banner do concurso - Concurso nacional de projetos" }
  ];

  return (
        <section className="relative h-full w-full items-center justify-center" role="banner" aria-label="Banner principal do concurso">
            <Carousel
                opts={{ loop: true }}
                plugins={[
                    Autoplay({
                        delay: 3000,
                    }),
                    Fade()
                ]}
                className="w-full max-w-[1280px] max-h-[458px] hidden lg:block mx-auto bg-transparent"
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <Image
                                width={2560}
                                height={916}
                                src={slide.src}
                                alt={slide.alt}
                                priority
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <Carousel
                opts={{ loop: true }}
                plugins={[
                    Autoplay({
                        delay: 3000,
                    }),
                    Fade()
                ]}
                className="w-full max-w-[1366px] max-h-[1090px] hidden sm:block lg:hidden mx-auto"
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <Image
                                width={1366}
                                height={1090}
                                src={slide.src.replace('/pc/', '/tablet/')}
                                alt={slide.alt}
                                priority
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <Carousel
                opts={{ loop: true }}
                plugins={[
                    Autoplay({
                        delay: 3000,
                    }),
                    Fade()
                ]}
                className="w-full max-w-[751px] max-h-[1169px] block sm:hidden mx-auto"
            >
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={index}>
                            <Image
                                width={751}
                                height={1169}
                                src={slide.src.replace('/pc/', '/mobile/')}
                                alt={slide.alt}
                                priority
                            />
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4 gap-4 mt-10">
                <Link href={"#cronograma"} aria-label="Ver cronograma completo do concurso">
                    <span className="bg-[#7874C1] px-4 py-1 text-sm font-semibold hover:bg-[#7874C1] rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent">
                        Confira o cronograma
                    </span>
                </Link>
                <h1 className="text-[#3B2D3A] text-3xl lg:text-4xl font-bold max-w-4xl">
                    Concurso Nacional de Projetos de Mobiliário Urbano para São Paulo
                </h1>
                <p className="text-lg text-[#3B2D3A]">
                    Participe com seu projeto e construa o amanhã
                </p>
                <Link
                    href={"/inscricao"}
                    aria-label="Ir para página de inscrição no concurso"
                >
                    <Button
                        size="lg"
                        className="px-4 py-1 text-lg font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                    >
                        Faça já sua pré-inscrição
                    </Button>
                </Link>
            </div>
        </section>
  );
}