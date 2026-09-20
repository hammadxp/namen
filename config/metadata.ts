import type { Metadata } from "next";

const SITE_NAME = "Naime";
const SITE_DESCRIPTION = "Search memorable names found in cities, colors, fruit, science, elements, and stars.";

export const siteMetadata: Metadata = {
  title: {
    default: `${SITE_NAME} | A colorful collection of names`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description },
  };
}
