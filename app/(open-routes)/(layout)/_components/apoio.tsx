import Image from "next/image";

export default function Apoio() {
    return (
        <section className="py-16 bg-[#F3F9E7]">
          <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between lg:justify-center gap-12 lg:px-10">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-xs justify-center border-b-1 border-black p-2">
                APOIO
              </div>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <Image
                  src="/apoio/causp.png"
                  alt="Logo CAU-SP"
                  width={147}
                  height={56}
                />
                <Image
                  src="/apoio/dwsp.png"
                  alt="Logo Design Week São Paulo"
                  width={145}
                  height={39}
                />
                <Image
                  src="/apoio/assocomersp.png"
                  alt="Logo Associação Comercial de São Paulo"
                  width={125}
                  height={53}
                />
                <Image
                  src="/apoio/asbea.png"
                  alt="Logo Associação Brasileira de Escritórios de Arquitetura"
                  width={58}
                  height={73}
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4 text-xs justify-center border-b-1 border-black p-2">
                PROMOÇÃO
              </div>
              <div className="flex items-center justify-center gap-8 flex-wrap">
                <Image
                  src="/promocao/spurbanismo.png"
                  alt="Logo SP Urbanismo"
                  width={141}
                  height={33}
                />
                <Image
                  src="/promocao/prefeitura.png"
                  alt="Logo Prefeitura de São Paulo"
                  width={113}
                  height={43}
                />
              </div>
            </div>
          </div>
        </section>
    )
}