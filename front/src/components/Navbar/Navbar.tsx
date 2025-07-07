import Image from "next/image";
import Link from "next/link";
import { routes } from "@/app/routes";
import { NavClient } from "./NavClient";

export const Navbar = () => {
  return (
    <header className="bg-brutal-white border-b-4 border-brutal-black">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={routes.home} className="flex items-center space-x-4">
            <Image src="/byo.png" alt="Logo" width={50} height={40} />
          </Link>

          {/* Desktop nav y CSR nav */}
          <NavClient />
        </div>
      </div>
    </header>
  );
};
