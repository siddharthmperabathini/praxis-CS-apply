import { Metadata } from "next";

export const SITE_CONFIG: Metadata = {
  title: {
    default: "Astra - Tailored Job Application Generator",
    template: `%s | Astra`,
  },
  description: "Astra helps you auto-generate polished job applications tailored to roles like Software Engineering, DevOps, Embedded Systems, and more — all in minutes.",
  icons: {
    icon: [
      {
        url: "/icons/favicon.ico",
        href: "/icons/favicon.ico",
      },
    ],
  },
  openGraph: {
    title: "Astra - Tailored Job Application Generator",
    description: "Craft role-specific resumes, cover letters, and project portfolios effortlessly. Astra personalizes your application for each job you apply to.",
    images: [
      {
        url: "/assets/og-image.png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@shreyassihasane",
    title: "Astra - Tailored Job Application Generator",
    description: "Stand out in the job market. Astra builds custom application pages for roles across tech — from DevOps to Embedded Systems.",
    images: [
      {
        url: "/assets/og-image.png",
      },
    ],
  },
  metadataBase: new URL("https://astra-app.vercel.app"),
};
