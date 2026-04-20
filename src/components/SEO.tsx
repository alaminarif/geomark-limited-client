import { useEffect } from "react";

import { absoluteUrl, DEFAULT_DESCRIPTION, DEFAULT_IMAGE, formatSeoTitle, SITE_NAME, type SeoConfig } from "@/lib/seo";

const upsertMeta = (attribute: "name" | "property", key: string, content?: string) => {
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);

  if (!content) {
    tag?.remove();
    return;
  }

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

const upsertJsonLd = (jsonLd?: SeoConfig["jsonLd"]) => {
  const scriptId = "page-json-ld";
  const existingScript = document.getElementById(scriptId);

  if (!jsonLd) {
    existingScript?.remove();
    return;
  }

  const script = existingScript || document.createElement("script");
  script.id = scriptId;
  script.setAttribute("type", "application/ld+json");
  script.textContent = JSON.stringify(jsonLd);

  if (!existingScript) {
    document.head.appendChild(script);
  }
};

const SEO = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  image = DEFAULT_IMAGE,
  type = "website",
  canonical = "/",
  noIndex = false,
  jsonLd,
}: SeoConfig) => {
  useEffect(() => {
    const pageTitle = formatSeoTitle(title);
    const pageDescription = description || DEFAULT_DESCRIPTION;
    const canonicalUrl = absoluteUrl(canonical);
    const imageUrl = absoluteUrl(image);
    const robots = noIndex ? "noindex, nofollow" : "index, follow";

    document.title = pageTitle;

    upsertCanonical(canonicalUrl);
    upsertMeta("name", "description", pageDescription);
    upsertMeta("name", "keywords", keywords?.join(", "));
    upsertMeta("name", "author", SITE_NAME);
    upsertMeta("name", "robots", robots);

    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:locale", "en_BD");
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:title", pageTitle);
    upsertMeta("property", "og:description", pageDescription);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", imageUrl);
    upsertMeta("property", "og:image:alt", pageTitle);

    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", pageTitle);
    upsertMeta("name", "twitter:description", pageDescription);
    upsertMeta("name", "twitter:image", imageUrl);
    upsertMeta("name", "twitter:image:alt", pageTitle);

    upsertJsonLd(jsonLd);
  }, [canonical, description, image, jsonLd, keywords, noIndex, title, type]);

  return null;
};

export default SEO;
