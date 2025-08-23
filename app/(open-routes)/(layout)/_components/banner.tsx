"use client"

import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import Image from "next/image";
import Link from "next/link";

export default function Banner() {
  return (
        <div className="relative h-full w-full items-center justify-center">
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
                    <CarouselItem key={0}>
                        <Image
                            width={2560}
                            height={916}
                            src="/hero/pc/hero-u.png"
                            alt="Imagem do evento"
                            priority
                        />
                    </CarouselItem>
                    <CarouselItem key={1}>
                        <Image
                            width={2560}
                            height={916}
                            src="/hero/pc/hero-b.png"
                            alt="Imagem do evento"
                            priority
                        />
                    </CarouselItem>
                    <CarouselItem key={2}>
                        <Image
                            width={2560}
                            height={916}
                            src="/hero/pc/hero-n.png"
                            alt="Imagem do evento"
                            priority
                        />
                    </CarouselItem>
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
                    <CarouselItem key={0}>
                        <Image
                            width={1366}
                            height={1090}
                            src="/hero/tablet/hero-u.png"
                            alt="Imagem do evento"
                            priority
                        />
                    </CarouselItem>
                    <CarouselItem key={1}>
                        <Image
                            width={1366}
                            height={1090}
                            src="/hero/tablet/hero-b.png"
                            alt="Imagem do evento"
                            priority
                        />
                    </CarouselItem>
                    <CarouselItem key={2}>
                        <Image
                            width={1366}
                            height={1090}
                            src="/hero/tablet/hero-n.png"
                            alt="Imagem do evento"
                            priority
                        />
                    </CarouselItem>
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
                    <CarouselItem key={0}>
                        <Image
                            width={751}
                            height={1169}
                            src="/hero/mobile/hero-u.png"
                            alt="Imagem do evento U"
                            priority
                        />
                    </CarouselItem>
                    <CarouselItem key={1}>
                        <Image
                            width={751}
                            height={1169}
                            src="/hero/mobile/hero-b.png"
                            alt="Imagem do evento B"
                            priority
                        />
                    </CarouselItem>
                    <CarouselItem key={2}>
                        <Image
                            width={751}
                            height={1169}
                            src="/hero/mobile/hero-n.png"
                            alt="Imagem do evento N"
                            priority
                        />
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4 gap-4 mt-10">
                <Link href={"#cronograma"}>
                    <span className="bg-[#7874C1] px-4 py-1 text-sm hover:opacity-80 font-semibold cursor-pointer rounded-lg">
                        Confira o cronograma
                    </span>
                </Link>
                <span className="text-[#3B2D3A] text-3xl lg:text-4xl font-bold max-w-4xl">
                    Concurso Nacional de Projetos de Mobiliário Urbano para São Paulo
                </span>
                <span className="text-lg text-[#3B2D3A]">
                    Projetos sustentáveis que transformam a cidade
                </span>
                <Link
                    href={"/inscricao"}
                >
                    <Button
                        size="lg"
                        className="px-4 py-1 text-lg hover:opacity-80 font-semibold cursor-pointer"
                    >
                        Faça já sua pré-inscrição
                    </Button>
                </Link>
            </div>
        </div>
  );
}