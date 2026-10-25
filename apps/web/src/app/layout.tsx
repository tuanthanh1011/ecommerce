import type { Metadata } from "next";
import { Be_Vietnam_Pro, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { fontVariables } from "@/components/site/display-font";
import { Providers } from "./providers";

// Be Vietnam Pro is drawn for Vietnamese diacritics — crisp at small UI sizes.
const sans = Be_Vietnam_Pro({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "S+ Coffee",
  description: "S+ — câu chuyện, sản phẩm, tin tức và tuyển dụng.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${sans.variable} ${mono.variable} ${fontVariables} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
