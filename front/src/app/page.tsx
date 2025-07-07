import Link from 'next/link'

export default function SabiduriaOmniversal() {
  return (
    <div className="min-h-screen flex justify-center items-center bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/ChatGPT3.png')", // Cambiá esto según tu path
      }}
    >

      {/* Buttons Container */}
      <div className="absolute bottom-6 flex gap-4">
        <Link href="/betaomega" className="btn-secondary-betaomega">
          Explorar
        </Link>
        <Link href="/register" className="btn-primary-betaomega">
          Registrarme
        </Link>
      </div>
    </div>
  );
}
