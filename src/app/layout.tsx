import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mohamed Tagy — Solution Architect Track · Systems Engineer",
  description:
    "Mohamed Waleed Tagy builds systems that keep watch: Dynamics 365 and Power Platform solutions delivered to sign-off, real-time computer vision on bare CPUs (99.2% ViT), marine radar commissioned in the field, and freelance web portals in production. Alexandria, Egypt.",
  keywords: [
    "Mohamed Tagy",
    "solution architect",
    "Dynamics 365",
    "Power Platform",
    "Dataverse",
    "systems engineer",
    "computer vision",
    "marine radar",
    "freelance web developer",
    "E-JUST",
    "Alexandria",
  ],
  openGraph: {
    title: "Mohamed Tagy — Solution Architect Track · Systems Engineer",
    description:
      "Systems that keep watch — Dynamics 365 solutions, computer vision, marine radar, freelance web delivery. Alexandria, Egypt.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#070c09",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    /* the theme boot script writes data-theme before hydration */
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${archivo.variable} ${plexMono.variable} ${instrumentSerif.variable} noise`}
      >
        {/* apply the stored watch (theme) before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(localStorage.getItem('mwt-theme')==='day'){document.documentElement.dataset.theme='light';var m=document.querySelector('meta[name=\"theme-color\"]');if(m)m.setAttribute('content','#ecf1ea')}}catch(e){}",
          }}
        />
        {children}
      </body>
    </html>
  );
}
