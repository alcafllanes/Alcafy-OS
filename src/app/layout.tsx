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
  title: "Alcafy - a life captured always 𐙚",
  description: "Alcafy is an all-in-one digital life organization platform that brings every part of your life together in one beautiful, organized space. Manage your work, school, finances, journal, travel, goals, content, and more—all from one place.",
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
