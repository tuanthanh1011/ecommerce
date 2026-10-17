import { Playfair_Display } from "next/font/google";

// Display serif for headings — scoped to the public website and to the CMS
// previews of it (the admin CMS keeps Be Vietnam Pro everywhere else).
export const displayFont = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700"],
});
