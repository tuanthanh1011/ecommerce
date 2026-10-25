import { Alatsi, Noto_Sans, Noto_Serif_Display, Roboto } from "next/font/google";

/**
 * Typography of the S+ Coffee Canva design (fonts read from the exported
 * design), used on the public website and in the CMS previews of it. The
 * admin CMS keeps Be Vietnam Pro for its own UI.
 *
 * - Alatsi: logo, menu, headings and most text
 * - Noto Serif Display: paragraphs and the spaced taglines
 * - Roboto: the "Đăng Nhập" / account button
 * - Noto Sans (bold): the big "Không Gian" title
 */
export const displayFont = Alatsi({
  variable: "--font-display",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: "400",
});

export const bodyFont = Noto_Serif_Display({
  variable: "--font-body-serif",
  subsets: ["latin", "latin-ext", "vietnamese"],
});

export const uiFont = Roboto({
  variable: "--font-ui",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500"],
});

export const titleFont = Noto_Sans({
  variable: "--font-title",
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: "700",
});

/** className that exposes every font variable above. */
export const fontVariables = [
  displayFont.variable,
  bodyFont.variable,
  uiFont.variable,
  titleFont.variable,
].join(" ");
