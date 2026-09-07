import type { Metadata } from "next";
import "./globals.css";
import { kanit, lato } from "./fonts";
import { Toaster } from "@/components/ui/sonner";
import { RouteLoaderProvider } from "@/components/common/route-loader-provider";


export const metadata: Metadata = {
  title: "Zakah Advisor",
  description: "Zakah Advisor charity assessment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lato.variable} ${kanit.variable} antialiased`}
      >
        <RouteLoaderProvider>
          {children}
          <Toaster />
        </RouteLoaderProvider>
      </body>
    </html>
  );
}
