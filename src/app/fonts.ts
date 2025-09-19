import { Lato, Kanit } from "next/font/google";

export const lato = Lato({
    variable: "--font-lato",
    subsets: ["latin"],
    weight: ["100", "300", "400", "700", "900"],
});

export const kanit = Kanit({
    variable: "--font-kanit",
    subsets: ["latin"],
    weight: ["100", "300", "400", "700", "900"],
});