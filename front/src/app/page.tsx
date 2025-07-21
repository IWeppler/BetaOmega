"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SabiduriaOmniversal() {
  const versiculos = [
    "“El Señor es mi pastor, nada me faltará.” – Salmo 23:1",
    "“Todo lo puedo en Cristo que me fortalece.” – Filipenses 4:13",
    "“No temas, porque yo estoy contigo.” – Isaías 41:10",
    "“Porque de tal manera amó Dios al mundo…” – Juan 3:16",
    "“El que habita al abrigo del Altísimo morará bajo la sombra del Omnipotente.” – Salmo 91:1",
    "“En el principio creó Dios los cielos y la tierra.” – Génesis 1:1",
    "“Amarás a tu prójimo como a ti mismo.” – Mateo 22:39",
    "“La fe es la certeza de lo que se espera, la convicción de lo que no se ve.” – Hebreos 11:1",
    "“Bendice, alma mía, al Señor, y no olvides ninguno de sus beneficios.” – Salmo 103:2",
    "“El gozo del Señor es mi fortaleza.” – Nehemías 8:10",
  ];

  const [versiculo, setVersiculo] = useState("");

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * versiculos.length);
    setVersiculo(versiculos[randomIndex]);
  }, []);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center flex flex-col items-center justify-end text-white"
      style={{
        backgroundImage: "url('/ChatGPT3.png')",
      }}
    >
      {/* Degradado oscuro desde abajo */}
      <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none z-0" />

      {/* Versículo animado */}
      <motion.div
        className="relative z-10 mb-16 max-w-xl text-center text-lg sm:text-xl font-semibold px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        {versiculo}
      </motion.div>

      {/* Botones */}
      <motion.div
        className="mb-8 flex"
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <div className="relative z-10 flex gap-4">
          <Link
            href="/betaomega"
            className="px-6 py-3 rounded-lg border-2 border-white/50 text-white backdrop-blur-md hover:border-orange-500 hover:shadow-[0_0_15px_5px_rgba(255,159,16,0.4)] transition duration-300"
          >
            Explorar
          </Link>
          <Link
            href="/register"
            className="relative px-6 py-3 rounded-lg bg-orange-500 text-white font-medium transition duration-300 hover:bg-orange-600 hover:shadow-[0_0_15px_5px_rgba(255,159,16,0.4)]"
          >
            Registrarme
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
