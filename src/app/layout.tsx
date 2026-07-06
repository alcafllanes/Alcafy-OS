import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import BlobHover from "@/components/BlobHover";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Alcafy, Your life, organized.",
  description: "A personal life-organization hub for finances, goals, work, study, journaling, content, and travel.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <script
          // Runs before paint so the dark/light class is correct on first frame.
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('alcafy-theme');
                if (t === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <BlobHover />
        {children}
      </body>
    </html>
  );
}
