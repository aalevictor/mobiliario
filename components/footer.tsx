/** @format */

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
	return (
    <footer
      id="contact"
      className="bg-[#A5942B] dark:bg-zinc-800 text-white py-8 mt-auto bottom-0"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 items-end gap-8">
          <div>
            <Image
              src={"/logo-header.png"}
              alt="Brasão da Prefeitura de São Paulo"
              width={140}
              height={60}
              quality={100}
              className="mb-3"
            />
            <p className="text-sm">
              Secretaria Municipal de Urbanismo e Licenciamento
              <br />
              Rua São Bento, 405 - Centro
              <br />
              São Paulo - SP, 01011-100
            </p>
          </div>
          <div>
            <Image
              src={"/promocao/spurbanismo.png"}
              alt="Brasão da Prefeitura de São Paulo"
              width={140}
              height={60}
              quality={100}
              className="mb-3"
            />
            <p className="text-sm mt-auto">
              São Paulo Urbanismo
              <br />
              Rua São Bento, 405 - Centro
              <br />
              São Paulo - SP, 01011-100
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Links Úteis</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="https://capital.sp.gov.br/"
                  target="_blank"
                  className="hover:underline"
                >
                  Portal da Prefeitura
                </Link>
              </li>
              <li>
                <Link
                  href="https://capital.sp.gov.br/web/licenciamento"
                  target="_blank"
                  className="hover:underline"
                >
                  Secretaria de Urbanismo e Licenciamento
                </Link>
              </li>
              <li>
                <Link
                  href="https://capital.sp.gov.br/web/sp_urbanismo"
                  target="_blank"
                  className="hover:underline"
                >
                  São Paulo Urbanismo
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-6 text-center text-sm">
          <p>© 2025 Prefeitura de São Paulo. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
