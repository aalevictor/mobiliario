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
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4 gap-4">
                <Link href={"#cronograma"}>
                    <span className="bg-[#7874C1] px-4 py-1 text-sm font-semibold hover:bg-[#7874C1] rounded-lg">
                        Confira o cronograma
                    </span>
                </Link>
                <h1 className="text-[#3B2D3A] intersect:motion-preset-slide-up motion-delay-150 text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl font-bold max-w-4xl">
                    Concurso Mobiliário Urbano
                </h1>
                <p className=" intersect:motion-preset-slide-up motion-delay-200 text-lg md:text-xl max-w-2xl text-[#3B2D3A]">
                    Participe com seu projeto e construa o amanhã
                </p>
                <Link
                    href={"/inscricao"}
                    className=" intersect:motion-preset-slide-up motion-delay-400"
                >
                    <Button
                        size="lg"
                        className="px-4 py-1 text-lg font-semibold cursor-pointer"
                    >
                        Inscreva-se agora
                    </Button>
                </Link>
            </div>
        </div>
  );
}