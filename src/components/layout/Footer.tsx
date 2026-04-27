import Logo from "@/assets/images/Geomark_Logo_png.png";
import { useGetAllServicesQuery } from "@/redux/features/service/service.api";
import { ArrowUpRight, Clock, Facebook, Linkedin, Mail, MapPin, MessageCircle, Phone, Twitter, type LucideIcon } from "lucide-react";
import { Link } from "react-router";

type FooterService = {
  _id: string;
  name: string;
};

type FooterLink = {
  label: string;
  to: string;
};

type SocialLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const companyLinks: FooterLink[] = [
  { label: "About Geomark", to: "/about" },
  { label: "Projects", to: "/projects" },
  { label: "Clients", to: "/client" },
  { label: "Team", to: "/employees" },
];

const exploreLinks: FooterLink[] = [
  { label: "Services", to: "/services" },
  { label: "Products", to: "/product" },
  { label: "Contact", to: "/contact" },
];

const socialLinks: SocialLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/geomark-limited-072025",
    icon: Linkedin,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61565933404947",
    icon: Facebook,
  },
  {
    label: "X / Twitter",
    href: "https://twitter.com/geomarklimited",
    icon: Twitter,
  },
  {
    label: "WhatsApp",
    href: "https://api.whatsapp.com/send?phone=8801716291050",
    icon: MessageCircle,
  },
];

const contactItems = [
  {
    icon: MapPin,
    label: "House 33, Road 12, Pisciculture Housing Society, Mohammadpur, Dhaka, Bangladesh.",
  },
  {
    icon: Phone,
    label: "01943223060",
    href: "tel:+8801943223060",
  },
  {
    icon: Mail,
    label: "geomarkbd@gmail.com",
    href: "mailto:geomarkbd@gmail.com",
  },
  {
    icon: Clock,
    label: "Saturday - Thursday, 09:00 AM - 06:00 PM",
  },
];

const footerLinkClass = "text-sm leading-6 text-muted-foreground transition hover:text-primary";

export default function Footer() {
  const { data } = useGetAllServicesQuery({ limit: 3 });
  const currentYear = new Date().getFullYear();
  const services = (data?.data || []) as FooterService[];

  return (
    <footer className="border-t border-border/70 bg-muted/35">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1.85fr] xl:gap-16">
          <div className="max-w-xl">
            <Link to="/" className="inline-flex items-center" aria-label="Go to Geomark Limited homepage">
              <img src={Logo} alt="Geomark Limited" className="h-16 w-auto" />
            </Link>

            <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground">
              Geomark Limited provides GIS, digital mapping, surveying, planning, and IT-enabled consultancy for development projects across
              Bangladesh.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              >
                Contact Office
                <ArrowUpRight className="size-4" />
              </Link>

              <a
                href="mailto:geomarkbd@gmail.com"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary/50 hover:text-primary"
              >
                Email Us
                <Mail className="size-4" />
              </a>
            </div>

            <div className="mt-8 flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open Geomark Limited on ${item.label}`}
                    className="flex size-10 items-center justify-center rounded-full border border-border bg-background/70 text-blue-800 transition hover:border-primary/60 hover:bg-primary hover:text-primary-foreground dark:text-blue-300"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
            <div>
              <h2 className="text-sm font-bold uppercase text-foreground">Services</h2>
              <ul className="mt-5 space-y-3">
                {services.map((item) => (
                  <li key={item._id}>
                    <Link to={`/service/${item._id}`} className={footerLinkClass}>
                      {item.name}
                    </Link>
                  </li>
                ))}

                <li>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-blue-800 transition hover:text-primary dark:text-blue-300"
                  >
                    View all services
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase text-foreground">Company</h2>
              <ul className="mt-5 space-y-3">
                {companyLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={footerLinkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase text-foreground">Explore</h2>
              <ul className="mt-5 space-y-3">
                {exploreLinks.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className={footerLinkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-sm font-bold uppercase text-foreground">Office</h2>
              <ul className="mt-5 space-y-4">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <>
                      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span>{item.label}</span>
                    </>
                  );

                  return (
                    <li key={item.label}>
                      {item.href ? (
                        <a href={item.href} className="flex gap-3 text-sm leading-6 text-muted-foreground transition hover:text-primary">
                          {content}
                        </a>
                      ) : (
                        <div className="flex gap-3 text-sm leading-6 text-muted-foreground">{content}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border/70 pt-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {currentYear} Geomark Limited. All rights reserved.</p>
          <p>GIS, surveying, digital mapping and planning consultancy in Bangladesh.</p>
        </div>
      </div>
    </footer>
  );
}
