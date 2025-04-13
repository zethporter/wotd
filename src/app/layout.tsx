import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "sonner";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "WOTD",
  description: "Vote for Wrestler of the tournament",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <Toaster
          icons={{
            loading: <span className="loading loading-ball loading-md"></span>,
          }}
          theme="system"
          toastOptions={{
            unstyled: true,
            classNames: {
              success:
                "w-full text-wrap overflow-clip alert alert-success alert-soft",
              error:
                "w-full text-wrap overflow-clip alert alert-error alert-soft",
              warning:
                "w-full text-wrap overflow-clip alert alert-warning alert-soft",
              info: "w-full text-wrap overflow-clip alert alert-info alert-soft",
              loading:
                "w-full text-wrap overflow-clip alert alert-info alert-soft",
              default: "w-full text-wrap overflow-clip alert alert-soft",
            },
          }}
        />
      </body>
    </html>
  );
}
