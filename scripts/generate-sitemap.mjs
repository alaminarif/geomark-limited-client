import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const rootDir = process.cwd();
const publicDir = path.join(rootDir, "public");
const sitemapOutputPath = path.join(publicDir, "sitemap.xml");
const robotsOutputPath = path.join(publicDir, "robots.txt");

const readEnvFile = () => {
  const envPath = path.join(rootDir, ".env");
  if (!existsSync(envPath)) return {};

  return readFileSync(envPath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .reduce((acc, line) => {
      const [key, ...valueParts] = line.split("=");
      acc[key] = valueParts.join("=").replace(/^["']|["']$/g, "");
      return acc;
    }, {});
};

const envFile = readEnvFile();
const siteUrl = (process.env.VITE_SITE_URL || envFile.VITE_SITE_URL || "https://geomark-limited-client.vercel.app").replace(/\/$/, "");
const apiUrl = (process.env.VITE_BASE_URL || envFile.VITE_BASE_URL || "").replace(/\/$/, "");

const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/projects", changefreq: "weekly", priority: "0.9" },
  { path: "/product", changefreq: "weekly", priority: "0.7" },
  { path: "/client", changefreq: "monthly", priority: "0.7" },
  { path: "/employees", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
];

const dynamicResources = [
  { endpoint: "/service", route: "/service", changefreq: "monthly", priority: "0.7" },
  { endpoint: "/project", route: "/project", changefreq: "monthly", priority: "0.8" },
  { endpoint: "/product", route: "/product", changefreq: "weekly", priority: "0.6" },
  { endpoint: "/client", route: "/client", changefreq: "monthly", priority: "0.5" },
  { endpoint: "/employee", route: "/employee", changefreq: "monthly", priority: "0.5", params: { limit: "1000", sort: "rank" } },
];

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const toAbsoluteUrl = (routePath) => {
  const normalizedPath = routePath === "/" ? "/" : `/${routePath.replace(/^\/+|\/+$/g, "")}`;
  return `${siteUrl}${normalizedPath === "/" ? "/" : normalizedPath}`;
};

const createUrlEntry = ({ loc, lastmod, changefreq, priority }) => {
  const lines = ["  <url>", `    <loc>${escapeXml(loc)}</loc>`];

  if (lastmod) lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  if (changefreq) lines.push(`    <changefreq>${escapeXml(changefreq)}</changefreq>`);
  if (priority) lines.push(`    <priority>${escapeXml(priority)}</priority>`);

  lines.push("  </url>");
  return lines.join("\n");
};

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${apiUrl}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });
  return url;
};

const getResponseData = (payload) => {
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.data?.data)) return payload.data.data;
  return [];
};

const fetchResourceItems = async ({ endpoint, params }) => {
  if (!apiUrl) return [];

  try {
    const response = await fetch(buildUrl(endpoint, params));
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

    const payload = await response.json();
    return getResponseData(payload);
  } catch (error) {
    console.warn(`Skipping dynamic sitemap entries for ${endpoint}: ${error.message}`);
    return [];
  }
};

const buildSitemap = async () => {
  const urls = staticRoutes.map((route) => ({
    loc: toAbsoluteUrl(route.path),
    changefreq: route.changefreq,
    priority: route.priority,
  }));

  for (const resource of dynamicResources) {
    const items = await fetchResourceItems(resource);

    for (const item of items) {
      if (!item?._id) continue;

      urls.push({
        loc: toAbsoluteUrl(`${resource.route}/${item._id}`),
        lastmod: formatDate(item.updatedAt || item.createdAt),
        changefreq: resource.changefreq,
        priority: resource.priority,
      });
    }
  }

  const uniqueUrls = Array.from(new Map(urls.map((url) => [url.loc, url])).values());

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...uniqueUrls.map(createUrlEntry),
    "</urlset>",
    "",
  ].join("\n");
};

const buildRobotsTxt = () =>
  [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /user",
    "Disallow: /login",
    "Disallow: /register",
    "Disallow: /forgot-password",
    "Disallow: /reset-password",
    "Disallow: /unauthorized",
    "",
    `Sitemap: ${siteUrl}/sitemap.xml`,
    "",
  ].join("\n");

mkdirSync(publicDir, { recursive: true });
writeFileSync(sitemapOutputPath, await buildSitemap(), "utf8");
writeFileSync(robotsOutputPath, buildRobotsTxt(), "utf8");
console.log(`Sitemap generated at ${sitemapOutputPath}`);
console.log(`Robots file generated at ${robotsOutputPath}`);
