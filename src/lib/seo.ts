export const SITE_NAME = "Geomark Limited";
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://geomark.com.bd").replace(/\/$/, "");
export const DEFAULT_IMAGE = "/Geomark_Logo_png.png";
export const DEFAULT_DESCRIPTION =
  "Geomark Limited provides GIS, digital mapping, topographical survey, planning, engineering consultancy and IT-enabled geospatial services in Bangladesh.";

export type SeoConfig = {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  type?: "website" | "article" | "product" | "profile";
  canonical?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const defaultKeywords = [
  "Geomark Limited",
  "GIS Bangladesh",
  "digital mapping",
  "topographical survey",
  "geospatial consultancy",
  "planning consultancy",
  "remote sensing",
  "Dhaka Bangladesh",
];

export const absoluteUrl = (pathOrUrl = "/") => {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${normalizedPath}`;
};

export const stripHtml = (value = "") => value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export const truncateText = (value = DEFAULT_DESCRIPTION, maxLength = 155) => {
  const cleanValue = stripHtml(value);
  if (cleanValue.length <= maxLength) return cleanValue;
  return `${cleanValue.slice(0, maxLength - 1).trim()}...`;
};

export const formatSeoTitle = (title: string) => (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`);

export const createOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: absoluteUrl(DEFAULT_IMAGE),
  email: "geomarkbd@gmail.com",
  telephone: "+8801943223060",
  address: {
    "@type": "PostalAddress",
    streetAddress: "House 33, Road 12, Pisciculture Housing Society, Mohammadpur",
    addressLocality: "Dhaka",
    addressCountry: "BD",
  },
});

export const createWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: DEFAULT_DESCRIPTION,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
  },
});

export const createBreadcrumbSchema = (items: { name: string; path: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const createServiceSchema = ({
  name,
  description,
  image,
  path,
}: {
  name: string;
  description?: string;
  image?: string;
  path: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name,
  description: truncateText(description),
  image: image ? absoluteUrl(image) : absoluteUrl(DEFAULT_IMAGE),
  url: absoluteUrl(path),
  provider: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  areaServed: {
    "@type": "Country",
    name: "Bangladesh",
  },
});

export const createCreativeWorkSchema = ({
  name,
  description,
  image,
  path,
}: {
  name: string;
  description?: string;
  image?: string;
  path: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name,
  description: truncateText(description),
  image: image ? absoluteUrl(image) : absoluteUrl(DEFAULT_IMAGE),
  url: absoluteUrl(path),
  creator: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
});

export const createProductSchema = ({
  name,
  description,
  image,
  path,
}: {
  name: string;
  description?: string;
  image?: string;
  path: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name,
  description: truncateText(description),
  image: image ? absoluteUrl(image) : absoluteUrl(DEFAULT_IMAGE),
  url: absoluteUrl(path),
  brand: {
    "@type": "Brand",
    name: SITE_NAME,
  },
});

export const publicRouteSeo: Record<string, SeoConfig> = {
  "/": {
    title: "GIS, Surveying and Planning Consultancy in Bangladesh",
    description: DEFAULT_DESCRIPTION,
    keywords: defaultKeywords,
    canonical: "/",
    jsonLd: [createOrganizationSchema(), createWebsiteSchema()],
  },
  "/about": {
    title: "About Geomark Limited",
    description:
      "Learn about Geomark Limited, a Bangladesh-based planning, GIS, survey, mapping, ITES and professional consulting company founded in 1999.",
    keywords: ["about Geomark Limited", "GIS company Bangladesh", "planning consultancy Bangladesh", ...defaultKeywords],
    canonical: "/about",
  },
  "/services": {
    title: "GIS, Surveying, Mapping and Planning Services",
    description:
      "Explore Geomark Limited service sectors including GIS, CAD, LIS, MIS, digital mapping, remote sensing, survey, planning and IT-enabled services.",
    keywords: ["GIS services Bangladesh", "survey services Bangladesh", "digital mapping services", ...defaultKeywords],
    canonical: "/services",
  },
  "/projects": {
    title: "Projects and Consulting Portfolio",
    description:
      "View Geomark Limited projects across GIS, digital mapping, survey, planning, engineering consultancy, development studies and geospatial solutions.",
    keywords: ["Geomark projects", "GIS project Bangladesh", "survey project portfolio", ...defaultKeywords],
    canonical: "/projects",
  },
  "/product": {
    title: "Products",
    description: "Browse Geomark Limited products for survey, mapping, geospatial, planning and technical project needs.",
    keywords: ["Geomark products", "survey products", "geospatial products", ...defaultKeywords],
    canonical: "/product",
  },
  "/client": {
    title: "Clients",
    description: "See the organizations and clients that trust Geomark Limited for GIS, planning, survey and consulting projects.",
    keywords: ["Geomark clients", "GIS consultancy clients", "Bangladesh consulting clients", ...defaultKeywords],
    canonical: "/client",
  },
  "/employees": {
    title: "Team",
    description: "Meet the Geomark Limited team behind GIS, planning, survey, mapping, IT-enabled and consulting project delivery.",
    keywords: ["Geomark team", "GIS experts Bangladesh", "survey team Bangladesh", ...defaultKeywords],
    canonical: "/employees",
  },
  "/contact": {
    title: "Contact",
    description:
      "Contact Geomark Limited at Mohammadpur, Dhaka for GIS, survey, digital mapping, planning, engineering consultancy and IT-enabled services.",
    keywords: ["contact Geomark Limited", "Geomark Dhaka", "GIS consultancy contact Bangladesh", ...defaultKeywords],
    canonical: "/contact",
  },
};
