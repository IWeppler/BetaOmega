import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthInitializer } from "@/features/auth/AuthInitializer";
import { AuthModal } from "@/features/auth/AuthModal";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://betaomega.vercel.app/"),
  title: {
    default: "Sabiduría Omniversal Supina",
    template: "%s | Sabiduría Omniversal Supina",
  },
  description:
    "Descubre los secretos del universo y conecta con la sabiduría divina.",
  keywords: [
    "sabiduría",
    "omniversal",
    "omniverso",
    "beta & omega",
    "betaomega",
    "dios",
    "yhwh",
    "jehova",
    "energias",
    "meditación",
    "conocimiento",
    "espiritualidad",
    "universo",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    locale: "es_ES",
    type: "website",
    url: "https://betaomega.vercel.app/",
    title: "Sabiduría Omniversal Supina",
    description:
      "Descubre los secretos del universo y conecta con la sabiduría divina.",
    siteName: "Sabiduría Omniversal Supina",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sabiduría Omniversal Supina",
    description:
      "Descubre los secretos del universo y conecta con la sabiduría divina.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased font-brutal-mono">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-E67FBEJRL0"
          strategy="afterInteractive"
        />
        <Script id="ga-setup" strategy="afterInteractive">
          {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-E67FBEJRL0', {
    page_path: window.location.pathname,
  });
`}
        </Script>
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Sabiduría Omniversal Supina",
              url: "https://betaomega.vercel.app/",
              potentialAction: {
                "@type": "SearchAction",
                target:
                  "https://betaomega.vercel.app/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <AuthInitializer />
        <AuthModal />
        {children}
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
